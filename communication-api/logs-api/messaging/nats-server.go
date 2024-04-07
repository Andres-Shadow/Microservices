package messaging

import (
	"encoding/json"
	"log"
	"logs-api/models"
	"logs-api/utilities"
	"os"

	"github.com/nats-io/nats.go"
)

func InitNats(evento string) *nats.Conn {
	// Inicializar NATS
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

	// Tema al que te suscribes para recibir las notificaciones de autenticación
	//authEventsSubject := "auth.events"

	// Función de manejo de mensajes
	msgHandler := func(msg *nats.Msg) {
		// Decodificar el mensaje JSON
		var notification models.Application
		if err := json.Unmarshal(msg.Data, &notification); err != nil {
			log.Println("Error decoding JSON:", err)
			return
		}

		// Manejar el mensaje
		//fmt.Println("llego aqui")
		log.Printf("Received notification:\nName: %s\nDescription: %s\nTime: %s\n", notification.Name, notification.Description, notification.LogDate)
		utilities.CreateLog(notification)
	}

	// Suscribirse al tema para recibir los mensajes
	_, err = nc.Subscribe(evento, msgHandler)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Subscribed to subject: %s\n", evento)

	return nc
}
