package database

import (
	"log"
	"os"
	"time"
	"users_api/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DBConnection() {
	var host string
	host = os.Getenv("DATABASE")
	if host == "" {
		host = "localhost"
	}

	// var DSN = "host=" + host + " user=andres password=1234 dbname=users port=5432"
	dsn := "root:andres_1@tcp(" + host + ":3306)/users?charset=utf8mb4&parseTime=True&loc=Local"

	for {
		var err error
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
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

func VerifyDatabaseReady() bool {
	var count int64
	if err := DB.Model(&models.User{}).Count(&count).Error; err != nil {
		return false
	} else {
		return true
	}
}
