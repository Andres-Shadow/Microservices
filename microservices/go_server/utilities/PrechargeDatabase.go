package utilities

import (
	"fmt"
	DataBase "taller_apirest/Database"
	"taller_apirest/models"
	
)

func PrechargeSampleUsers() {

	amount, err := CountUsers()

	if err == nil && amount == 0 {
		users := []models.User{
			{Username: "pepe", Email: "a@gmail.com", Password: "12345"},
			{Username: "pepe2", Email: "b@gmail.com", Password: "12345"},
			{Username: "pepe3", Email: "c@gmail.com", Password: "12345"},
			{Username: "pepe4", Email: "d@gmail.com", Password: "12345"},
			{Username: "pepe5", Email: "e@gmail.com", Password: "12345"},
			{Username: "pepe6", Email: "f@gmail.com", Password: "12345"},
		}

		for _, user := range users {
			DataBase.DB.Create(&user)
		}

		fmt.Println("Users loaded")
	} else {
		fmt.Println("Users already loaded")
	}
}
