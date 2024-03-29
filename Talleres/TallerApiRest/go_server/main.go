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
	defineLoginRegisterEndpoints(r.PathPrefix("/api/v1").Subrouter())

	//user routes
	//creating route prefix
	//and delegating a function subroutes responsability
	defineUserEndpoints(r.PathPrefix("/api/v1/users").Subrouter())

	http.ListenAndServe(":9090", r)
}

// defineUserEndpoints is a function that defines the user subroutes
// user the prefix "/api/v1/user"
func defineUserEndpoints(userRouter *mux.Router) {
	//RESTful API endpoints for crud
	userRouter.HandleFunc("/", handlers.GetUsersHandler).Methods("GET")
	userRouter.HandleFunc("/{id}", handlers.GetUserHandlerById).Methods("GET")
	userRouter.HandleFunc("/", handlers.PostUserHandler).Methods("POST")
	userRouter.HandleFunc("/{id}", handlers.DeleteUserHandler).Methods("DELETE")
	userRouter.HandleFunc("/", handlers.PostUserHandler).Methods("PUT")

	//RESTful API endpoints for user recover and update password
	userRouter.HandleFunc("/password/{email}", handlers.RecoverPassword).Methods("GET")
	userRouter.HandleFunc("/password", handlers.UpdateUserPassword).Methods("PATCH")
}

func defineLoginRegisterEndpoints(loginRouter *mux.Router) {
	loginRouter.HandleFunc("/login", handlers.LoginHandler).Methods("POST")
}
