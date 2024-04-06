package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/nats-io/nats.go"
)

func main() {
	// Configurar el enrutador Gorilla Mux
	router := mux.NewRouter()

	// Inicializar y configurar servidor NATS
	nc := sNats()

	// Manejador para la ruta /api/v1/logs
	router.HandleFunc("/api/v1/logs", LogsHandler).Methods("GET")

	// Iniciar servidor HTTP
	http.Handle("/", router)
	fmt.Println("Servidor escuchando en el puerto 9091...")
	log.Fatal(http.ListenAndServe(":9091", nil))

	// Cerrar la conexión de NATS al finalizar el programa
	nc.Close()
}
a
// Handler para la ruta /api/v1/logs
func LogsHandler(w http.ResponseWriter, r *http.Request) {
	// Aquí podrías implementar la lógica para manejar las solicitudes de logs
	fmt.Fprintf(w, "Endpoint de logs")
}

func sNats() *nats.Conn {
	// Configurar servidor NATS
	nc, err := nats.Connect(nats.DefaultURL)
	if err != nil {
		log.Fatal(err)
	}

	// Suscribirse a un tema de NATS para recibir mensajes
	_, err = nc.Subscribe("auth.events", func(msg *nats.Msg) {
		fmt.Printf("Mensaje recibido: %s\n", string(msg.Data))
	})
	if err != nil {
		log.Fatal(err)
	}

	return nc
}
