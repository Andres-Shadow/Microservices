# Microservices Platform

Plataforma de microservicios desarrollada en múltiples lenguajes (Go, Node.js/TypeScript, Python) con una arquitectura orientada a eventos mediante NATS y una base de datos PostgreSQL compartida con aislamiento por esquema.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         API Gateway (Fastify)                           │
│                           :9095                                         │
└──────────┬──────────┬──────────┬──────────┬──────────┬─────────────────┘
           │          │          │          │          │
     ┌─────▼─────┐ ┌─▼──────┐ ┌▼───────┐ ┌▼───────┐ ┌▼──────────────┐
     │Auth Server│ │  Logs  │ │ Health │ │Profile │ │ Notification  │
     │  (Go)    │ │Manager │ │Monitor │ │Server  │ │   Server      │
     │  :9090   │ │(TS)    │ │(Python)│ │ (Go)   │ │  (Python)     │
     │          │ │ :9091  │ │ :9092  │ │ :9094  │ │   :9096       │
     └────┬─────┘ └───┬────┘ └───┬────┘ └───┬────┘ └──────┬────────┘
          │            │          │          │              │
          └────────────┴──────────┴──────────┴──────────────┘
                              │                    │
                    ┌─────────▼─────────┐   ┌─────▼─────┐
                    │   PostgreSQL      │   │   NATS    │
                    │   (shared)        │   │  :4222    │
                    │   :5432           │   └───────────┘
                    │                   │
                    │  ┌─────────────┐  │
                    │  │ Schema: auth│  │
                    │  │ Schema: logs│  │
                    │  │ Schema: user_profile │
                    │  │ Schema: notifications│
                    │  │ Schema: health       │
                    │  └─────────────┘  │
                    └───────────────────┘
```

---

## Estructura del proyecto

```
.
├── services/                     # Microservicios
│   ├── auth_server/              # Autenticación y CRUD de usuarios (Go/Gorilla Mux)
│   ├── logs_manager_server/      # Gestión de logs recibidos via NATS (TypeScript/Express)
│   ├── user_profile_server/      # Perfiles de usuario (Go/Gin)
│   ├── gateway_server/           # API Gateway — punto de entrada único (Node.js/Fastify)
│   ├── health_server/            # Monitor de salud de servicios (Python/Flask + Gunicorn)
│   └── notification_server/      # Envío de notificaciones por email (Python/Flask + Gunicorn)
│
├── database/
│   └── shared_postgres/          # PostgreSQL compartido (schema-per-service)
│       ├── Dockerfile            # postgres:16 con init.sql
│       └── init.sql              # Crea todos los schemas y roles con permisos mínimos
│
├── tests/
│   └── gherkin/                  # Tests E2E con Cucumber.js
│       ├── features/             # Escenarios en español organizados por servicio
│       ├── step-definitions/     # Implementación de pasos en inglés
│       └── support/              # Rutas, helpers y schemas compartidos
│
├── ci/
│   └── jenkins/                  # Configuración de Jenkins CI
│
├── docs/
│   └── documentation/            # Especificaciones OpenAPI por servicio
│
├── docker-compose.yml            # Orquestación completa del stack
└── prometheus.yml                # Configuración de Prometheus (pendiente)
```

---

## Base de datos unificada

Se utiliza una **única instancia PostgreSQL** con la estrategia **schema-per-service**. Cada microservicio opera exclusivamente dentro de su propio esquema, garantizando aislamiento lógico de datos sin requerir múltiples instancias de base de datos.

| Schema           | Servicio              | Rol de DB      | Password        |
|------------------|-----------------------|----------------|-----------------|
| `auth`           | auth_server           | `devuser`      | `devpassword`   |
| `logs`           | logs_manager_server   | `logsuser`     | `logspassword`  |
| `user_profile`   | user_profile_server   | `profileuser`  | `profilepassword` |
| `notifications`  | notification_server   | `notifuser`    | `notifpassword` |
| `health`         | health_server         | `healthuser`   | `healthpassword`|

Cada rol tiene permisos restringidos únicamente a su schema (`USAGE`, `CREATE`, `SELECT/INSERT/UPDATE/DELETE`).

---

## Comunicación entre servicios

- **NATS** se usa como bus de mensajería para:
  - Propagación de logs (todos los servicios → `logs_manager_server` via subject `MicroservicesLogs`)
  - Eventos de usuario (auth_server → user_profile_server via subject `users.creation`)
- **HTTP** para comunicación síncrona entre el gateway y los servicios internos

---

## Levantar el stack

```bash
docker-compose up --build
```

Para levantar servicios individuales:

```bash
docker-compose up -d --build auth_server
```

### Variables de entorno requeridas (opcionales)

Crear un archivo `.env` en la raíz para configurar secretos:

```env
JWT_SECRET=tu_secreto_jwt_seguro
MAILGUN_API_KEY=tu_api_key_de_mailgun
MAILGUN_DOMAIN=tu_dominio_de_mailgun
```

---

## Puertos

| Servicio              | Puerto | Tecnología               |
|-----------------------|--------|--------------------------|
| auth_server           | 9090   | Go + Gorilla Mux         |
| logs_manager_server   | 9091   | TypeScript + Express     |
| health_server         | 9092   | Python + Flask/Gunicorn  |
| user_profile_server   | 9094   | Go + Gin                 |
| gateway_server        | 9095   | Node.js + Fastify        |
| notification_server   | 9096   | Python + Flask/Gunicorn  |
| PostgreSQL            | 5432   | postgres:16              |
| NATS                  | 4222   | nats:2.10-alpine         |
| NATS Monitoring       | 8222   | HTTP healthcheck         |
| Jenkins               | 6432   | jenkins/jenkins:lts      |

---

## Tests E2E

Los tests están implementados con **Cucumber.js** y organizados por servicio para permitir ejecución segmentada.

```bash
cd tests/gherkin
npm install

