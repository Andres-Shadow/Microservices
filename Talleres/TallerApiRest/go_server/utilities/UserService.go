package utilities

import (
	DataBase "taller_apirest/Database"
	"taller_apirest/models"
)

func CreateUser(user models.User) error {
	if err := DataBase.DB.Create(&user).Error; err != nil {
		return err
	}
	return nil
}

func SearchUser(user *models.User) error {
	if err := DataBase.DB.Where("username = ? AND password = ?", user.Username, user.Password).First(&user).Error; err != nil {
		return err
	}
	return nil
}

func GetUserById(user *models.User, id string) error {
	if err := DataBase.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return err
	}
	return nil

}