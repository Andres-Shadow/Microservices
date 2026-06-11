package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"users_api/communication"
	"users_api/database"
	"users_api/handlers"
	"users_api/models"
	"users_api/services"

	"github.com/gin-gonic/gin"
)

func main() {
	connectDatabase()

	r := gin.Default()

	api := r.Group("/api/v1")
	defineUserRoutes(api)
	defineHealthRoutes(api)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	done := make(chan struct{})
	go communication.SubscribeToNATS(done)

	services.StartTime = services.Now()

	go func() {
		if err := r.Run(":9094"); err != nil {
			log.Fatalf("Server error: %v", err)
		}
	}()

	log.Println("User profile server listening on :9094")

	<-quit
	log.Println("Shutdown signal received, closing application...")
	close(done)
}

func connectDatabase() {
	log.Println("Connecting to database...")
	database.DBConnection()
	database.DB.AutoMigrate(&models.User{})
	log.Println("Database connected and migrated.")
}

func defineUserRoutes(api *gin.RouterGroup) {
	users := api.Group("/users")
	users.GET("", handlers.GetUsers)
	users.POST("", handlers.CreateUser)
	users.PUT("", handlers.UpdateUser)
	users.DELETE("/:id", handlers.DeleteUser)
	users.GET("/:email", handlers.GetUser)
}

func defineHealthRoutes(api *gin.RouterGroup) {
	health := api.Group("/health")
	health.GET("", handlers.CheckHealth)
	health.GET("/live", handlers.CheckLive)
	health.GET("/ready", handlers.CheckReadyHealth)
}
