package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"taller_apirest/models"
	"taller_apirest/security"
	"taller_apirest/utilities"

	"github.com/gorilla/mux"
)

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {

	if !verifyTokenPresency(r) {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		return
	}

	var users []models.User
	users, _ = utilities.GetUsers()
	json.NewEncoder(w).Encode(&users)
}

func GetUserHandler(w http.ResponseWriter, r *http.Request) {

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
	createdUser, err := utilities.PostUser(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Ocurrio un error al crear el usuario"))
	}
	json.NewEncoder(w).Encode(&createdUser)
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {

	if !verifyTokenPresency(r) {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		return
	}

	params := mux.Vars(r)
	err := utilities.DeleteUser(params["id"])
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		return
	}
	w.WriteHeader(http.StatusOK)
}

func UpdateUserPassword(w http.ResponseWriter, r *http.Request) {

	if !verifyTokenPresency(r) {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		return
	}

	params := mux.Vars(r)
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)
	
	err,_ := utilities.UpdateUserPassword(user, params["id"])
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		return
	}
	w.WriteHeader(http.StatusOK)
	
}

func RecoverPassword(w http.ResponseWriter, r *http.Request) {

	if !verifyTokenPresency(r) {
		http.Error(w, "Token no valido", http.StatusUnauthorized)
		return
	}

	params := mux.Vars(r)
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)
	
	password,err := utilities.RecoverPassword(params["email"])
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(password))
}

func verifyTokenPresency(r *http.Request) bool {

	authHeader := r.Header.Get("Authorization")

	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

	verified := security.VerifyToken(tokenString)
	return verified
}
