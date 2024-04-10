package communication

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
	"taller_apirest/models"

	"github.com/nats-io/nats.go"
)

var (
	once     sync.Once
	instance *nats.Conn
	logger   *NatsLogger // Variable global para acceder a la instancia única de NatsLogger
)

// NatsLogger es una estructura que contiene la conexión a NATS
type NatsLogger struct {
	conn *nats.Conn
}

func ConnectToNATS() *NatsLogger {
	var natsHost string
	natsHost = os.Getenv("NATS_SERVER")
	if natsHost == "" {
		natsHost = "localhost"
	}
	url := "nats://" + natsHost + ":4222"

	// nc, err := nats.Connect(url)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// return nc
	once.Do(func() {
		nc, err := nats.Connect(url)
		if err != nil {
			log.Fatalf("Error al conectar con NATS: %v", err)
		}
		instance = nc
	})

	return &NatsLogger{conn: instance}
}

// func NotifyLogin(nc *nats.Conn, newLog *models.LogResponse, event string) {
// 	// Definir la estructura de la notificación

// 	// Convertir la estructura en JSON
// 	jsonData, err := json.Marshal(newLog)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	// Publicar el mensaje JSON
// 	if err := nc.Publish("MicroservicesLogs", jsonData); err != nil {
// 		log.Fatal(err)
// 	}

// 	fmt.Println("Notification sent")
// }

func init() {
	logger = ConnectToNATS()
}

// SendLog envía un mensaje al tema de NATS usando la información en Notification
func (nl *NatsLogger) SendLog(newLog *models.LogResponse) {

	var subject string

	subject = os.Getenv("NATS_SUBJECT")
	if subject == "" {
		subject = "MicroservicesLogs"
	}

	// Convertir la estructura en JSON
	jsonData, err := json.Marshal(newLog)
	if err != nil {
		log.Fatal(err)
	}
	// return nl.conn.Publish(subject, []byte(notification.Message))
	// Publicar el mensaje JSON
	if err := nl.conn.Publish("MicroservicesLogs", jsonData); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Notification sent")
}
