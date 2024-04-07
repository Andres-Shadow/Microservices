package main

import (
	"fmt"
	"log"
	dataBase "logs-api/database"
	"logs-api/handlers"
	"logs-api/messaging"
	"logs-api/models"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	//login route
	defineEndpoints(r.PathPrefix("/api/v1/logs").Subrouter())
	initDatabase()

	nc := messaging.InitNats("auth.events")

	//Iniciar el servidor HTTP en una goroutine
	go func() {
		fmt.Println("Iniciando servidor HTTP en el puerto 9091...")
		if err := http.ListenAndServe(":9091", r); err != nil {
			log.Fatalf("Error al iniciar el servidor HTTP: %v", err)
		}
	}()

	// Esperar señales de interrupción para salir graciosamente
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh
	fmt.Println("Saliendo...")

	// Cerrar la conexión a NATS antes de salir
	nc.Close()
}

func defineEndpoints(userRouter *mux.Router) {
	//RESTful API endpoints for crud
	userRouter.HandleFunc("/", handlers.GetAllLogs).Methods("GET")
	userRouter.HandleFunc("/{application}", handlers.GetLogByApplication).Methods("GET")

}

func initDatabase() {
	// Establecer la conexión a la base de datos
	fmt.Println("Estableciendo conexión a la base de datos...")
	dataBase.DBConnection()
	dataBase.DB.AutoMigrate(models.Application{})
}
