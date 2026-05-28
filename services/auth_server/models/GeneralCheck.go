package models

type GeneralCheck struct {
	Status  string        `json:"status"`
	Checks  []HealthCheck `json:"checks"`
	Version string        `json:"version"`
	Uptime  string        `json:"uptime"`
}

type Health struct {
	Checks []GeneralCheck `json:"checks"`
}
