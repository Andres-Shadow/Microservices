package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Id       int    `json:"id" gorm:"primaryKey, autoIncrement"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email" gorm:"unique"`
}
