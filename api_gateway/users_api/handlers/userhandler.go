package handlers

import (
	"net/http"
	"strconv"
	"users_api/models"
	"users_api/services"

	"github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
	// Obtener los valores de los query params
	page, _ := strconv.Atoi(c.Query("page"))
	pageSize, _ := strconv.Atoi(c.Query("pagesize"))

	if c.Query("page") == "" && c.Query("pagesize") == "" {
		page = 1
		pageSize = 10
	}

	// Usa estos valores para obtener usuarios de tu servicio
	users, _ := services.GetUsers(page, pageSize)

	// Responde con JSON
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	// Crear un nuevo usuario
	user := models.User{}
	c.BindJSON(&user)
	services.CreateUser(user)
	c.JSON(http.StatusCreated, user)
}

func DeleteUser(c *gin.Context) {
	// Eliminar un usuario
	user := models.User{}
	c.BindJSON(&user)
	services.DeleteUser(user)
	c.JSON(http.StatusOK, gin.H{"message": "Usuario eliminado"})
}

func UpdateUser(c *gin.Context) {
	// Actualizar un usuario
	user := models.User{}
	c.BindJSON(&user)
	services.UpdateUser(user)
	c.JSON(http.StatusOK, user)
}
