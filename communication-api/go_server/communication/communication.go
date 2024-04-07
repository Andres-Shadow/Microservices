package communication

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"taller_apirest/models"

	"github.com/nats-io/nats.go"
)

func ConnectToNATS() *nats.Conn {
	var natsHost string
	natsHost = os.Getenv("NATS_SERVER")
	if natsHost == "" {
		natsHost = "localhost"
	}
	url := "nats://" + natsHost + ":4222"

	nc, err := nats.Connect(url)
	if err != nil {
		log.Fatal(err)
	}
	return nc
}

func NotifyLogin(nc *nats.Conn, newLog *models.LogResponse, event string) {
	// Definir la estructura de la notificación

	// Convertir la estructura en JSON
	jsonData, err := json.Marshal(newLog)
	if err != nil {
		log.Fatal(err)
	}

	// Publicar el mensaje JSON
	if err := nc.Publish(event, jsonData); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Notification sent")
}
