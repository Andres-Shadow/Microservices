package handlers

import (
	"net/http"
	"strconv"
	"time"
	"users_api/communication"
	"users_api/models"
	"users_api/services"

	"github.com/gin-gonic/gin"
)

// sendLog es un helper para no repetir la construcción de models.Message en cada handler.
func sendLog(summary, description, logType string) {
	msg := &models.Message{
		Name:        "USERS_PROFILE_API",
		Summary:     summary,
		Description: description,
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     logType,
		Module:      "USERS_PROFILE_API",
	}
	communication.ConnectToNATS().SendLog(msg)
}

func GetUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.Query("page"))
	pageSize, _ := strconv.Atoi(c.Query("pagesize"))

	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}

	users, err := services.GetUsers(page, pageSize)
	if err != nil {
		sendLog("Error listing user profiles", "Error retrieving user profiles from database", "ERROR")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve users"})
		return
	}

	sendLog("Users profiles listed", "Users profiles listed from the database", "INFO")
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		sendLog("Error creating user profile", "Invalid JSON input", "ERROR")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input"})
		return
	}

	// Campos obligatorios
	if user.Name == "" || user.Email == "" || user.Country == "" || user.Nickname == "" || user.Public_Info == "" || user.Messaging == "" {
		sendLog("Error creating user profile", "Missing required fields", "ERROR")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields: name, email, country, nickname, public_info, messaging"})
		return
	}

	exists, _ := services.GetUserByEmail(user.Email)
	if exists {
		sendLog("Error creating user profile", "Email already exists: "+user.Email, "ERROR")
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	created, err := services.CreateUser(user)
	if err != nil {
		sendLog("Error creating user profile", "Database error creating user: "+err.Error(), "ERROR")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	sendLog("User profile created", "User profile created with email "+user.Email, "CREATION")
	c.JSON(http.StatusCreated, created)
}

func DeleteUser(c *gin.Context) {
	userId := c.Query("id")
	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id query param is required"})
		return
	}

	_, err := services.GetUserById(userId)
	if err != nil {
		sendLog("Error deleting user profile", "User not found with id "+userId, "ERROR")
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	services.DeleteUser(userId)
	sendLog("User profile deleted", "User profile deleted with id "+userId, "DELETION")
	c.JSON(http.StatusOK, gin.H{"message": "Usuario eliminado"})
}

func UpdateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		sendLog("Error updating user profile", "Invalid JSON input", "ERROR")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input"})
		return
	}

	recordedUser, err := services.GetUserByNickname(user.Nickname)
	if err != nil {
		sendLog("Error updating user profile", "User not found with nickname "+user.Nickname, "ERROR")
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	if recordedUser.Email != user.Email {
		sendLog("Error updating user profile", "Email mismatch for nickname "+user.Nickname, "ERROR")
		c.JSON(http.StatusBadRequest, gin.H{"error": "No se puede actualizar el correo"})
		return
	}

	services.UpdateUser(user)
	sendLog("User profile updated", "User profile updated with email "+user.Email, "UPDATE")
	c.JSON(http.StatusOK, user)
}

func GetUser(c *gin.Context) {
	userEmail := c.Param("email")
	user, err := services.RecoverUserByEmail(userEmail)
	if err != nil {
		sendLog("Error getting user profile", "User not found with email "+userEmail, "ERROR")
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	sendLog("User profile obtained", "User profile obtained with email "+user.Email, "INFO")
	c.JSON(http.StatusOK, user)
}
