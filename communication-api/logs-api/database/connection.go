package dataBase

import (
	"log"
	"os"

	"gorm.io/driver/mysql"
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
	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	DSN := "root:andres_1@tcp(" + host + ":3306)/logs?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	DB, err = gorm.Open(mysql.Open(DSN), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	} else {
		log.Println("BD Connected")
	}
}
