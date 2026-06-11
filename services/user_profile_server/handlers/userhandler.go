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
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))

	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}

	users, err := services.GetUsers(page, pageSize)
	if err != nil {
		sendLog("Error listing user profiles", "Failed to retrieve user profiles from database", "ERROR")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve users"})
		return
	}

	sendLog("User profiles listed", "User profiles listed successfully", "INFO")
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		sendLog("User profile creation failed", "Invalid JSON input received", "ERROR")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input"})
		return
	}

	if user.Name == "" || user.Email == "" || user.Country == "" || user.Nickname == "" || user.Public_Info == "" || user.Messaging == "" {
		sendLog("User profile creation failed", "Missing required fields during profile creation", "ERROR")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields: name, email, country, nickname, public_info, messaging"})
		return
	}

	exists, _ := services.GetUserByEmail(user.Email)
	if exists {
		sendLog("User profile creation failed", "Email already exists: "+user.Email, "ERROR")
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	created, err := services.CreateUser(user)
	if err != nil {
		sendLog("User profile creation failed", "Database error: "+err.Error(), "ERROR")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	sendLog("User profile created", "User profile created with email "+user.Email, "CREATION")
	c.JSON(http.StatusCreated, created)
}

func DeleteUser(c *gin.Context) {
	userId := c.Param("id")
	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	_, err := services.GetUserById(userId)
	if err != nil {
		sendLog("User profile deletion failed", "User not found with id "+userId, "ERROR")
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	services.DeleteUser(userId)
	sendLog("User profile deleted", "User profile deleted with id "+userId, "DELETION")
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func UpdateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		sendLog("User profile update failed", "Invalid JSON input received", "ERROR")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input"})
		return
	}

	recordedUser, err := services.GetUserByNickname(user.Nickname)
	if err != nil {
		sendLog("User profile update failed", "User not found with nickname "+user.Nickname, "ERROR")
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if recordedUser.Email != user.Email {
		sendLog("User profile update failed", "Email mismatch for nickname "+user.Nickname, "ERROR")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email cannot be changed via this endpoint"})
		return
	}

	services.UpdateUser(user)
	sendLog("User profile updated", "User profile updated with email "+user.Email, "UPDATE")
	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func GetUser(c *gin.Context) {
	userEmail := c.Param("email")
	user, err := services.RecoverUserByEmail(userEmail)
	if err != nil {
		sendLog("User profile retrieval failed", "User not found with email "+userEmail, "ERROR")
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	sendLog("User profile retrieved", "User profile retrieved for email "+user.Email, "INFO")
	c.JSON(http.StatusOK, user)
}