# Ejecutar todos los tests
npm test

# Ejecutar por servicio
npm run test:auth
npm run test:logs
npm run test:health
npm run test:notifications
npm run test:profiles
npm run test:integration

# Generar reporte HTML
npm run test:report
```

El reporte HTML se genera en `tests/gherkin/reports/cucumber_report.html`.

> **Nota:** Los tests requieren que todos los servicios estén levantados (`docker-compose up`).

---

## Endpoints principales (via Gateway)

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/auth/login` | Iniciar sesión |
| `POST` | `/api/v1/auth/register` | Registrar usuario |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/users` | Listar usuarios (paginado) |
| `GET` | `/api/v1/users/:email` | Obtener usuario por email |
| `PUT` | `/api/v1/users/:email` | Actualizar usuario |
| `DELETE` | `/api/v1/users/:email` | Eliminar usuario |
| `GET` | `/api/v1/users/password` | Recuperar contraseña |
| `PATCH` | `/api/v1/users/password` | Cambiar contraseña |

### Logs
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/logs` | Listar logs (paginado) |
| `POST` | `/api/v1/logs` | Crear log |
| `PUT` | `/api/v1/logs` | Actualizar log |
| `DELETE` | `/api/v1/logs/:id` | Eliminar log |

### Health Monitor (Apps)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/apps` | Listar apps monitoreadas |
| `POST` | `/api/v1/apps` | Registrar app |
| `PUT` | `/api/v1/apps` | Actualizar app |
| `GET` | `/api/v1/apps/:name` | Obtener app por nombre |
| `DELETE` | `/api/v1/apps/:name` | Eliminar app |

### Notificaciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/notifications` | Listar notificaciones |
| `POST` | `/api/v1/notifications` | Crear notificación |
| `GET` | `/api/v1/notifications/:email` | Filtrar por email |

### Health (por servicio)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Estado general (live + ready) |
| `GET` | `/api/v1/health/live` | Liveness check |
| `GET` | `/api/v1/health/ready` | Readiness check |

---

## Healthchecks y dependencias

El `docker-compose.yml` incluye healthchecks para los servicios de infraestructura:

- **PostgreSQL**: `pg_isready` — verifica que acepta conexiones
- **NATS**: HTTP endpoint `/healthz` — verifica que el broker está operacional

Los servicios de aplicación usan `depends_on` con `condition: service_healthy` para garantizar que la infraestructura esté lista antes de arrancar.

---

## Decisiones técnicas

- **Schema-per-service**: aislamiento lógico sin overhead de múltiples instancias de DB
- **Graceful shutdown**: todos los servicios manejan SIGINT/SIGTERM para cerrar conexiones limpiamente
- **Bcrypt**: passwords hasheados con bcrypt en auth_server (nunca en texto plano)
- **JWT**: tokens firmados con HS256, secret configurable via env var `JWT_SECRET`
- **Multi-stage builds**: imágenes Docker de producción mínimas (Alpine para Go, slim para Python, alpine para Node)
- **Gunicorn**: servidores Python usan gunicorn como WSGI server en producción
