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
	//var puerto string
	host = os.Getenv("DATABASE")
	//puerto = os.Getenv("LOGS_PORT")
	if host == "" {
		host = "localhost"
		//puerto = "3306"
	}

	password := "andres_1"
	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	DSN := "root:" + password + "@tcp(" + host + ":3306)/logs?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	DB, err = gorm.Open(mysql.Open(DSN), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	} else {
		log.Println("BD Connected")
	}
}

// var DB *gorm.DB

// func DBConnection() {
// 	var host string
// 	host = os.Getenv("DATABASE")
// 	if host == "" {
// 		host = "localhost"
// 	}

// 	var DSN = "host=" + host + " user=andres password=1234 dbname=logs port=3307"
// 	var error error
// 	DB, error = gorm.Open(postgres.Open(DSN), &gorm.Config{})
// 	if error != nil {
// 		log.Fatal(error)
// 	} else {
// 		log.Println("BD Connected")
// 	}
// }
