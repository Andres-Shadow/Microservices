package utilities

import (
	"log"
	DataBase "taller_apirest/Database"
	"taller_apirest/models"

	"golang.org/x/crypto/bcrypt"
)

func PrechargeSampleUsers() {
	amount, err := CountUsers()
	if err != nil || amount > 0 {
		log.Println("Sample users already loaded, skipping precharge.")
		return
	}

	samplePassword, err := bcrypt.GenerateFromPassword([]byte("12345"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing sample password: %v", err)
		return
	}

	users := []models.User{
		{Username: "pepe", Email: "a@gmail.com", Password: string(samplePassword)},
		{Username: "pepe2", Email: "b@gmail.com", Password: string(samplePassword)},
		{Username: "pepe3", Email: "c@gmail.com", Password: string(samplePassword)},
		{Username: "pepe4", Email: "d@gmail.com", Password: string(samplePassword)},
		{Username: "pepe5", Email: "e@gmail.com", Password: string(samplePassword)},
		{Username: "pepe6", Email: "f@gmail.com", Password: string(samplePassword)},
	}

	for _, user := range users {
		if err := DataBase.DB.Create(&user).Error; err != nil {
			log.Printf("Error creating sample user %s: %v", user.Username, err)
		}
	}

	log.Println("Sample users loaded.")
}
