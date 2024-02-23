package security

import (
	"taller_apirest/models"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// Manejador para la ruta /login
func LoginHandler(user *models.User) string {

	// Generar el token JWT
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = user.Username
	claims["exp"] = time.Now().Add(time.Hour).Unix() // Token válido por una hora
	claims["iss"] = "ingesis.uniquindio.edu.co"

	// Firmar el token con una clave secreta y obtener el string del token
	tokenString, _ := token.SignedString([]byte("contraseña_super_secreta_100%_real_no_fake"))

	return tokenString
}
