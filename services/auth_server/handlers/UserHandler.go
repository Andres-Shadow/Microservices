package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	DataBase "taller_apirest/Database"
	"taller_apirest/models"
	"taller_apirest/security"
	"taller_apirest/utilities"

	"github.com/gorilla/mux"
)

type UsersResponse struct {
	Users []models.User `json:"users"`
	Total int64         `json:"total"`
}

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresence(r)
	if !valid {
		utilities.SendLogToNats(username, "List users", "Unauthorized attempt to list users", "ERROR")
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "Invalid or missing token"})
		return
	}

	query := r.URL.Query()
	page, _ := strconv.Atoi(query.Get("page"))
	pageSize, _ := strconv.Atoi(query.Get("pageSize"))
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}

	users, _ := utilities.GetUsers(page, pageSize)

	var totalCount int64
	DataBase.DB.Raw("SELECT COUNT(1) FROM users").Scan(&totalCount)

	utilities.SendLogToNats(username, "Users listed", "User list was requested successfully", "INFO")

	respondJSON(w, http.StatusOK, UsersResponse{
		Users: users,
		Total: totalCount,
	})
}

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	if user.Email == "" || user.Username == "" || user.Password == "" {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Email, password and username are required"})
		utilities.SendLogToNats(user.Username, "User registration failed", "Missing required fields during registration", "ERROR")
		return
	}

	createdUser, err := utilities.CreateUser(user)
	if err != nil {
		respondJSON(w, http.StatusConflict, map[string]string{"error": "Could not create user: " + err.Error()})
		utilities.SendLogToNats(user.Username, "User registration failed", "Error creating user: "+err.Error(), "ERROR")
		return
	}

	utilities.SendLogToNats(
		createdUser.Username,
		"User created",
		"User "+createdUser.Username+" registered with email "+createdUser.Email,
		"CREATION",
	)
	utilities.NotifyUserEvent(createdUser.Username, createdUser.Email, "CREATION")

	respondJSON(w, http.StatusCreated, createdUser)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresence(r)
	if !valid {
		utilities.SendLogToNats(username, "Update user", "Unauthorized update attempt", "ERROR")
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "Invalid or missing token"})
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	oldEmail := r.URL.Query().Get("oldEmail")
	if oldEmail == "" {
		oldEmail = user.Email
	}

	if _, err := utilities.UpdateUser(user, oldEmail); err != nil {
		utilities.SendLogToNats(username, "Update user", "User not found for update", "ERROR")
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "User not found"})
		return
	}

	utilities.SendLogToNats(
		username,
		"User updated",
		"User "+user.Username+" with email "+user.Email+" was updated",
		"UPDATE",
	)
	utilities.NotifyUserEvent(username, oldEmail+","+user.Email, "UPDATE")

	respondJSON(w, http.StatusOK, map[string]string{"message": "User updated successfully"})
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresence(r)
	if !valid {
		utilities.SendLogToNats(username, "Delete user", "Unauthorized delete attempt", "ERROR")
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "Invalid or missing token"})
		return
	}

	// RESTful: email viene del path param /{email}
	params := mux.Vars(r)
	email := params["email"]
	if email == "" {
		// Fallback: accept query param for backward compatibility
		email = r.URL.Query().Get("email")
	}
	if email == "" {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Email is required"})
		return
	}

	if err := utilities.DeleteUser(email); err != nil {
		utilities.SendLogToNats(username, "Delete user failed", "User not found for deletion: "+email, "ERROR")
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "User not found"})
		return
	}

	utilities.SendLogToNats(username, "User deleted", "User with email "+email+" was deleted", "DELETION")
	utilities.NotifyUserEvent(username, email, "DELETION")

	respondJSON(w, http.StatusOK, map[string]string{"message": "User deleted successfully"})
}

func UpdateUserPassword(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresence(r)
	if !valid {
		utilities.SendLogToNats(username, "Update password", "Unauthorized password update attempt", "ERROR")
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "Invalid or missing token"})
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	if _, err := utilities.UpdateUserPassword(user); err != nil {
		utilities.SendLogToNats(username, "Update password failed", "User not found for password update", "ERROR")
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "User not found"})
		return
	}

	utilities.SendLogToNats(
		username,
		"Password updated",
		"User "+user.Username+" with email "+user.Email+" updated their password",
		"UPDATE",
	)
	respondJSON(w, http.StatusOK, map[string]string{"message": "Password updated successfully"})
}

func GetUserHandlerByEmail(w http.ResponseWriter, r *http.Request) {
	valid, _ := verifyTokenPresence(r)
	if !valid {
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "Invalid or missing token"})
		return
	}

	params := mux.Vars(r)
	user, err := utilities.GetUserByEmail(params["email"])
	if err != nil {
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "User not found"})
		return
	}

	respondJSON(w, http.StatusOK, user)
}

func RecoverPassword(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Email query param is required"})
		return
	}

	token, usr, err := utilities.RecoverPassword(email)
	if err != nil {
		utilities.SendLogToNats("unknown", "Password recovery failed", "Password recovery failed for email: "+email, "ERROR")
		respondJSON(w, http.StatusNotFound, map[string]string{"error": "User not found"})
		return
	}

	utilities.SendLogToNats(usr, "Password recovered", "User with email "+email+" recovered their password", "INFO")
	respondJSON(w, http.StatusOK, map[string]string{"token": token})
}

// ── helpers ──────────────────────────────────────────────────────────────────

func verifyTokenPresence(r *http.Request) (bool, string) {
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	return security.VerifyToken(tokenString)
}

func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}
