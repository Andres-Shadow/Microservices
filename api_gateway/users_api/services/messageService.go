package services

import (
	"fmt"
	"users_api/models"
)

func CreateUserFromMessage(message models.Message) {
	var newUser models.User
	userEmail := message.Name

	//user basic info
	newUser.Email = userEmail
	newUser.Nickname = userEmail
	newUser.Name = userEmail

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
	saved, err := CreateUser(newUser)

	if err != nil {
		fmt.Println("Error creating user: ", err)
	} else {
		fmt.Println("User created: ", saved.Email)
	}

}
