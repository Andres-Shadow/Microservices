package services

import (
	"users_api/database"
	"users_api/models"
)

func GetUsers(page, pageSize int) ([]models.User, error) {
	offset := (page - 1) * pageSize
	var users []models.User
	err := database.DB.Offset(offset).Limit(pageSize).Find(&users).Error
	return users, err
}

func CreateUser(user models.User) (*models.User, error) {
	err := database.DB.Create(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func DeleteUser(userId string) bool {
	err := database.DB.Where("id = ?", userId).Delete(&models.User{})
	return err == nil
}

func UpdateUser(user models.User) models.User {
	database.DB.Save(&user)
	return user
}

func GetUserById(userId string) (models.User, error) {
	var user models.User
	err := database.DB.Where("id = ?", userId).First(&user).Error
	return user, err
}

func GetUserByNickname(nickname string) (models.User, error) {
	var user models.User
	err := database.DB.Where("nickname = ?", nickname).First(&user).Error
	return user, err
}

func GetUserByEmail(email string) (bool, error) {
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

func RecoverUserByEmail(email string) (models.User, error) {
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error
	return user, err
}
