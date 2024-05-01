package handlers

import (
	"net/http"
	"strconv"
	"users_api/models"
	"users_api/services"

	"fmt"

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
	// Crear un nuevo usuario
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input"})
		return
	}

	// Manejo de errores en la creación del usuario
	if _, err := services.CreateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func DeleteUser(c *gin.Context) {
	// Eliminar un usuario
	userId := c.Query("id")
	_, err := services.GetUserById(userId)
	fmt.Println(err)
	if err == nil {
		services.DeleteUser(userId)
		c.JSON(http.StatusOK, gin.H{"message": "Usuario eliminado"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
	}

}

func UpdateUser(c *gin.Context) {
	// Actualizar un usuario
	user := models.User{}
	c.BindJSON(&user)

	nickname := user.Nickname
	email := user.Email

	recordedUser, err := services.GetUserByNickname(nickname)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return

	}

	if recordedUser.Email != email {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No se puede actualizar el correo"})
		return
	}

	services.UpdateUser(user)
	c.JSON(http.StatusOK, user)
}
