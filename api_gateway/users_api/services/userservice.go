package services

import (
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

func CreateUser(user models.User) models.User {
	// Crear un nuevo usuario
	database.DB.Create(&user)
	return user
}

func DeleteUser(user models.User) {
	// Eliminar un usuario
	database.DB.Delete(&user)
}

func UpdateUser(user models.User) models.User {
	// Actualizar un usuario
	database.DB.Save(&user)
	return user
}
