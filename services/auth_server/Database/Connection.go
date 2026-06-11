package DataBase

import (
	"fmt"
	"log"
	"os"
	"taller_apirest/models"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DBConnection() {
	host := os.Getenv("DATABASE")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("DATABASE_PORT")
	if port == "" {
		port = "5432"
	}
	user := os.Getenv("DATABASE_USER")
	if user == "" {
		user = "devuser"
	}
	password := os.Getenv("DATABASE_PASSWORD")
	if password == "" {
		password = "devpassword"
	}
	dbname := os.Getenv("DATABASE_NAME")
	if dbname == "" {
		dbname = "appdb"
	}
	schema := os.Getenv("DATABASE_SCHEMA")
	if schema == "" {
		schema = "auth"
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s search_path=%s sslmode=disable",
		host, port, user, password, dbname, schema,
	)

	for {
		var err error
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Println("Failed to connect to database. Retrying in 5 seconds...")
			time.Sleep(5 * time.Second)
			continue
		}
		// Crear el schema si no existe
		if err := DB.Exec(fmt.Sprintf("CREATE SCHEMA IF NOT EXISTS %s", schema)).Error; err != nil {
			log.Printf("Warning: could not create schema %s: %v", schema, err)
		}
		log.Println("DB Connected")
		break
	}
}

// VerifyDatabaseConnection hace un ping simple a la base de datos.
func VerifyDatabaseConnection() bool {
	return DB.Exec("SELECT 1").Error == nil
}

// VerifyDatabaseReady verifica que la tabla de usuarios sea accesible.
func VerifyDatabaseReady() bool {
	var count int64
	return DB.Model(&models.User{}).Count(&count).Error == nil
}
