package middlerware

import (
	"encoding/json"
	"log"
	"strings"
	"users_api/database"
	"users_api/models"
)

func FilterMessager(rawMessage string) {
	var message models.EventMessage

	err := json.Unmarshal([]byte(rawMessage), &message)
	if err != nil {
		log.Printf("Error deserializing JSON message: %v", err)
		return
	}

	switch message.Type {
	case "CREATION":
		createUserFromMessage(message)
	case "UPDATE":
		updateUserFromMessage(message)
	case "DELETION":
		deleteUserFromMessage(message)
	}
}

func createUserFromMessage(message models.EventMessage) {
	newUser := models.User{
		Email:        message.Email,
		Nickname:     message.Name,
		Name:         message.Name,
		Public_Info:  "1",
		Messaging:    "No mailing address registered",
		Biography:    "No biography registered",
		Organization: "No organization registered",
		Country:      "No country registered",
		Social_Media: "No social media registered",
	}

	if err := database.DB.Create(&newUser).Error; err != nil {
		log.Printf("Error creating user profile from message: %v", err)
	} else {
		log.Printf("User profile created for: %s", newUser.Email)
	}
}

func updateUserFromMessage(message models.EventMessage) {
	parts := strings.Split(message.Email, ",")
	if len(parts) < 2 {
		log.Printf("Invalid email format in update message: %s", message.Email)
		return
	}

	oldEmail := parts[0]
	newEmail := parts[1]

	var user models.User
	if err := database.DB.Where("email = ?", oldEmail).First(&user).Error; err != nil {
		log.Printf("User not found for update (email: %s): %v", oldEmail, err)
		return
	}

	user.Email = newEmail
	user.Nickname = message.Name

	if err := database.DB.Save(&user).Error; err != nil {
		log.Printf("Error updating user profile: %v", err)
	} else {
		log.Printf("User profile updated: %s -> %s", oldEmail, newEmail)
	}
}

func deleteUserFromMessage(message models.EventMessage) {
	var user models.User
	if err := database.DB.Where("email = ?", message.Email).First(&user).Error; err != nil {
		log.Printf("User not found for deletion (email: %s): %v", message.Email, err)
		return
	}

	if err := database.DB.Unscoped().Delete(&user).Error; err != nil {
		log.Printf("Error deleting user profile: %v", err)
	} else {
		log.Printf("User profile deleted: %s", message.Email)
	}
}
