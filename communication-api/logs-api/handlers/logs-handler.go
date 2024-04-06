package handlers

import (
	"encoding/json"
	"logs-api/utilities"
	"net/http"
	"strconv"
)

type LogResponse struct {
	Logs      []int `json:"logs"`
	Registros int   `json:"registros"`
}

func GetAllLogs(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	page, _ := strconv.Atoi(query.Get("page"))
	pageSize, _ := strconv.Atoi(query.Get("pageSize"))

	if query.Get("page") == "" && query.Get("pageSize") == "" {
		page = 1
		pageSize = 10
	}

	logs := utilities.GetAllLogs(page, pageSize)
	tam := utilities.CountAllLogs()

	response := LogResponse{
		Logs:      logs,
		Registros: tam,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
