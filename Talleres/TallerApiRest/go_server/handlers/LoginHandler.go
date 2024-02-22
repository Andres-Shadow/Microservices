package handlers

import (
	"encoding/json"
	"net/http"
	"taller_apirest/models"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

}
