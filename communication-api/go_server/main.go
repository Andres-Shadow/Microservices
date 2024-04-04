package main

import (
	"fmt"
	"net/http"

	DataBase "taller_apirest/Database"
	"taller_apirest/handlers"
	"taller_apirest/models"
	"taller_apirest/utilities"

	"github.com/gorilla/mux"
)

func main() {

	//set up the server
	initServer()
	//precharge sample users
	prechargeSampleUsers()

	r := mux.NewRouter()

	//login route
	defineLoginRegisterEndpoints(r.PathPrefix("/api/v1").Subrouter())

	//user routes
	//creating route prefix
	//and delegating a function subroutes responsability
	defineUserEndpoints(r.PathPrefix("/api/v1/users").Subrouter())

	http.ListenAndServe(":9090", r)
}

func initServer() {
	//establish a database connection
	DataBase.DBConnection()
	DataBase.DB.AutoMigrate(models.User{})
}

// defineUserEndpoints is a function that defines the user subroutes
// user the prefix "/api/v1/user"
func defineUserEndpoints(userRouter *mux.Router) {
	//RESTful API endpoints for crud
	userRouter.HandleFunc("/", handlers.GetUsersHandler).Methods("GET")
	userRouter.HandleFunc("/{id}", handlers.GetUserHandlerById).Methods("GET")
	userRouter.HandleFunc("/", handlers.PostUserHandler).Methods("POST")
	userRouter.HandleFunc("/", handlers.DeleteUserHandler).Methods("DELETE")
	userRouter.HandleFunc("/", handlers.UpdateUserHandler).Methods("PUT")

	//RESTful API endpoints for user recover and update password
	userRouter.HandleFunc("/password/", handlers.RecoverPassword).Methods("GET")
	userRouter.HandleFunc("/password", handlers.UpdateUserPassword).Methods("PATCH")
}

func defineLoginRegisterEndpoints(loginRouter *mux.Router) {
	loginRouter.HandleFunc("/login", handlers.LoginHandler).Methods("POST")
}

func prechargeSampleUsers() {

	amount, err := utilities.CountUsers()

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
