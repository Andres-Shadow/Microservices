package main

import (
	"net/http"
	"time"

	DataBase "taller_apirest/Database"
	"taller_apirest/communication"
	"taller_apirest/handlers"
	"taller_apirest/models"
	"taller_apirest/utilities"

	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {

	//set up the server
	initServer()
	//precharge sample users
	utilities.PrechargeSampleUsers()

	r := mux.NewRouter()
	//login route
	utilities.StartTime = time.Now()

	defineLoginRegisterEndpoints(r.PathPrefix("/api/v1").Subrouter())
	defineHealthEndpoints(r.PathPrefix("/api/v1").Subrouter())
	defineMetricsEndpoints(r.PathPrefix("/api/v1").Subrouter())
	//user routes
	//creating route prefix
	//and delegating a function subroutes responsability
	defineUserEndpoints(r.PathPrefix("/api/v1/users").Subrouter())

	http.ListenAndServe(":9090", r)

}

func initServer() {
	//establish a database connection
	DataBase.DBConnection()
	DataBase.DB.AutoMigrate(models.User{})
}

// defineUserEndpoints is a function that defines the user subroutes
// user the prefix "/api/v1/user"
func defineUserEndpoints(userRouter *mux.Router) {
	//RESTful API endpoints for crud
	userRouter.HandleFunc("/", handlers.GetUsersHandler).Methods("GET")
	userRouter.HandleFunc("/", handlers.PostUserHandler).Methods("POST")
	userRouter.HandleFunc("/", handlers.DeleteUserHandler).Methods("DELETE")
	userRouter.HandleFunc("/", handlers.UpdateUserHandler).Methods("PUT")
	userRouter.HandleFunc("/{email}", handlers.GetUserHandlerByEmail).Methods("GET")

	//RESTful API endpoints for user recover and update password
	userRouter.HandleFunc("/password/", handlers.RecoverPassword).Methods("GET")
	userRouter.HandleFunc("/password", handlers.UpdateUserPassword).Methods("PATCH")
}

func defineLoginRegisterEndpoints(loginRouter *mux.Router) {
	loginRouter.HandleFunc("/login", handlers.LoginHandler).Methods("POST")
}

func defineHealthEndpoints(healthRouter *mux.Router) {
	healthRouter.HandleFunc("/health", handlers.CheckHealth).Methods("GET")
	healthRouter.HandleFunc("/health/ready", handlers.CheackReadyHealth).Methods("GET")
	healthRouter.HandleFunc("/health/live", handlers.CheckLive).Methods("GET")
}
func defineMetricsEndpoints(metricsRouter *mux.Router) {
	metricsRouter.Handle("/metrics", promhttp.Handler()).Methods("GET")
}

var (
	healthRequests = prometheus.NewCounter(prometheus.CounterOpts{
		Name: "health_requests_total",
		Help: "Total de solicitudes de verificación de salud.",
	})

	dbStatusGauge = prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "database_status",
		Help: "Estado de la conexión a la base de datos (1 = READY, 0 = DOWN).",
	})

	natsStatusGauge = prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "nats_status",
		Help: "Estado de la conexión a NATS (1 = READY, 0 = DOWN).",
	})
)

func init() {
	prometheus.MustRegister(healthRequests, dbStatusGauge, natsStatusGauge)
}

// Función que verifica la salud del servicio y actualiza las métricas
func VerifyHealth() models.GeneralCheck {
	healthRequests.Inc() // Incrementar el contador de solicitudes de verificación de salud

	databaseConnection := DataBase.VerifyDatabaseConnection()
	natsConnection := communication.ConnectToNATS().HealthCheckNATS()
	fromTime := time.Now()

	checks := []models.HealthCheck{}
	var checkStatus string

	// Actualizar el estado de la base de datos
	var dbStatus string = "DOWN"
	if databaseConnection {
		dbStatus = "READY"
		dbStatusGauge.Set(1) // Gauge de Prometheus
	} else {
		dbStatusGauge.Set(0)
	}

	DatabaseData := models.HealthData{
		From:   fromTime,
		Status: dbStatus,
	}

	checkStatus = "UP"
	if dbStatus != "READY" {
		checkStatus = "DOWN"
	}

	healthCheck := models.HealthCheck{
		Data:   DatabaseData,
		Name:   "User service Database live connection check",
		Status: checkStatus,
	}

	checks = append(checks, healthCheck)

	// Actualizar el estado de NATS
	var natsStatus string = "DOWN"
	if natsConnection {
		natsStatus = "READY"
		natsStatusGauge.Set(1)
	} else {
		natsStatusGauge.Set(0)
	}

	checkStatus = "UP"
	if natsStatus != "READY" {
		checkStatus = "DOWN"
	}

	NatsData := models.HealthData{
		From:   fromTime,
		Status: natsStatus,
	}

	natsHealthCheck := models.HealthCheck{
		Data:   NatsData,
		Name:   "User service NATS live connection check",
		Status: checkStatus,
	}

	checks = append(checks, natsHealthCheck)

	var reportStatus string
	if natsStatus == "READY" && dbStatus == "READY" {
		reportStatus = "UP"
	} else {
		reportStatus = "DOWN"
	}

	report := models.GeneralCheck{
		Status:  reportStatus,
		Checks:  checks,
		Version: "1.0.0",
		Uptime:  time.Now().String(),
	}

	return report
}
