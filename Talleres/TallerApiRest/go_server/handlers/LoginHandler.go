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
	//creating the user
	err := utilities.CreateUser(user)

	//user creation error handling
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Ocurrio un error al crear el usuario"))
	}
	//user creation success
	json.NewEncoder(w).Encode(&user)
}
