package DataBase

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DBConnection() {
	var host string
	host = os.Getenv("DATABASE")
	if host == "" {
		host = "localhost"
	}

	var DSN = "host=" + host + " user=andres password=1234 dbname=users port=5432"

	for {
		var err error
		DB, err = gorm.Open(postgres.Open(DSN), &gorm.Config{})
		if err != nil {
			log.Println("Failed to connect to database. Retrying in 5 seconds...")
			time.Sleep(5 * time.Second) // Wait for 5 seconds before retrying
		} else {
			log.Println("DB Connected")
			break // Exit the loop once the connection is successful
		}
	}
}

func VerifyDatabaseConnection() bool {

	//hacer un ping a la base de datos
	err := DB.Exec("SELECT 1").Error
	if err != nil {
		return false
	} else {
		return true
	}
}
