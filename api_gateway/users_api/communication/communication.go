package communication

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"users_api/models"
	"users_api/services"

	"github.com/nats-io/nats.go"
)

func SubscribeToNATS(done <-chan struct{}) {
	natsServer := os.Getenv("NATS_HOST")
	natsSubject := os.Getenv("NATS_SUBJECT")

	if natsServer == "" {
		natsServer = "localhost"
	}
	if natsSubject == "" {
		natsSubject = "MicroservicesLogs"
	}

	natsUrl := "nats://" + natsServer + ":4222"

	// Conectar a NATS
	nc, err := nats.Connect(natsUrl)
	if err != nil {
		log.Fatalf("Error al conectar a NATS: %v", err)
	}
	defer nc.Close()

	fmt.Printf("Suscribiéndose al tema %s...\n", natsSubject)

	// Suscribirse al tema
	subscription, err := nc.Subscribe(natsSubject, func(m *nats.Msg) {
		//fmt.Printf("Recibido un mensaje en %s: %s\n", natsSubject, string(m.Data))
		filterMessager(string(m.Data))
	})
	if err != nil {
		log.Fatalf("Error al suscribirse a NATS: %v", err)
	}
	defer subscription.Unsubscribe()

	// Mantener la conexión viva hasta que se cierre el canal done
	<-done
	fmt.Println("Cerrando suscripción a NATS...")
}

func filterMessager(Rmessage string) {
	var message models.Message

	err := json.Unmarshal([]byte(Rmessage), &message)
	if err != nil {
		log.Printf("Error deserializando JSON: %v", err)
		return
	}

	// Verificar si el log_type es "Error"
	if message.LogType == "CREATION" {
		services.CreateUserFromMessage(message)
	} else {
		fmt.Println("Mensaje no es un error, ignorando...")
	}
}
