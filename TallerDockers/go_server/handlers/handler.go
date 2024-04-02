package handlers

import (
	"fmt"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// Obtener el nombre de usuario de los parámetros de la URL
	username := r.URL.Query().Get("nombre")

	// Verificar si el handler es diferente a "saludo"
	if r.URL.Path != "/saludo" {
		http.Error(w, "Error 404: Página no encontrada", http.StatusNotFound)
		return
	}

	// Verificar si se proporcionó un nombre de usuario
	if username == "" {
		http.Error(w, "Solicitud no valida: el nombre es obligatorio", http.StatusBadRequest)
		return
	}

	// Responder con un saludo personalizado
	response := fmt.Sprintf("Hola, %s", username)
	fmt.Fprintln(w, response)
}
