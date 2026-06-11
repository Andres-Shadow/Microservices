package handlers

import (
	"net/http"
	"users_api/services"

	"github.com/gin-gonic/gin"
)

func CheckLive(c *gin.Context) {
	report := services.VerifyHealth()
	c.JSON(http.StatusOK, report)
}

func CheckReadyHealth(c *gin.Context) {
	report := services.VerifyReadyHealth()
	c.JSON(http.StatusOK, report)
}

func CheckHealth(c *gin.Context) {
	live := services.VerifyHealth()
	ready := services.VerifyReadyHealth()

	c.JSON(http.StatusOK, gin.H{
		"live":  live,
		"ready": ready,
	})
}
