package main

import (
	"net/http"
	"time"

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
	utilities.PrechargeSampleUsers()

	r := mux.NewRouter()
	//login route
	utilities.StartTime = time.Now()

	defineLoginRegisterEndpoints(r.PathPrefix("/api/v1").Subrouter())
	defineHealthEndpoints(r.PathPrefix("/api/v1").Subrouter())

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

func defineHealthEndpoints(healthRouter *mux.Router) {
	healthRouter.HandleFunc("/health", handlers.CheckHealth).Methods("GET")
	healthRouter.HandleFunc("/health/ready", handlers.CheackReadyHealth).Methods("GET")
	healthRouter.HandleFunc("/health/live", handlers.CheckHealth).Methods("GET")
}
