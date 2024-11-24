package models

import "gorm.io/gorm"

// User struct
type User struct {
	gorm.Model
	ID           int    `json:"id" gorm:"primaryKey, autoIncrement"`
	Name         string `json:"name"`
	Nickname     string `json:"nickname"`
	Public_Info  string `json:"public_info"`
	Messaging    string `json:"messaging"`
	Biography    string `json:"biography"`
	Organization string `json:"organization"`
	Country      string `json:"country"`
	Social_Media string `json:"social_media"`
	Email        string `json:"email" gorm:"unique"`
}
