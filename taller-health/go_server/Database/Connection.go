package DataBase

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// comando base de datos
// docker run --name postgres -e POSTGRES_USER=andres -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres

var DB *gorm.DB

func DBConnection() {
	var host string
	host = os.Getenv("DATABASE")
	if host == "" {
		host = "localhost"
	}
	
	var DSN = "host=" + host + " user=andres password=1234 dbname=users port=5432"
	var error error
	DB, error = gorm.Open(postgres.Open(DSN), &gorm.Config{})
	if error != nil {
		log.Fatal(error)
	} else {
		log.Println("BD Connected")
	}
}
