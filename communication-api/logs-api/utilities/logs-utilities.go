package utilities

import (
	dataBase "logs-api/database"
	"logs-api/models"
)

func GetAllLogs(page, pageSize int) ([]models.Application, error) {
	var logs []models.Application

	// Calcula el desplazamiento basado en la página y el tamaño de la página
	offset := (page - 1) * pageSize

	// Realiza la consulta con el desplazamiento y el tamaño de página adecuados
	err := dataBase.DB.Offset(offset).Limit(pageSize).Find(&logs).Error
	if err != nil {
		return nil, err
	}

	return logs, nil
}

func CountLogs() (int, error) {
	var count int64
	err := dataBase.DB.Model(&models.Application{}).Count(&count).Error
	if err != nil {
		return 0, err
	}
	return int(count), nil
}

func CreateLog(log models.Application) (bool, error) {
	if err := dataBase.DB.Create(&log).Error; err != nil {
		return false, err
	}
	return true, nil
}
