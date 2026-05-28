package models

import "gorm.io/gorm"

// User representa el perfil público de un usuario.
type User struct {
	gorm.Model
	Name         string `json:"name"`
	Nickname     string `json:"nickname"`
	Public_Info  string `json:"public_info"`
	Messaging    string `json:"messaging"`
	Biography    string `json:"biography,omitempty"`
	Organization string `json:"organization,omitempty"`
	Country      string `json:"country"`
	Social_Media string `json:"social_media,omitempty"`
	Email        string `json:"email" gorm:"unique"`
}
