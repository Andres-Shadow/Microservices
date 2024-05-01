package handlers

import (
	"net/http"
	"users_api/database"
	"users_api/models"

	"github.com/gin-gonic/gin"
)

// Controlador para obtener todos los usuarios
func GetUsers(c *gin.Context) {
	//recuperar los registros de la base de datos
	users := []models.User{}
	database.DB.Find(&users)
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	// Crear un nuevo usuario
	user := models.User{}
	c.BindJSON(&user)
	database.DB.Create(&user)
	c.JSON(http.StatusCreated, user)
}
