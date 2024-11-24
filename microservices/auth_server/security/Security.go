package security

import (
	"fmt"
	"taller_apirest/models"
	"time"

	"github.com/golang-jwt/jwt"
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

// Verifiy the token
func VerifyToken(token string) (bool,string) {
	// Parsear y verificar el token JWT
	tokenV, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		// Verificar el algoritmo de firma
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Método de firma inesperado: %v", token.Header["alg"])
		}
		// Deberías tener tu clave secreta aquí, asegúrate de que sea la misma utilizada para firmar el token en la ruta de login
		return []byte("contraseña_super_secreta_100%_real_no_fake"), nil
	})

	// Verificar errores en el token JWT
	if err != nil {
		return false,""
	}

	// Verificar si el token es válido
	if !tokenV.Valid {
		return false,""
	}

	// Verificar si el emisor del token es correcto
	claims, ok := tokenV.Claims.(jwt.MapClaims)
	if !ok || claims["iss"] != "ingesis.uniquindio.edu.co" {
		return false,""
	}

	//obtener el nombre de usuario del token
	username := claims["sub"].(string)
	return true, username
}
