package main

import (
	"net/http"

	DataBase "taller_apirest/Database"
	"taller_apirest/handlers"
	"taller_apirest/models"

	"github.com/gorilla/mux"
)

func main() {

	//establish a database connection
	DataBase.DBConnection()
	DataBase.DB.AutoMigrate(models.User{})
	r := mux.NewRouter()

	//login route
	r.HandleFunc("/login", handlers.HomeHandler).Methods("POST")

	//user routes
	//creating route prefix
	//and delegating a function subroutes responsability
	defineUserEndpoints(r.PathPrefix("/api/v1/user").Subrouter())

	http.ListenAndServe(":9090", r)
}


//defineUserEndpoints is a function that defines the user subroutes
//user the prefix "/api/v1/user"
func defineUserEndpoints(userRouter *mux.Router) {
	userRouter.HandleFunc("/all", handlers.GetUsersHandler).Methods("GET")
	userRouter.HandleFunc("/add", handlers.PostUserHandler).Methods("POST")
	userRouter.HandleFunc("/delete", handlers.DeleteUserHandler).Methods("DELETE")
	userRouter.HandleFunc("/update", handlers.PostUserHandler).Methods("PUT")
}
