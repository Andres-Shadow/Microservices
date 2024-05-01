// main.go
package main

import (
	"fmt"
	"users_api/database"
	"users_api/handlers"
	"users_api/models"

	"github.com/gin-gonic/gin"
)

func main() {
	connectDatabase()
	r := gin.Default()

	// Rutas de la API
	r.GET("/users", handlers.GetUsers)    // Obtener todos los usuarios
	r.POST("/users", handlers.CreateUser) // Crear un nuevo usuario
	r.PUT("/users", handlers.UpdateUser)   // Actualizar un usuario
	r.DELETE("/users", handlers.DeleteUser) // Eliminar un usuario

	// Iniciar el servidor en el puerto 8080
	r.Run(":9094")
}

func connectDatabase() {
	fmt.Print("=====================================\n")
	fmt.Print("Conectando a la base de datos... \n")
	database.DBConnection()
	database.DB.AutoMigrate(&models.User{})
	fmt.Print("=====================================\n")
}
