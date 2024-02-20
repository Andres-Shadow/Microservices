package main

import (
	"fmt"
	"net/http"
	"taller_docker/handlers"
)


func main() {
	// Configurar el manejador para las solicitudes
	http.HandleFunc("/", handlers.SaludoHandler)
	http.HandleFunc("/login", handlers.LoginHandler)
	// Iniciar el servidor en el puerto 80
	fmt.Println("El servidor está escuchando en el puerto 80...")

	err := http.ListenAndServe(":80", nil)
	if err != nil {
		fmt.Println("Error al iniciar el servidor:", err)
	}
}
