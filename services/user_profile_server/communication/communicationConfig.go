package communication

import (
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

	nc, err := nats.Connect(natsUrl)
	if err != nil {
		log.Fatalf("Failed to connect to NATS: %v", err)
	}
	defer nc.Close()

	log.Printf("Subscribing to NATS subject: %s", natsSubject)

	subscription, err := nc.Subscribe(natsSubject, func(m *nats.Msg) {
		log.Printf("Message received on %s", natsSubject)
		middlerware.FilterMessager(string(m.Data))
	})
	if err != nil {
		log.Fatalf("Failed to subscribe to NATS: %v", err)
	}
	defer subscription.Unsubscribe()

	<-done
	log.Println("Closing NATS subscription...")
}
