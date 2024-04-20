package handlers

import (
	"encoding/json"
	"net/http"
	"taller_apirest/models"
	"taller_apirest/utilities"
)

func CheckLive(w http.ResponseWriter, r *http.Request) {

	report := utilities.VerifyHealth()
	// enviar el arreglo de checks
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(report)
}

func CheackReadyHealth(w http.ResponseWriter, r *http.Request) {
	report := utilities.VerifyReadyHealth()
	// enviar el arreglo de checks
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(report)
}

func CheckHealth(w http.ResponseWriter, r *http.Request) {
	live := utilities.VerifyHealth()
	ready := utilities.VerifyReadyHealth()

	report := models.Health{}

	report.Checks = append(report.Checks, ready)
	report.Checks = append(report.Checks, live)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(report)

}
