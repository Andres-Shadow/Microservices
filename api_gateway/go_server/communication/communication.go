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
	once.Do(func() {
		nc, err := nats.Connect(url)
		if err != nil {
			log.Fatalf("Error al conectar con NATS: %v", err)
		}
		instance = nc
	})

	return &NatsLogger{conn: instance}
}

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


func (nl *NatsLogger) NotifyUserRegistration(name, email, log_type string) bool{
	var subject string = "users.creation"
	msg := models.Registration{
		Name:  name,
		Email: email,
		Type:  log_type,
	}
	jsonData, err := json.Marshal(msg)
	if err != nil {
		return false
	}
	if err := nl.conn.Publish(subject, jsonData); err != nil {
		return false
	}
	return true

}

func (nl *NatsLogger) SendSampleMessage() bool {
	var subject string = "test"

	if err := nl.conn.Publish(subject, []byte("Sample message")); err != nil {
		return false
	}

	return true
}

// HealthCheckNATS verifica si la conexión a NATS está viva
func (nl *NatsLogger) HealthCheckNATS() bool {
	if nl.conn == nil {
		return false
	} else if nl.conn.Status() != nats.CONNECTED {
		return false
	}
	return true
}

// ReadyNats verifica si se puede enviar un mensaje por NATS
func (nl *NatsLogger) ReadyNats() bool {

	return nl.SendSampleMessage()

}
