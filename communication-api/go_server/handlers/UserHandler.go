package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	DataBase "taller_apirest/Database"
	"taller_apirest/communication"
	"taller_apirest/models"
	"taller_apirest/security"
	"taller_apirest/utilities"
	"time"

	"github.com/gorilla/mux"
)

type UsersResponse struct {
	Clients   []models.User `json:"clients"`
	Registros int64         `json:"registros"`
}

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {

	query := r.URL.Query()
	page, _ := strconv.Atoi(query.Get("page"))
	pageSize, _ := strconv.Atoi(query.Get("pageSize"))
	logDate := time.Now().Format("02/01/06 - 15:04")

	if !verifyTokenPresency(r) {
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to list users",
			Description: "User tried to list users but token was not valid",
			LogDate:     logDate,
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	if query.Get("page") == "" && query.Get("pageSize") == "" {
		page = 1
		pageSize = 10
	}

	users, _ := utilities.GetUsers(page, pageSize)

	var totalCount int64

	DataBase.DB.Raw("SELECT COUNT(1) FROM users").Scan(&totalCount)

	response := UsersResponse{
		Clients:   users,
		Registros: totalCount,
	}

	notification := models.LogResponse{
		Name:        "USERS-API",
		Summary:     "Users listed",
		Description: "Users list was requested",
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "INFO",
		Module:      "USERS-API",
	}

	communication.ConnectToNATS().SendLog(&notification)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetUserHandlerById(w http.ResponseWriter, r *http.Request) {

	if !verifyTokenPresency(r) {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		return
	}

	params := mux.Vars(r)
	var user *models.User
	user, _ = utilities.GetUserById(params["id"])

	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Usuario no encontrado"))
		return
	}

	json.NewEncoder(w).Encode(&user)
}

func PostUserHandler(w http.ResponseWriter, r *http.Request) {

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	if user.Email == "" || user.Username == "" || user.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("El email, password y nombre son obligatorios"))
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to register",
			Description: "User  tried to registern but did not provide all the required fields",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		return
	}
	createdUser, err := utilities.PostUser(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Ocurrio un error al crear el usuario"))
	}

	notification := models.LogResponse{
		Name:        "USERS-API",
		Summary:     "User created",
		Description: "User " + createdUser.Username + " created with email " + createdUser.Email,
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "CREATION",
		Module:      "USERS-API",
	}

	communication.ConnectToNATS().SendLog(&notification)

	json.NewEncoder(w).Encode(&createdUser)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {

	if !verifyTokenPresency(r) {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to be updated",
			Description: "User tried to be updated but token was not valid",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	_, err := utilities.UpdateUser(user)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))

		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to be updated",
			Description: "User  tried to be updated but did not provide jwt token",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)

	} else {
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User was updated in",
			Description: "User " + user.Username + " with email " + user.Email + " was updated",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "UPDATE",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Usuario was updated"))
	}

}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {

	if !verifyTokenPresency(r) {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to delete",
			Description: "User tried to delete but token was not valid",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	query := r.URL.Query()
	email := query.Get("email")
	err := utilities.DeleteUser(email)

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to delete",
			Description: "User  tried to delete but did not provide a valid email",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		return
	}

	notification := models.LogResponse{
		Name:        "USERS-API",
		Summary:     "User was deleted",
		Description: "User with email " + email + " was deleted",
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "DELETION",
		Module:      "USERS-API",
	}

	communication.ConnectToNATS().SendLog(&notification)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Usuario eliminado"))
}

func UpdateUserPassword(w http.ResponseWriter, r *http.Request) {

	if !verifyTokenPresency(r) {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to update password",
			Description: "User tried to update password but token was not valid",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	_, err := utilities.UpdateUserPassword(user)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found "))
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to be updated",
			Description: "User  tried to be updated but did not provide a valid user info",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		return
	}

	notification := models.LogResponse{
		Name:        "USERS-API",
		Summary:     "User was updated",
		Description: "User " + user.Username + " with email " + user.Email + " updated his password",
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "UPDATE",
		Module:      "USERS-API",
	}

	communication.ConnectToNATS().SendLog(&notification)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Password updated"))

}

func RecoverPassword(w http.ResponseWriter, r *http.Request) {

	query := r.URL.Query()
	email := query.Get("email")

	password, err := utilities.RecoverPassword(email)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to be updated",
			Description: "User  tried to be updated but did not provide a valid user info",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		return
	}

	notification := models.LogResponse{
		Name:        "USERS-API",
		Summary:     "User logged in",
		Description: "User with email " + email + " recovered his password",
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "INFO",
		Module:      "USERS-API",
	}

	communication.ConnectToNATS().SendLog(&notification)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(password))
}

func verifyTokenPresency(r *http.Request) bool {

	authHeader := r.Header.Get("Authorization")

	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

	verified := security.VerifyToken(tokenString)
	return verified
}
