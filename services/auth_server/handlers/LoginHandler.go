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
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if user.Username == "" || user.Password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		utilities.SendLogToNats(user.Username, "Login attempt", "Login failed: missing credentials", "ERROR")
		return
	}

	if _, err := utilities.SearchUser(&user); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Invalid credentials"))
		utilities.SendLogToNats(
			user.Username,
			"Login attempt",
			fmt.Sprintf("User %s failed to log in with email %s", user.Username, user.Email),
			"ERROR",
		)
		return
	}

	utilities.SendLogToNats(
		user.Username,
		"User logged in",
		fmt.Sprintf("User %s logged in with email %s", user.Username, user.Email),
		"INFO",
	)

	tokenString := security.LoginHandler(&user)
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprint(w, tokenString)
}
