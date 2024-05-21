package models

import "time"

type HealthCheck struct {
	Data   HealthData `json:"data"`
	Name   string     `json:"name"`
	Status string     `json:"status"`
}

// HealthData representa la estructura de la sección "data" del objeto JSON
type HealthData struct {
	From   time.Time `json:"from"`
	Status string    `json:"status"`
}
