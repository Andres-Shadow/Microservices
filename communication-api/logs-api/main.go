package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/nats-io/nats.go"
)

func main() {
	// Conectar al servidor NATS
	natsUrl := os.Getenv("NATS_SERVER")
	fmt.Println("NATS_SERVER: ", natsUrl)
	url := "nats://nats:4222"
	//nc, err := nats.Connect(nats.DefaultURL)
	nc, err := nats.Connect(url)
	if err != nil {
		log.Fatal(err)
	}
	defer nc.Close()

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

	// Esperar señales de interrupción para salir graciosamente
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh
	log.Println("Saliendo...")
}
