package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"users_api/communication"
	"users_api/database"
	"users_api/handlers"
	"users_api/models"

	"github.com/gin-gonic/gin"
)

func main() {
	connectDatabase()
	r := gin.Default()
	url := "/api/v1/users"
	// Rutas de la API
	r.GET(url, handlers.GetUsers)      // Obtener todos los usuarios
	r.POST(url, handlers.CreateUser)   // Crear un nuevo usuario
	r.PUT(url, handlers.UpdateUser)    // Actualizar un usuario
	r.DELETE(url, handlers.DeleteUser) // Eliminar un usuario
	r.GET(url+"/:email", handlers.GetUser) // Obtener un usuario por ID
	//rutas de la salud
	r.GET("/health/live", handlers.CheckLive)
	r.GET("/health/ready", handlers.CheackReadyHealth)
	r.GET("/api/v1/health", handlers.CheckHealth)

	// Canales para controlar la aplicación
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Iniciar la suscripción a NATS en segundo plano
	done := make(chan struct{}) // Canales para cerrar la suscripción
	go communication.SubscribeToNATS( done)

	// Iniciar el servidor en el puerto 9094
	go func() {
		if err := r.Run(":9094"); err != nil {
			log.Fatalf("Error al iniciar el servidor: %v", err)
		}
	}()

	// Esperar a que se reciba una señal para cerrar correctamente
	<-quit
	fmt.Println("Señal recibida, cerrando aplicación...")

	// Cerrar el canal done para detener la suscripción a NATS
	close(done)
}

func connectDatabase() {
	fmt.Println("=====================================")
	fmt.Println("Conectando a la base de datos...")
	database.DBConnection()
	database.DB.AutoMigrate(&models.User{})
	fmt.Println("=====================================")
}
