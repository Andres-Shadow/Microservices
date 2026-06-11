package communication

import (
	"encoding/json"
	"log"
	"os"
	"sync"
	"users_api/models"

	"github.com/nats-io/nats.go"
)

var (
	once     sync.Once
	instance *nats.Conn
)

// NatsLogger wraps the singleton NATS connection.
type NatsLogger struct {
	conn *nats.Conn
}

// ConnectToNATS returns the singleton NatsLogger instance.
func ConnectToNATS() *NatsLogger {
	natsHost := os.Getenv("NATS_SERVER")
	if natsHost == "" {
		natsHost = "localhost"
	}
	url := "nats://" + natsHost + ":4222"

	once.Do(func() {
		nc, err := nats.Connect(url)
		if err != nil {
			log.Fatalf("Failed to connect to NATS: %v", err)
		}
		instance = nc
	})

	return &NatsLogger{conn: instance}
}

// SendLog publishes a Message as JSON to the configured NATS subject.
func (nl *NatsLogger) SendLog(newLog *models.Message) {
	subject := os.Getenv("NATS_SUBJECT")
	if subject == "" {
		subject = "MicroservicesLogs"
	}

	jsonData, err := json.Marshal(newLog)
	if err != nil {
		log.Printf("Error serializing log message: %v", err)
		return
	}

	if err := nl.conn.Publish(subject, jsonData); err != nil {
		log.Printf("Error publishing log to NATS: %v", err)
	}
}

// SendSampleMessage publishes a test message to the "test" subject.
func (nl *NatsLogger) SendSampleMessage() bool {
	return nl.conn.Publish("test", []byte("Sample message")) == nil
}

// HealthCheckNATS verifies that the NATS connection is active.
func (nl *NatsLogger) HealthCheckNATS() bool {
	return nl.conn != nil && nl.conn.Status() == nats.CONNECTED
}

// ReadyNats verifies that publishing to NATS works.
func (nl *NatsLogger) ReadyNats() bool {
	return nl.SendSampleMessage()
}
