package models

import "gorm.io/gorm"

type Application struct {
	gorm.Model
	ID          int    `json:"id" gorm:"primaryKey, autoIncrement"`
	Name        string `json:"name"`
	Summary     string `json:"summary"`
	Description string `json:"description"`
	LogDate     string `json:"log_date"`
	LogType     string `json:"log_type"`
	Module      string `json:"module"`
}
