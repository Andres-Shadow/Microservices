package messaging

import (
	"fmt"
	"log"
	"os"

	"github.com/nats-io/nats.go"
)

func InitNats() {
	var natsHost string
	// Conectar al servidor NATS
	natsHost = os.Getenv("NATS_SERVER")
	if natsHost == "" {
		natsHost = "localhost"
	}
	url := "nats://" + natsHost + ":4222"

	nc, err := nats.Connect(url)
	if err != nil {
		log.Fatal(err)
	}
	defer nc.Close()

	fmt.Println("Inicializando NATS...")

	// Tema para notificaciones de autenticación
	authEventsSubject := "auth.events"

	// Función para manejar los mensajes recibidos
	msgHandler := func(msg *nats.Msg) {
		// Procesar el mensaje recibido
		log.Printf("Mensaje recibido: %s", msg.Data)
		// Aquí puedes hacer cualquier acción necesaria con el mensaje recibido
	}

	// Suscribirse al tema para recibir notificaciones
	_, err = nc.Subscribe(authEventsSubject, msgHandler)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Escuchando notificaciones en el tema: %s", authEventsSubject)

}
