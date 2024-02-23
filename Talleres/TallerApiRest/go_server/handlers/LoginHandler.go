package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"taller_apirest/models"
	"taller_apirest/security"
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
		return
	}

	// Verificar si se proporcionaron usuario y clave
	if user.Username == "" || user.Password == "" {
		http.Error(w, "Faltan usuario y claves", http.StatusBadRequest)
		return
	}

	tokenString := security.LoginHandler(&user)

	// Responder con el token JWT
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprint(w, tokenString)
}
