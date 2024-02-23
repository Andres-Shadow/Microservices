package handlers

import (
	"encoding/json"
	"net/http"
	DataBase "taller_apirest/Database"
	"taller_apirest/models"
	"taller_apirest/utilities"

	"github.com/gorilla/mux"
)

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	users,_ = utilities.GetUsers()
	json.NewEncoder(w).Encode(&users)
}

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var user *models.User
	user,_ = utilities.GetUserById(params["id"])

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
	_,err := utilities.PostUser(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Ocurrio un error al crear el usuario"))
	}
	json.NewEncoder(w).Encode(&user)
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	err := utilities.DeleteUser(params["id"])
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		return
	}
	w.WriteHeader(http.StatusOK)
}

//inherited functions


func GetUsersHandlerx(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	DataBase.DB.Find(&users)
	json.NewEncoder(w).Encode(&users)
}

func GetUserHandlerx(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var user models.User
	DataBase.DB.First(&user, params["id"])

	if user.ID == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Usuario no encontrado"))
		return
	}

	json.NewEncoder(w).Encode(&user)
}


func PostUserHandlerx(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)
	createdUser := DataBase.DB.Create(&user)
	err := createdUser.Error
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Ocurrio un error al crear el usuario"))
	}
	json.NewEncoder(w).Encode(&user)
}

func DeleteUserHandlerx(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var user models.User
	DataBase.DB.First(&user, params["id"])

	if user.ID == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		return
	}

	DataBase.DB.Unscoped().Delete(&user)
	w.WriteHeader(http.StatusOK)
}