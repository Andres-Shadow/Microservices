package handlers

import (
	"encoding/json"
	"net/http"
	"taller_apirest/utilities"
)

func CheckHealth(w http.ResponseWriter, r *http.Request) {

	report := utilities.VerifyHealth()
	// enviar el arreglo de checks
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(report)
}
