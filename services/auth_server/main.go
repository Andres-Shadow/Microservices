package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	DataBase "taller_apirest/Database"
	"taller_apirest/handlers"
	"taller_apirest/models"
	"taller_apirest/utilities"

	"github.com/gorilla/mux"
)

func main() {
	initServer()
	utilities.PrechargeSampleUsers()

	r := mux.NewRouter()
	utilities.StartTime = time.Now()

	api := r.PathPrefix("/api/v1").Subrouter()
	defineLoginEndpoints(api)
	defineHealthEndpoints(api)
	defineUserEndpoints(api.PathPrefix("/users").Subrouter())

	port := os.Getenv("PORT")
	if port == "" {
		port = "9090"
	}

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("Auth server listening on :%s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Forced shutdown: %v", err)
	}
	log.Println("Server stopped.")
}

func initServer() {
	DataBase.DBConnection()
	DataBase.DB.AutoMigrate(&models.User{})
}

func defineUserEndpoints(userRouter *mux.Router) {
	userRouter.HandleFunc("", handlers.GetUsersHandler).Methods(http.MethodGet)
	userRouter.HandleFunc("", handlers.CreateUserHandler).Methods(http.MethodPost)
	userRouter.HandleFunc("", handlers.UpdateUserHandler).Methods(http.MethodPut)
	userRouter.HandleFunc("/{email}", handlers.GetUserHandlerByEmail).Methods(http.MethodGet)
	userRouter.HandleFunc("/{email}", handlers.DeleteUserHandler).Methods(http.MethodDelete)
	userRouter.HandleFunc("/password", handlers.RecoverPassword).Methods(http.MethodGet)
	userRouter.HandleFunc("/password", handlers.UpdateUserPassword).Methods(http.MethodPatch)
}

func defineLoginEndpoints(loginRouter *mux.Router) {
	loginRouter.HandleFunc("/login", handlers.LoginHandler).Methods(http.MethodPost)
}

func defineHealthEndpoints(healthRouter *mux.Router) {
	healthRouter.HandleFunc("/health", handlers.CheckHealth).Methods(http.MethodGet)
	healthRouter.HandleFunc("/health/ready", handlers.CheckReadyHealth).Methods(http.MethodGet)
	healthRouter.HandleFunc("/health/live", handlers.CheckLive).Methods(http.MethodGet)
}
