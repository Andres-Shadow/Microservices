package handlers

import (
	"net/http"
	"strconv"
	"time"
	"users_api/communication"
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
	users, err := services.GetUsers(page, pageSize)

	if err != nil {
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while listing users profiles",
			Description: "Error while listing users profiles from the database",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
	}

	message := models.Message{
		Name:        "USERS_PROFILE_API",
		Summary:     "Users profiles listed",
		Description: "Users profiles listed from the database",
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "INFO",
		Module:      "USERS_PROFILE_API",
	}
	communication.ConnectToNATS().SendLog(&message)

	// Responde con JSON
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	// Crear un nuevo usuario
	// Crear un nuevo usuario
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while creating user profile",
			Description: "Error while creating an user profile",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input"})
		return
	}

	if user.Name == "" || user.Email == "" || user.Country == "" || user.Nickname == "" || user.Public_Info == "" || user.Messaging == "" || user.Biography == "" || user.Organization == "" || user.Social_Media == "" {
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while creating user profile",
			Description: "Error while creating an user profile",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	usr, _ := services.GetUserByEmail(user.Email)

	if usr {
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while creating user profile",
			Description: "Error while creating an user profile",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return

	}
	// Manejo de errores en la creación del usuario
	if _, err := services.CreateUser(user); err != nil {
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while creating user profile",
			Description: "Error while creating an user profile",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	message := models.Message{
		Name:        "USERS_PROFILE_API",
		Summary:     "User profile created",
		Description: "User profile created with email " + user.Email,
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "CREATION",
		Module:      "USERS_PROFILE_API",
	}

	communication.ConnectToNATS().SendLog(&message)

	c.JSON(http.StatusCreated, user)
}

func DeleteUser(c *gin.Context) {
	// Eliminar un usuario
	userId := c.Query("id")
	_, err := services.GetUserById(userId)
	fmt.Println(err)
	if err == nil {
		services.DeleteUser(userId)
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "User profile deleted",
			Description: "User profile deleted with id " + userId,
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "DELETION",
			Module:      "USERS_PROFILE_API",
		}

		communication.ConnectToNATS().SendLog(&message)
		c.JSON(http.StatusOK, gin.H{"message": "Usuario eliminado"})
	} else {
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while deleting user profile",
			Description: "Error while deleting an user profile",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
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
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while updating user profile",
			Description: "Error while updating an user profile",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return

	}

	if recordedUser.Email != email {
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while updating user profile",
			Description: "Error while updating an user profile",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
		c.JSON(http.StatusBadRequest, gin.H{"error": "No se puede actualizar el correo"})
		return
	}

	services.UpdateUser(user)
	message := models.Message{
		Name:        "USERS_PROFILE_API",
		Summary:     "User profile updated",
		Description: "User profile created with email " + user.Email,
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "UPDATE",
		Module:      "USERS_PROFILE_API",
	}

	communication.ConnectToNATS().SendLog(&message)
	c.JSON(http.StatusOK, user)
}

func GetUser(c *gin.Context) {
	// Obtener un usuario por ID
	userEmail := c.Param("email")
	user, err := services.RecoverUserByEmail(userEmail)

	if err != nil {
		message := models.Message{
			Name:        "USERS_PROFILE_API",
			Summary:     "Error while getting user profile",
			Description: "Error while getting an user profile",
			LogDate:     time.Now().Format(time.RFC3339),
			LogType:     "ERROR",
			Module:      "USERS_PROFILE_API",
		}
		communication.ConnectToNATS().SendLog(&message)
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	message := models.Message{
		Name:        "USERS_PROFILE_API",
		Summary:     "User profile obtained",
		Description: "User profile obtained with email " + user.Email,
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     "INFO",
		Module:      "USERS_PROFILE_API",
	}

	communication.ConnectToNATS().SendLog(&message)

	c.JSON(http.StatusOK, user)
}
