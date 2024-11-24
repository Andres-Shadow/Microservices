package utilities

import (
	"errors"
	"fmt"
	DataBase "taller_apirest/Database"
	"taller_apirest/models"
	"taller_apirest/security"
)

func GetUsers(page, pageSize int) ([]models.User, error) {
	var users []models.User

	// Calcula el desplazamiento basado en la página y el tamaño de la página
	offset := (page - 1) * pageSize

	// Realiza la consulta con el desplazamiento y el tamaño de página adecuados
	err := DataBase.DB.Offset(offset).Limit(pageSize).Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}

func CountUsers() (int, error) {
	var count int64
	err := DataBase.DB.Model(&models.User{}).Count(&count).Error
	if err != nil {
		return 0, err
	}
	return int(count), nil
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

func UpdateUser(user models.User, oldEmail string) (*models.User, error) {
	var userToUpdate models.User
	DataBase.DB.Where("email = ?", oldEmail).First(&userToUpdate)

	if userToUpdate.Id == 0 || user.Password == "" {
		fmt.Println("user not found")
		return nil, errors.New("user not found")
	}

	userToUpdate.Username = user.Username
	userToUpdate.Password = user.Password
	userToUpdate.Email = user.Email
	DataBase.DB.Save(&userToUpdate)
	return &userToUpdate, nil
}

func DeleteUser(email string) error {
	var user models.User
	DataBase.DB.Where("email = ?", email).First(&user)

	if user.Email == "" {
		return errors.New("user not found")
	}

	DataBase.DB.Unscoped().Delete(&user)
	return nil
}

func UpdateUserPassword(user models.User) (*models.User, error) {
	var userToUpdate models.User
	DataBase.DB.Where("email = ?", user.Email).First(&userToUpdate)

	if userToUpdate.Password == "" || userToUpdate.Email != user.Email {
		fmt.Println("user not found aqui")
		return nil, errors.New("user not found")
	}

	userToUpdate.Password = user.Password
	DataBase.DB.Save(&userToUpdate)
	return &userToUpdate, nil
}

func RecoverPassword(email string) (string, string, error) {
	var userToUpdate models.User
	DataBase.DB.Where("email = ?", email).First(&userToUpdate)

	if userToUpdate.Password == "" {
		return "", "", errors.New("user not found")
	}

	token := security.LoginHandler(&userToUpdate)
	username := userToUpdate.Username
	return token, username, nil
}

func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	fmt.Println("email", email)
	DataBase.DB.Where("email = ?", email).First(&user)
	if user.Id == 0 {
		return nil, errors.New("user not found")
	}
	return &user, nil
}
