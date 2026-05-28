# Microservices Platform

Plataforma de microservicios desarrollada en múltiples lenguajes (Go, Node.js/TypeScript, Python).

## Estructura del proyecto

```
.
├── services/                   # Microservicios
│   ├── auth_server/            # Autenticación y gestión de usuarios (Go/Gorilla Mux)
│   ├── logs_manager_server/    # Gestión de logs via NATS (TypeScript/Express)
│   ├── user_profile_server/    # Perfiles de usuario (Go/Gin)
│   ├── gateway_server/         # API Gateway (Node.js/Fastify)
│   ├── health_server/          # Monitor de salud de servicios (Python/Flask)
│   └── notification_server/    # Notificaciones por email (Python/Flask)
│
├── database/
│   └── shared_postgres/        # PostgreSQL compartido — schema-per-service
│       ├── Dockerfile
│       └── init.sql            # Crea schemas: auth, logs, user_profile
│
├── tests/
│   └── gherkin/                # Tests E2E con Cucumber.js
│
├── ci/
│   └── jenkins/                # Configuración de Jenkins
│
├── docs/
│   └── documentation/          # Especificaciones OpenAPI por servicio
│
├── docker-compose.yml          # Orquestación completa del stack
└── prometheus.yml              # Configuración de Prometheus (pendiente)
```

## Base de datos

Se usa una única instancia PostgreSQL con **schema-per-service**:

| Schema         | Servicio              | Usuario      |
|----------------|-----------------------|--------------|
| `auth`         | auth_server           | devuser      |
| `logs`         | logs_manager_server   | logsuser     |
| `user_profile` | user_profile_server   | profileuser  |

> `health_server` y `notification_server` aún usan MySQL propio (pendiente migración).

## Levantar el stack

```bash
docker-compose up --build
```

## Puertos

| Servicio             | Puerto |
|----------------------|--------|
| auth_server          | 9090   |
| logs_manager_server  | 9091   |
| health_server        | 9092   |
| user_profile_server  | 9094   |
| gateway_server       | 9095   |
| notification_server  | 9096   |
| PostgreSQL           | 5432   |
| NATS                 | 4222   |
| Jenkins              | 6432   |
