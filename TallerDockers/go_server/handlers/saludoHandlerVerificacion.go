package handlers

import (
	"fmt"
	"net/http"
	"strings"
	"github.com/dgrijalva/jwt-go"
)

func SaludoHandler(w http.ResponseWriter, r *http.Request) {
	// Obtener el nombre de usuario de los parámetros de la URL
	username := r.URL.Query().Get("nombre")

	// Verificar si se proporcionó un nombre de usuario
	if username == "" {
		http.Error(w, "Solicitud no válida: el nombre es obligatorio", http.StatusBadRequest)
		return
	}

	// Verificar la presencia del token JWT en la cabecera Authorization
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Token de autorización faltante", http.StatusUnauthorized)
		return
	}

	// Extraer el token de la cabecera Authorization
	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

	// Parsear y verificar el token JWT
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Verificar el algoritmo de firma
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Método de firma inesperado: %v", token.Header["alg"])
		}
		// Deberías tener tu clave secreta aquí, asegúrate de que sea la misma utilizada para firmar el token en la ruta de login
		return []byte("contraseña_super_secreta_100%_real_no_fake"), nil
	})

	// Verificar errores en el token JWT
	if err != nil {
		http.Error(w, "Token de autorización inválido: "+err.Error(), http.StatusUnauthorized)
		return
	}

	// Verificar si el token es válido
	if !token.Valid {
		http.Error(w, "Token de autorización inválido", http.StatusUnauthorized)
		return
	}

	// Verificar si el emisor del token es correcto
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["iss"] != "ingesis.uniquindio.edu.co" {
		http.Error(w, "Token de autorización inválido: emisor incorrecto", http.StatusUnauthorized)
		return
	}

	// Verificar si el nombre en el token coincide con el nombre proporcionado en la URL
	if claims["sub"] != username {
		http.Error(w, "Token de autorización inválido: nombre de usuario no coincide", http.StatusUnauthorized)
		return
	}

	// Responder con un saludo personalizado
	response := fmt.Sprintf("Hola, %s", username)
	fmt.Fprintln(w, response)
}
