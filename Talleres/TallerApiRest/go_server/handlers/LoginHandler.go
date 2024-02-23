package handlers

import (
	"encoding/json"
	"net/http"

	"taller_apirest/models"
	"taller_apirest/utilities"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	//decode user from json
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)
	createdUser, err := utilities.PostUser(user)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Ocurrio un error al crear el usuario"))
		return
	}

	//user creation success
	json.NewEncoder(w).Encode(&createdUser)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	//decode user from json
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)
	_, err := utilities.SearchUser(&user)

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))
		return
	}

	//user creation success
	json.NewEncoder(w).Encode(&user)
}