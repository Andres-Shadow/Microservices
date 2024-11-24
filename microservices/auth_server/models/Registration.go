package models

type Registration struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Type  string `json:"type"`
}