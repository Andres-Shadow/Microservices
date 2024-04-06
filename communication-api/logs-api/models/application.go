package models

import "gorm.io/gorm"

type Application struct {
	gorm.Model
	ID          int    `json:"id" gorm:"primaryKey, autoIncrement"`
	Name        string `json:"name"`
	Description string `json:"description"`
	LogDate     string `json:"log_date"`
}
