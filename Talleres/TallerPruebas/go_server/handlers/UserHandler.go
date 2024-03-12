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
	Registros int64           `json:"registros"`
}

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {

	query := r.URL.Query()
	page, _ := strconv.Atoi(query.Get("page"))
	pageSize, _ := strconv.Atoi(query.Get("pageSize"))

	if !verifyTokenPresency(r) {
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

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	err, _ := utilities.UpdateUserPassword(user)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		return
	}
	w.WriteHeader(http.StatusOK)

}

func RecoverPassword(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)

	fmt.Println("el email recibido es: ", params["email"])

	password, err := utilities.RecoverPassword(params["email"])
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
