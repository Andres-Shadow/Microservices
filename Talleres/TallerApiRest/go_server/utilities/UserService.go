package utilities

import (
	"errors"
	DataBase "taller_apirest/Database"
	"taller_apirest/models"
)

func GetUsers() ([]models.User, error) {
	var users []models.User
	DataBase.DB.Find(&users)
	return users, nil
}

func CreateUser(user models.User) (bool, error) {
	if err := DataBase.DB.Create(&user).Error; err != nil {
		return false, err
	}
	return true, nil
}

func SearchUser(user *models.User) (bool, error) {
	if err := DataBase.DB.Where("username = ? AND password = ?", user.Username, user.Password).First(&user).Error; err != nil {
		return false, err
	}
	return true, nil
}

func GetUserById(id string) (*models.User, error) {
	var user models.User
	DataBase.DB.First(&user, id)
	if user.ID == 0 {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

func PostUser(user models.User) (*models.User, error) {
	createdUser := DataBase.DB.Create(&user)
	err := createdUser.Error

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func DeleteUser(id string) error {
	var user models.User
	DataBase.DB.First(&user, id)

	if user.ID == 0 {
		return errors.New("user not found")
	}

	DataBase.DB.Unscoped().Delete(&user)
	return nil
}