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
	Clients   []models.User `json:"clients"`
	Registros int64         `json:"registros"`
}

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresency(r)
	if !valid {
		utilities.SendLogToNats(username, "List users", "Unauthorized attempt to list users", "ERROR")
		http.Error(w, "Token no válido", http.StatusUnauthorized)
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

	response := UsersResponse{
		Clients:   users,
		Registros: totalCount,
	}

	utilities.SendLogToNats(username, "Users listed", "Users list was requested", "INFO")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func PostUserHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if user.Email == "" || user.Username == "" || user.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Email, password y username son obligatorios"))
		utilities.SendLogToNats(user.Username, "Register attempt", "Missing required fields", "ERROR")
		return
	}

	createdUser, err := utilities.PostUser(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Error al crear el usuario"))
		utilities.SendLogToNats(user.Username, "Register attempt", "Error creating user: "+err.Error(), "ERROR")
		return
	}

	utilities.SendLogToNats(
		createdUser.Username,
		"User created",
		"User "+createdUser.Username+" created with email "+createdUser.Email,
		"CREATION",
	)
	utilities.NotifyUserEvent(createdUser.Username, createdUser.Email, "CREATION")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(createdUser)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresency(r)
	if !valid {
		utilities.SendLogToNats(username, "Update user", "Unauthorized update attempt", "ERROR")
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	oldEmail := r.URL.Query().Get("oldEmail")
	if oldEmail == "" {
		oldEmail = user.Email
	}

	if _, err := utilities.UpdateUser(user, oldEmail); err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		utilities.SendLogToNats(username, "Update user", "User not found for update", "ERROR")
		return
	}

	utilities.SendLogToNats(
		username,
		"User updated",
		"User "+user.Username+" with email "+user.Email+" was updated",
		"UPDATE",
	)
	utilities.NotifyUserEvent(username, oldEmail+","+user.Email, "UPDATE")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("User was updated"))
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresency(r)
	if !valid {
		utilities.SendLogToNats(username, "Delete user", "Unauthorized delete attempt", "ERROR")
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	email := r.URL.Query().Get("email")
	if err := utilities.DeleteUser(email); err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		utilities.SendLogToNats(username, "Delete user", "User not found for deletion: "+email, "ERROR")
		return
	}

	utilities.SendLogToNats(username, "User deleted", "User with email "+email+" was deleted", "DELETION")
	utilities.NotifyUserEvent(username, email, "DELETION")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Usuario eliminado"))
}

func UpdateUserPassword(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresency(r)
	if !valid {
		utilities.SendLogToNats(username, "Update password", "Unauthorized password update attempt", "ERROR")
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if _, err := utilities.UpdateUserPassword(user); err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		utilities.SendLogToNats(username, "Update password", "User not found for password update", "ERROR")
		return
	}

	utilities.SendLogToNats(
		username,
		"Password updated",
		"User "+user.Username+" with email "+user.Email+" updated their password",
		"UPDATE",
	)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Password updated"))
}

func GetUserHandlerByEmail(w http.ResponseWriter, r *http.Request) {
	valid, _ := verifyTokenPresency(r)
	if !valid {
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	params := mux.Vars(r)
	user, err := utilities.GetUserByEmail(params["email"])
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Usuario no encontrado"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func RecoverPassword(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")

	token, usr, err := utilities.RecoverPassword(email)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		utilities.SendLogToNats("unknown", "Recover password", "Password recovery failed for email: "+email, "ERROR")
		return
	}

	utilities.SendLogToNats(usr, "Password recovered", "User with email "+email+" recovered their password", "INFO")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(token))
}

func verifyTokenPresency(r *http.Request) (bool, string) {
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	return security.VerifyToken(tokenString)
}
