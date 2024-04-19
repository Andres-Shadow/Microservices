package utilities

import (
	DataBase "taller_apirest/Database"
	"taller_apirest/communication"
	"taller_apirest/models"
	"time"
)

var StartTime time.Time

func VerifyHealth() models.GeneralCheck {
	databaseConnection := DataBase.VerifyDatabaseConnection()
	natsConnection := communication.ConnectToNATS().HealthCheckNATS()
	fromTime := time.Now()

	checks := []models.HealthCheck{}
	var checkStatus string
	// Crear un nuevo objeto HealthData
	var dbStatus string = "DOWN"
	if databaseConnection {
		dbStatus = "READY"
	}
	DatabaseData := models.HealthData{
		From:   fromTime,
		Status: dbStatus,
	}

	checkStatus = "DOWN"

	if dbStatus == "READY" {
		checkStatus = "UP"
	}
	healthCheck := models.HealthCheck{
		Data:   DatabaseData,
		Name:   "Databse connection check",
		Status: checkStatus,
	}

	checks = append(checks, healthCheck)
	// Crear un nuevo objeto HealthData
	var natsStatus string = "DOWN"
	if natsConnection {
		natsStatus = "READY"
	}

	checkStatus = "DOWN"

	if natsStatus == "READY" {
		checkStatus = "UP"
	}
	NatsData := models.HealthData{
		From:   fromTime,
		Status: natsStatus,
	}

	natsHealthCheck := models.HealthCheck{
		Data:   NatsData,
		Name:   "Nats connection check",
		Status: checkStatus,
	}

	checks = append(checks, natsHealthCheck)

	var reportStatus string
	report := models.GeneralCheck{}

	reportStatus = "DOWN"
	if natsStatus == "READY" && dbStatus == "READY" {
		reportStatus = "UP"
	}

	report.Status = reportStatus
	report.Checks = checks
	report.Version = "1.0.0"
	report.Uptime = time.Since(StartTime).String()

	return report
}
