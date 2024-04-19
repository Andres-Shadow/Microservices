package handlers

import (
	"encoding/json"
	"net/http"
	DataBase "taller_apirest/Database"
	"taller_apirest/communication"
	"taller_apirest/models"
	"time"
)

func CheckHealth(w http.ResponseWriter, r *http.Request) {
	databaseConnection := DataBase.VerifyDatabaseConnection()
	natsConnection := communication.ConnectToNATS().HealthCheckNATS()
	fromTime := time.Now()

	checks := []models.HealthCheck{}
	// Crear un nuevo objeto HealthData
	var dbStatus string = "DOWN"
	if databaseConnection {
		dbStatus = "READY"
	}
	DatabaseData := models.HealthData{
		From:   fromTime,
		Status: dbStatus,
	}

	healthCheck := models.HealthCheck{
		Data:   DatabaseData,
		Name:   "DatabseCheck check",
		Status: dbStatus,
	}

	checks = append(checks, healthCheck)
	// Crear un nuevo objeto HealthData
	var natsStatus string = "DOWN"
	if natsConnection {
		natsStatus = "READY"
	}
	NatsData := models.HealthData{
		From:   fromTime,
		Status: natsStatus,
	}

	natsHealthCheck := models.HealthCheck{
		Data:   NatsData,
		Name:   "Nats connection check",
		Status: natsStatus,
	}

	checks = append(checks, natsHealthCheck)

	// enviar el arreglo de checks
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(checks)
}
