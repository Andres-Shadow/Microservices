package utilities

import (
	"taller_apirest/communication"
	"taller_apirest/models"
	"time"
)

func SendLogToNats(name, summary, description, logType string) {
	notification := models.LogResponse{
		Name:        name,
		Summary:     summary,
		Description: description,
		LogDate:     time.Now().Format(time.RFC3339),
		LogType:     logType,
		Module:      "USERS-API",
	}
	communication.ConnectToNATS().SendLog(&notification)
}