package handlers

import (
	"encoding/json"
	"fmt"
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

	query := r.URL.Query()
	page, _ := strconv.Atoi(query.Get("page"))
	pageSize, _ := strconv.Atoi(query.Get("pageSize"))
	valid, username := verifyTokenPresency(r)

	if !valid {
		summary := "User tried to list users"
		description := "User tried to list users but token was not valid"
		logType := "ERROR"
		utilities.SendLogToNats(username, summary, description, logType)
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

	summary := "Users listed"
	description := "Users list was requested"
	logType := "INFO"
	utilities.SendLogToNats(username, summary, description, logType)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func PostUserHandler(w http.ResponseWriter, r *http.Request) {

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	if user.Email == "" || user.Username == "" || user.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("El email, password y nombre son obligatorios"))
		username := user.Username
		summary := "User tried to register"
		description := "User tried to register but did not provide all the required fields"
		logType := "ERROR"
		utilities.SendLogToNats(username, summary, description, logType)
		return
	}
	createdUser, err := utilities.PostUser(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Ocurrio un error al crear el usuario"))
		username := user.Username
		summary := "User tried to register"
		description := "User tried to register but an error occurred"
		logType := "ERROR"
		utilities.SendLogToNats(username, summary, description, logType)
		return
	}

	username := createdUser.Username
	summary := "User created"
	description := "User " + createdUser.Username + " created with email " + createdUser.Email
	tipo := "CREATION"
	utilities.SendLogToNats(username, summary, description, tipo)
	
	utilities.NotifyUserEvent(username, createdUser.Email, "CREATION")


	json.NewEncoder(w).Encode(&createdUser)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {

	valid, username := verifyTokenPresency(r)
	if !valid {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		summary := "User tried to update"
		description := "User tried to update but token was not valid"
		logType := "ERROR"
		utilities.SendLogToNats(username, summary, description, logType)
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)
	oldEmail := r.URL.Query().Get("oldEmail")
	if oldEmail == "" {oldEmail = user.Email}
	_, err := utilities.UpdateUser(user, oldEmail)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))

		sumarry := "User tried to be updated"
		description := "User  tried to be updated but did not provide jwt token"
		logType := "ERROR"
		utilities.SendLogToNats(username, sumarry, description, logType)

	} else {

		summary := "User was updated"
		description := "User " + user.Username + " with email " + user.Email + " was updated"
		logType := "UPDATE"
		utilities.SendLogToNats(username, summary, description, logType)
		email := oldEmail + "," + user.Email
		utilities.NotifyUserEvent(username, email, "UPDATE")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Usuario was updated"))
	}

}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	valid, username := verifyTokenPresency(r)
	if !valid {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		summary := "User tried to delete"
		description := "User tried to delete but token was not valid"
		logType := "ERROR"
		utilities.SendLogToNats(username, summary, description, logType)
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	query := r.URL.Query()
	email := query.Get("email")
	err := utilities.DeleteUser(email)

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))

		summary := "User tried to delete"
		description := "User  tried to delete but did not provide a valid email"
		logType := "ERROR"
		utilities.SendLogToNats(username, summary, description, logType)
		return
	}

	summary := "User was deleted"
	description := "User with email " + email + " was deleted"
	logType := "DELETION"
	utilities.SendLogToNats(username, summary, description, logType)
	utilities.NotifyUserEvent(username, email, "DELETION")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Usuario eliminado"))
}

func UpdateUserPassword(w http.ResponseWriter, r *http.Request) {

	valid, username := verifyTokenPresency(r)
	if !valid {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		summary := "User tried to update password"
		description := "User tried to update password but token was not valid"
		logType := "ERROR"
		utilities.SendLogToNats(username, summary, description, logType)
		http.Error(w, "Token no válido", http.StatusUnauthorized)
		return
	}

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	_, err := utilities.UpdateUserPassword(user)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found "))
		summary := "User tried to be updated"
		description := "User  tried to be updated but did not provide a valid user info"
		logType := "ERROR"
		utilities.SendLogToNats(username, summary, description, logType)
		return
	}

	summary := "User password was updated"
	description := "User " + user.Username + " with email " + user.Email + " updated his password"
	logType := "UPDATE"
	utilities.SendLogToNats(username, summary, description, logType)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Password updated"))

}

func GetUserHandlerByEmail(w http.ResponseWriter, r *http.Request) {
	
	valid, _ := verifyTokenPresency(r)
	if !valid {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		return
	}

	params := mux.Vars(r)
	var user *models.User
	fmt.Println(params["email"])
	user, _ = utilities.GetUserByEmail(params["email"])

	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Usuario no encontrado"))
		return
	}

	json.NewEncoder(w).Encode(&user)

}

func RecoverPassword(w http.ResponseWriter, r *http.Request) {

	query := r.URL.Query()
	email := query.Get("email")

	password, usr, err := utilities.RecoverPassword(email)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		name := usr
		summary := "User tried to recover password"
		description := "User  tried to recover password but did not provide a valid email"
		logType := "ERROR"
		utilities.SendLogToNats(name, summary, description, logType)
		return
	}

	name := usr
	summary := "User recovered password"
	description := "User with email " + email + " recovered his password"
	logType := "INFO"	
	utilities.SendLogToNats(name, summary, description, logType)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(password))
}

func verifyTokenPresency(r *http.Request) (bool,string) {

	authHeader := r.Header.Get("Authorization")

	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

	verified,user := security.VerifyToken(tokenString)
	return verified, user
}
