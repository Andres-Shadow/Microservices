package services

import (
	"fmt"

	"users_api/database"
	"users_api/models"
)

func GetUsers(page, pageSize int) ([]models.User, error) {
	//recuperar los registros de la base de datos
	// Calcula el desplazamiento basado en la página y el tamaño de la página
	offset := (page - 1) * pageSize

	users := []models.User{}
	err := database.DB.Offset(offset).Limit(pageSize).Find(&users).Error

	if err != nil {

		return nil, err
	}

	return users, nil
}

func CreateUser(user models.User) (*models.User, error) {
	// Crear un nuevo usuario
	err := database.DB.Create(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func DeleteUser(userId string) bool {
	// Eliminar un usuario
	err := database.DB.Where("id = ?", userId).Delete(&models.User{})
	return err == nil
}

func UpdateUser(user models.User) models.User {
	// Actualizar un usuario
	database.DB.Save(&user)
	return user
}

func GetUserById(userId string) (models.User, error) {
	// Obtener un usuario por su ID
	var user models.User
	err := database.DB.Where("id = ?", userId).First(&user).Error
	if err != nil {
		return user, err
	}
	fmt.Print("el usuario es: ", user)
	return user, nil
}

func GetUserByNickname(nickname string) (models.User, error) {
	// Obtener un usuario por su nickname
	var user models.User
	err := database.DB.Where("nickname = ?", nickname).First(&user).Error
	if err != nil {
		return user, err
	}
	return user, nil
}

func GetUserByEmail(email string) (bool, error) {
	// Obtener un usuario por su email
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

func RecoverUserByEmail(email string) (models.User, error) {
	// Recuperar un usuario por su email
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return user, err
	}
	return user, nil
}
