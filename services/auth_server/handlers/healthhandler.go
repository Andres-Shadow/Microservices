package handlers

import (
	"net/http"
	"taller_apirest/utilities"
)

func CheckLive(w http.ResponseWriter, r *http.Request) {
	report := utilities.VerifyHealth()
	respondJSON(w, http.StatusOK, report)
}

func CheckReadyHealth(w http.ResponseWriter, r *http.Request) {
	report := utilities.VerifyReadyHealth()
	respondJSON(w, http.StatusOK, report)
}

func CheckHealth(w http.ResponseWriter, r *http.Request) {
	live := utilities.VerifyHealth()
	ready := utilities.VerifyReadyHealth()

	response := map[string]interface{}{
		"live":  live,
		"ready": ready,
	}
	respondJSON(w, http.StatusOK, response)
}
