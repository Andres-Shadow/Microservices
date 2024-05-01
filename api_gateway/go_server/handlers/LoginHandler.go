package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"taller_apirest/communication"
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
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to log in",
			Description: "User " + user.Username + " tried to log in in with email " + user.Email + " but was not found",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS-API",
		}

		communication.ConnectToNATS().SendLog(&notification)
		return
	}

	// Verificar si se proporcionaron usuario y clave
	if user.Username == "" || user.Password == "" {
		http.Error(w, "Faltan usuario y claves", http.StatusBadRequest)
		notification := models.LogResponse{
			Name:        "USERS-API",
			Summary:     "User tried to log in",
			Description: "User " + user.Username + " tried to log in in with email " + user.Email + " but did not provide credentials",
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
		Description: "User " + user.Username + " logged in with email " + user.Email,
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "INFO",
		Module:      "USERS-API",
	}

	communication.ConnectToNATS().SendLog(&notification)

	tokenString := security.LoginHandler(&user)
	// Responder con el token JWT
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprint(w, tokenString)

}
