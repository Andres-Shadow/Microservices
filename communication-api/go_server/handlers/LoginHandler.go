package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"taller_apirest/models"
	"taller_apirest/security"
	"taller_apirest/utilities"

	"github.com/nats-io/nats.go"
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
		return
	}

	// Verificar si se proporcionaron usuario y clave
	if user.Username == "" || user.Password == "" {
		http.Error(w, "Faltan usuario y claves", http.StatusBadRequest)
		return
	}

	notifyLogin(user.Username, user.Email)

	tokenString := security.LoginHandler(&user)
	// Responder con el token JWT
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprint(w, tokenString)

}

func notifyLogin(username, email string) {

	var natsHost string
	natsHost = os.Getenv("NATS_SERVER")
	if natsHost == "" {
		natsHost = "localhost"
	}
	url := "nats://" + natsHost + ":4222"

	nc, err := nats.Connect(url)
	if err != nil {
		log.Fatal(err)
	}
	defer nc.Close()
	// Tema para notificaciones de autenticación
	authEventsSubject := "auth.events"
	if err := nc.Publish(authEventsSubject, []byte("Usuario autenticado: "+username+" - "+email)); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Notification sent")
}
