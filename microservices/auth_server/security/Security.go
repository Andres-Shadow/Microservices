package security

import (
	"fmt"
	"os"
	"taller_apirest/models"
	"time"

	"github.com/golang-jwt/jwt"
)

func jwtSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "changeme_set_JWT_SECRET_env_var"
	}
	return []byte(secret)
}

// LoginHandler genera un token JWT firmado para el usuario dado.
func LoginHandler(user *models.User) string {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = user.Username
	claims["exp"] = time.Now().Add(time.Hour).Unix()
	claims["iss"] = "ingesis.uniquindio.edu.co"

	tokenString, _ := token.SignedString(jwtSecret())
	return tokenString
}

// VerifyToken valida un token JWT y devuelve (válido, username).
func VerifyToken(token string) (bool, string) {
	tokenV, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inesperado: %v", token.Header["alg"])
		}
		return jwtSecret(), nil
	})

	if err != nil || !tokenV.Valid {
		return false, ""
	}

	claims, ok := tokenV.Claims.(jwt.MapClaims)
	if !ok || claims["iss"] != "ingesis.uniquindio.edu.co" {
		return false, ""
	}

	username, _ := claims["sub"].(string)
	return true, username
}
