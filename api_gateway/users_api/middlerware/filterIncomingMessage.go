package middlerware

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"users_api/database"
	"users_api/models"
)

func FilterMessager(Rmessage string) {
	var message models.EventMessage

	err := json.Unmarshal([]byte(Rmessage), &message)
	if err != nil {
		log.Printf("Error deserializando JSON: %v", err)
		return
	}

	// Verificar si el log_type es "Error"
	if message.Type == "CREATION" {
		CreateUserFromMessage(message)
	}

	if message.Type == "UPDATE" {
		UpdateUserFromMessage(message)
	}

	if message.Type == "DELETION" {
		DeleteUserFromMessage(message)
	}

}

func CreateUserFromMessage(message models.EventMessage) {
	var newUser models.User
	userEmail := message.Email
	userName := message.Name

	//user basic info
	newUser.Email = userEmail
	newUser.Nickname = userName
	newUser.Name = userName

	//set default values for additional fields
	newUser.Public_Info = "1"
	newUser.Messaging = "No mailing address registered"
	newUser.Biography = "No biography registered"
	newUser.Organization = "No organization registered"
	newUser.Country = "No country registered"
	newUser.Social_Media = "No social media registered"

	//create user
	//Note: no necesary to check if the user already exists
	//auth server already manage that

	//save user
	err := database.DB.Create(&newUser).Error

	if err != nil {
		fmt.Println("Error creating user: ", err)
	} else {
		fmt.Println("User created: ", newUser.Email)
	}

}

func UpdateUserFromMessage(message models.EventMessage) {
	var user models.User
	oldEmail := strings.Split(message.Email, ",")[0]
	newEmail := strings.Split(message.Email, ",")[1]
	userName := message.Name
	//get user
	err := database.DB.Where("email = ?", oldEmail).First(&user).Error
	if err != nil {
		fmt.Println("Error getting user: ", err)
		return
	}

	//update user
	user.Email = newEmail
	user.Nickname = userName

	//save user
	err = database.DB.Save(&user).Error
	if err != nil {
		fmt.Println("Error updating user: ", err)
	} else {
		fmt.Println("User updated: ", user.Email)
	}
}

func DeleteUserFromMessage(message models.EventMessage) {
	var user models.User
	userEmail := message.Email

	//get user
	err := database.DB.Where("email = ?", userEmail).First(&user).Error
	if err != nil {
		fmt.Println("Error getting user: ", err)
		return
	}

	//delete user from database
	err = database.DB.Unscoped().Delete(&user).Error
	if err != nil {
		fmt.Println("Error deleting user: ", err)
	} else {
		fmt.Println("User deleted: ", user.Email)
	}
}
