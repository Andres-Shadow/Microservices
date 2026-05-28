package communication

import (
	"encoding/json"
	"log"
	"os"
	"sync"
	"taller_apirest/models"

	"github.com/nats-io/nats.go"
)

var (
	once     sync.Once
	instance *nats.Conn
)

// NatsLogger encapsula la conexión a NATS.
type NatsLogger struct {
	conn *nats.Conn
}

// ConnectToNATS devuelve el singleton de NatsLogger, conectándose la primera vez.
func ConnectToNATS() *NatsLogger {
	natsHost := os.Getenv("NATS_SERVER")
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

// SendLog publica un LogResponse serializado en JSON al subject configurado.
func (nl *NatsLogger) SendLog(newLog *models.LogResponse) {
	subject := os.Getenv("NATS_SUBJECT")
	if subject == "" {
		subject = "MicroservicesLogs"
	}

	jsonData, err := json.Marshal(newLog)
	if err != nil {
		log.Printf("Error serializando log: %v", err)
		return
	}

	if err := nl.conn.Publish(subject, jsonData); err != nil {
		log.Printf("Error publicando log en NATS: %v", err)
	}
}

// NotifyUserRegistration publica un evento de usuario al subject users.creation.
func (nl *NatsLogger) NotifyUserRegistration(name, email, logType string) bool {
	subject := "users.creation"
	msg := models.Registration{
		Name:  name,
		Email: email,
		Type:  logType,
	}
	jsonData, err := json.Marshal(msg)
	if err != nil {
		return false
	}
	return nl.conn.Publish(subject, jsonData) == nil
}

// SendSampleMessage publica un mensaje de prueba al subject "test".
func (nl *NatsLogger) SendSampleMessage() bool {
	return nl.conn.Publish("test", []byte("Sample message")) == nil
}

// HealthCheckNATS verifica si la conexión a NATS está activa.
func (nl *NatsLogger) HealthCheckNATS() bool {
	return nl.conn != nil && nl.conn.Status() == nats.CONNECTED
}

// ReadyNats verifica si se puede publicar un mensaje en NATS.
func (nl *NatsLogger) ReadyNats() bool {
	return nl.SendSampleMessage()
}
