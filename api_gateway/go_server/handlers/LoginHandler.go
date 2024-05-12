package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"taller_apirest/models"
	"taller_apirest/security"
	"taller_apirest/utilities"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {

	// Verificar si la solicitud es de tipo POST
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	//decode user from json
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)
	_, err := utilities.SearchUser(&user)

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("User not found"))

		name := user.Username
		summary := "User tried to log in"
		description := "User " + user.Username + " tried to log in in with email " + user.Email + " but was not found"
		logType := "ERROR"
		utilities.SendLogToNats(name, summary, description, logType)
		return
	}

	// Verificar si se proporcionaron usuario y clave
	if user.Username == "" || user.Password == "" {
		http.Error(w, "Faltan usuario y claves", http.StatusBadRequest)
		name := user.Username
		summary := "User tried to log in"
		description := "User " + user.Username + " tried to log in in with email " + user.Email + " but did not provide credentials"
		logType := "ERROR"
		utilities.SendLogToNats(name, summary, description, logType)
		return
	}

	name := user.Username
	summary := "User logged in"
	description := "User " + user.Username + " logged in with email " + user.Email
	logType := "INFO"
	utilities.SendLogToNats(name, summary, description, logType)


	tokenString := security.LoginHandler(&user)
	// Responder con el token JWT
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprint(w, tokenString)

}
