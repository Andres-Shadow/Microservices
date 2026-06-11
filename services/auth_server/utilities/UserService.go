package utilities

import (
	"errors"
	DataBase "taller_apirest/Database"
	"taller_apirest/models"
	"taller_apirest/security"

	"golang.org/x/crypto/bcrypt"
)

// hashPassword genera el hash bcrypt de una contraseña en texto plano.
func hashPassword(plain string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	return string(bytes), err
}

// checkPassword compara una contraseña en texto plano con su hash bcrypt.
func checkPassword(plain, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain)) == nil
}

func GetUsers(page, pageSize int) ([]models.User, error) {
	var users []models.User
	offset := (page - 1) * pageSize
	err := DataBase.DB.Offset(offset).Limit(pageSize).Find(&users).Error
	return users, err
}

func CountUsers() (int, error) {
	var count int64
	err := DataBase.DB.Model(&models.User{}).Count(&count).Error
	return int(count), err
}

// SearchUser busca un usuario por username y verifica la contraseña con bcrypt.
func SearchUser(user *models.User) (bool, error) {
	var found models.User
	if err := DataBase.DB.Where("username = ?", user.Username).First(&found).Error; err != nil {
		return false, err
	}
	if !checkPassword(user.Password, found.Password) {
		return false, errors.New("invalid credentials")
	}
	// Copiar los datos encontrados al puntero recibido para que el caller tenga el registro completo
	*user = found
	return true, nil
}

func GetUserById(id string) (*models.User, error) {
	var user models.User
	if err := DataBase.DB.First(&user, id).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

func CreateUser(user models.User) (*models.User, error) {
	hashed, err := hashPassword(user.Password)
	if err != nil {
		return nil, err
	}
	user.Password = hashed
	if err := DataBase.DB.Create(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func UpdateUser(user models.User, oldEmail string) (*models.User, error) {
	var userToUpdate models.User
	if err := DataBase.DB.Where("email = ?", oldEmail).First(&userToUpdate).Error; err != nil {
		return nil, errors.New("user not found")
	}
	if user.Password == "" {
		return nil, errors.New("password is required")
	}

	hashed, err := hashPassword(user.Password)
	if err != nil {
		return nil, err
	}

	userToUpdate.Username = user.Username
	userToUpdate.Password = hashed
	userToUpdate.Email = user.Email
	DataBase.DB.Save(&userToUpdate)
	return &userToUpdate, nil
}

func DeleteUser(email string) error {
	var user models.User
	if err := DataBase.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return errors.New("user not found")
	}
	DataBase.DB.Unscoped().Delete(&user)
	return nil
}

func UpdateUserPassword(user models.User) (*models.User, error) {
	var userToUpdate models.User
	if err := DataBase.DB.Where("email = ?", user.Email).First(&userToUpdate).Error; err != nil {
		return nil, errors.New("user not found")
	}

	hashed, err := hashPassword(user.Password)
	if err != nil {
		return nil, err
	}

	userToUpdate.Password = hashed
	DataBase.DB.Save(&userToUpdate)
	return &userToUpdate, nil
}

func RecoverPassword(email string) (string, string, error) {
	var user models.User
	if err := DataBase.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return "", "", errors.New("user not found")
	}
	token := security.LoginHandler(&user)
	return token, user.Username, nil
}

func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := DataBase.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}
