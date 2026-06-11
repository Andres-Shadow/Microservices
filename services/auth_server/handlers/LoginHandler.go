package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"taller_apirest/models"
	"taller_apirest/security"
	"taller_apirest/utilities"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	if user.Username == "" || user.Password == "" {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "Username and password are required"})
		utilities.SendLogToNats(user.Username, "Login failed", "Login attempt with missing credentials", "ERROR")
		return
	}

	if _, err := utilities.SearchUser(&user); err != nil {
		utilities.SendLogToNats(
			user.Username,
			"Login failed",
			fmt.Sprintf("User %s failed authentication", user.Username),
			"ERROR",
		)
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "Invalid credentials"})
		return
	}

	utilities.SendLogToNats(
		user.Username,
		"Login successful",
		fmt.Sprintf("User %s logged in successfully", user.Username),
		"INFO",
	)

	tokenString := security.LoginHandler(&user)
	respondJSON(w, http.StatusOK, map[string]string{"token": tokenString})
}
