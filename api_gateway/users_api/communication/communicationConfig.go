package communication

import (
	"fmt"
	"log"
	"os"
	"users_api/middlerware"

	"github.com/nats-io/nats.go"
)


func SubscribeToNATS(done <-chan struct{}) {
	natsServer := os.Getenv("NATS_SERVER")
	natsSubject := os.Getenv("NATS_SUBJECT")

	if natsServer == "" {
		natsServer = "localhost"
	}
	if natsSubject == "" {
		natsSubject = "users.creation"
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
		fmt.Printf("Recibido un mensaje en %s: %s\n", natsSubject, string(m.Data))
		middlerware.FilterMessager(string(m.Data))
	})
	if err != nil {
		log.Fatalf("Error al suscribirse a NATS: %v", err)
	}
	defer subscription.Unsubscribe()

	// Mantener la conexión viva hasta que se cierre el canal done
	<-done
	fmt.Println("Cerrando suscripción a NATS...")
}
