package services

import (
	"time"
	"users_api/communication"
	"users_api/database"
	"users_api/models"
)

var StartTime time.Time

func VerifyHealth() models.GeneralCheck {
	
	databaseConnection := database.VerifyDatabaseConnection()
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
		Name:   "User service Databse live connection check",
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
		Name:   "User service Nats live connection check",
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

func VerifyReadyHealth() models.GeneralCheck {
	var databaseReady string = "DOWN"
	var checkStatus string = "DOWN"
	checks := []models.HealthCheck{}
	fromTime := time.Now()

	// database readyness check
	aux := database.VerifyDatabaseReady()

	if aux {
		databaseReady = "READY"
		checkStatus = "UP"
	}

	DatabaseData := models.HealthData{
		From:   fromTime,
		Status: databaseReady,
	}

	healthCheck := models.HealthCheck{
		Data:   DatabaseData,
		Name:   "User service Databse ready connection check",
		Status: checkStatus,
	}

	checks = append(checks, healthCheck)
	// nats readyness check
	checkStatus = "DOWN"
	natsConnection := communication.ConnectToNATS().ReadyNats()
	var natsReady string = "DOWN"

	if natsConnection {
		natsReady = "READY"
		checkStatus = "UP"
	}

	NatsData := models.HealthData{
		From:   fromTime,
		Status: natsReady,
	}

	natsHealthCheck := models.HealthCheck{
		Data:   NatsData,
		Name:   "User service Nats ready connection check",
		Status: checkStatus,
	}

	checks = append(checks, natsHealthCheck)
	var reportStatus string
	report := models.GeneralCheck{}

	reportStatus = "DOWN"
	if natsReady == "READY" && databaseReady == "READY" {
		reportStatus = "UP"
	}

	report.Status = reportStatus
	report.Checks = checks
	report.Version = "1.0.0"
	report.Uptime = time.Since(StartTime).String()

	return report

}
