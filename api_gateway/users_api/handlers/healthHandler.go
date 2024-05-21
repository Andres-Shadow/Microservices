package handlers

import (
	"net/http"
	"users_api/services"

	"github.com/gin-gonic/gin"
)

func CheckLive(c *gin.Context) {
	
	report := services.VerifyHealth()
	// enviar el arreglo de checks
	c.JSON(http.StatusOK, report)
}

func CheackReadyHealth(c *gin.Context) {
	report := services.VerifyReadyHealth()
	// enviar el arreglo de checks
	c.JSON(http.StatusOK, report)
}

func CheckHealth(c *gin.Context) {
	live := services.VerifyHealth()
	ready := services.VerifyReadyHealth()

	// Concatenar los resultados en un solo mapa
	response := map[string]interface{}{
		"live":  live,
		"ready": ready,
	}

	c.JSON(http.StatusOK, response)
}
