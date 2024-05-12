package middlerware

import (
	"encoding/json"
	"fmt"
	"log"
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
	} else {
		fmt.Println("Mensaje no es un error, ignorando...")
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
