// main.go
package main

import (
	"users_api/database"
	"users_api/handlers"
	"users_api/models"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Rutas de la API
	r.GET("/users", handlers.GetUsers)    // Obtener todos los usuarios
	r.POST("/users", handlers.CreateUser) // Crear un nuevo usuario

	database.DBConnection()
	database.DB.AutoMigrate(&models.User{})
	// Iniciar el servidor en el puerto 8080
	r.Run(":9094")
}
