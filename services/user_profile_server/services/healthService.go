package services

import (
	"time"
	"users_api/communication"
	"users_api/database"
	"users_api/models"
)

var StartTime time.Time

func Now() time.Time {
	return time.Now()
}

func VerifyHealth() models.GeneralCheck {
	dbOk := database.VerifyDatabaseConnection()
	natsOk := communication.ConnectToNATS().HealthCheckNATS()
	fromTime := time.Now()

	checks := []models.HealthCheck{
		buildCheck("User Profile Service — Database liveness check", dbOk, fromTime),
		buildCheck("User Profile Service — NATS liveness check", natsOk, fromTime),
	}

	return buildReport(checks)
}

func VerifyReadyHealth() models.GeneralCheck {
	dbOk := database.VerifyDatabaseReady()
	natsOk := communication.ConnectToNATS().ReadyNats()
	fromTime := time.Now()

	checks := []models.HealthCheck{
		buildCheck("User Profile Service — Database readiness check", dbOk, fromTime),
		buildCheck("User Profile Service — NATS readiness check", natsOk, fromTime),
	}

	return buildReport(checks)
}

func buildCheck(name string, isUp bool, from time.Time) models.HealthCheck {
	status := "DOWN"
	dataStatus := "DOWN"
	if isUp {
		status = "UP"
		dataStatus = "READY"
	}
	return models.HealthCheck{
		Data:   models.HealthData{From: from, Status: dataStatus},
		Name:   name,
		Status: status,
	}
}

func buildReport(checks []models.HealthCheck) models.GeneralCheck {
	overall := "UP"
	for _, c := range checks {
		if c.Status != "UP" {
			overall = "DOWN"
			break
		}
	}
	return models.GeneralCheck{
		Status:  overall,
		Checks:  checks,
		Version: "1.0.0",
		Uptime:  time.Since(StartTime).String(),
	}
}
