package main

import (
	"net/http"

	DataBase "taller_apirest/Database"
	"taller_apirest/handlers"
	"taller_apirest/models"

	"github.com/gorilla/mux"
)

func main() {

	DataBase.DBConnection()
	DataBase.DB.AutoMigrate(models.User{})
	r := mux.NewRouter()

	//login route
	r.HandleFunc("/login", handlers.HomeHandler).Methods("POST")

	http.ListenAndServe(":9093", r)
}
