# Microservices Project — Improvements Plan

Lista priorizada de mejoras por microservicio, ordenadas de más simple (⚡) a más compleja (🧠).

---

## Auth Server (`auth_server` — Go/Gorilla Mux)

| # | Mejora | Archivo(s) | Esfuerzo |
|---|--------|------------|----------|
| 1 | Mover JWT secret `"contraseña_super_secreta_100%_real_no_fake"` a variable de entorno `JWT_SECRET` | `security/Security.go:22,36` | ⚡ 5 min |
| 2 | Eliminar `Id int` redundante del modelo `User` — `gorm.Model` ya provee `ID` | `models/User.go:7` | ⚡ 5 min |
| 3 | Eliminar `http.Error` duplicado en `UpdateUserHandler` (líneas 106 y 111 escriben dos respuestas) | `handlers/UserHandler.go:106,111` | ⚡ 5 min |
| 4 | Unificar modelos de health check duplicados (`response.go`, `GeneralCheck.go`, `AliveCheck.go`) en un solo archivo | `models/` | ⏱ 15 min |
| 5 | Extraer patrón repetido de `SendLogToNats` (15+ ocurrencias) a función helper en handlers | `handlers/UserHandler.go`, `handlers/LoginHandler.go` | ⏱ 20 min |
| 6 | Corregir doble inicialización de NATS: el `init()` + `sync.Once` ejecutan `ConnectToNATS` dos veces | `communication/communication.go:43-45` | ⏱ 30 min |
| 7 | Agregar graceful shutdown: reemplazar `http.ListenAndServe` por `http.Server` + `signal.Notify` + `Shutdown` | `main.go:37` | ⏱ 30 min |
| 8 | **Implementar bcrypt** para hashear contraseñas (actualmente en texto plano en DB) | `models/User.go`, `utilities/UserService.go`, `handlers/LoginHandler.go` | 🧠 1-2 h |
| 9 | Tests unitarios con `testing` package + `testcontainers-go` para PostgreSQL | `utilities/`, `handlers/`, `security/` | 🧠 4-6 h |
| 10 | Rate limiting con `golang.org/x/time/rate` + validación de formato de email | `main.go` + middleware nuevo | 🧠 2-3 h |

---

## User Profile Server (`user_profile_server` — Go/Gin)

| # | Mejora | Archivo(s) | Esfuerzo |
|---|--------|------------|----------|
| 1 | Separar campos opcionales (`Biography`, `Organization`, `Social_Media`) de obligatorios en validación | `handlers/userhandler.go:73` | ⚡ 10 min |
| 2 | Extraer creación repetida del struct `models.Message` (~15 veces) a función `sendLog()` | `handlers/userhandler.go` | ⏱ 15 min |
| 3 | Eliminar `ID int` redundante del modelo (`gorm.Model` ya lo incluye) | `models/user.go:8` | ⚡ 5 min |
| 4 | Singleton NATS: inyectar conexión desde `main()` en vez de llamar `ConnectToNATS()` por request | `communication/`, `main.go`, `handlers/` | ⏱ 30 min |
| 5 | Buffer local de logs con reintento cuando NATS está caído | `communication/messageSending.go` | 🧠 2 h |
| 6 | API key interna entre gateway y profile server para autenticación mínima | `main.go`, `middleware/` | 🧠 2 h |
| 7 | Tests unitarios con `testing` + `testcontainers-go` para MySQL | `services/`, `handlers/` | 🧠 4-6 h |

---

## Gateway Server (`gateway_server` — Node.js/Fastify)

| # | Mejora | Archivo(s) | Esfuerzo |
|---|--------|------------|----------|
| 1 | Mover dependencias de `devDependencies` a `dependencies` en `package.json` | `package.json` | ⚡ 5 min |
| 2 | Eliminar dependencias no usadas: `node-fetch` y `jsonwebtoken` (solo se usa `axios` + `nats`) | `package.json` | ⚡ 5 min |
| 3 | Unificar rutas duplicadas: `POST /api/v1/user/register` y `POST /api/v1/user` hacen lo mismo | `src/routes/appRoutes.js:13,20` | ⚡ 10 min |
| 4 | Corregir bug de scope: `fullResponse` referenciado fuera del `try` en `getUserInfo` | `src/handlers/mainHandler.js:151` | ⏱ 15 min |
| 5 | Configurar script `"test"` en `package.json` e instalar `vitest` | `package.json` | ⏱ 30 min |
| 6 | **CRÍTICO**: Reemplazar `atob(token.split(".")[1])` por `jsonwebtoken.verify()` con secret compartido del auth server (actualmente base64-decodea sin verificar firma) | `src/handlers/mainHandler.js:262` | 🧠 1 h |
| 7 | Middleware global de errores en Fastify para eliminar try/catch en cada handler | `src/routes/routes.js` + handler nuevo | 🧠 2 h |
| 8 | Circuit breaker con `opossum` + `axios-retry` para resiliencia ante fallo de servicios internos | `src/handlers/` + `src/services/` | 🧠 3 h |
| 9 | Tests de integración: mockear servicios internos con `nock` y probar rutas con `fastify.inject()` | `tests/` (nuevo) | 🧠 4-6 h |

---

## Logs Manager Server (`logs_manager_server` — TypeScript/Express)

| # | Mejora | Archivo(s) | Esfuerzo |
|---|--------|------------|----------|
| 1 | Agregar `@types/node` a `devDependencies` | `package.json` | ⚡ 2 min |
| 2 | Eliminar imports no usados (`cors`, `morgan`) si no tienen configuraciones específicas | `src/index.ts:2-3` | ⚡ 5 min |
| 3 | Corregir conflicto de rutas: `:email` y `:application` en el mismo path prefix | `src/app/routes/project-routes.ts:15-16` | ⏱ 20 min |
| 4 | Externar completamente la configuración (puerto, NATS host, DB host) a variables de entorno | `src/index.ts` | ⏱ 20 min |
| 5 | Conectar handlers de health check con el registry de Prometheus (métricas creadas pero no actualizadas en `/health`) | `src/index.ts`, `src/app/handlers/health-handler.ts` | ⏱ 30 min |
| 6 | Reemplazar `DataLog.sync()` por migraciones con Sequelize CLI o `umzug` | `src/index.ts`, `src/app/database/` | 🧠 2 h |
| 7 | Validación de schemas con `zod` en vez de validación manual campo por campo | `src/app/handlers/logs-handler.ts` | 🧠 2-3 h |
| 8 | Tests con `vitest` + `supertest` para rutas + mock de Sequelize | `tests/` (nuevo) | 🧠 4-6 h |

---

## Health Server (`health_server` — Python/Flask)

| # | Mejora | Archivo(s) | Esfuerzo |
|---|--------|------------|----------|
| 1 | Convertir `dependencias.txt` a `requirements.txt` con versiones fijas | `dependencias.txt` | ⚡ 5 min |
| 2 | Eliminar magic number `[:2]` y usar paginación real vía query params | `handlers/health_handler.py:9` | ⏱ 15 min |
| 3 | Mover `http://localhost:9096` hardcodeado a variable de entorno `NOTIFICATION_HOST` | `services/email_service.py:36` | ⏱ 15 min |
| 4 | Reemplazar `app.run()` por servidor WSGI (`gunicorn`) para producción | `app.py:81`, `Dockerfile` | ⏱ 20 min |
| 5 | Agregar verificación de conexión NATS al health endpoint | `services/health_service.py` | ⏱ 30 min |
| 6 | Reemplazar dict global `estado_correo` por estado persistido en DB o Redis | `services/email_service.py:6-9` | 🧠 2 h |
| 7 | Hilos de monitoreo dinámicos: al agregar app vía API, iniciar monitoreo sin reiniciar | `app.py:27-40` | 🧠 3-4 h |
| 8 | Tests con `pytest` + `responses` (mock HTTP) + SQLite en memoria | `tests/` (nuevo) | 🧠 4-6 h |

---

## Notification Server (`notification_server` — Python/Flask)

| # | Mejora | Archivo(s) | Esfuerzo |
|---|--------|------------|----------|
| 1 | Agregar `jsonify()` faltante en `return (notifications)` del endpoint `/<email>` | `app.py:49-50` | ⚡ 2 min |
| 2 | Extraer lógica duplicada de paginación (page/page_size defaults) a una función helper | `app.py` | ⚡ 10 min |
| 3 | Validar formato de email con `email-validator` antes de enviar | `handlers/notification_handler.py` | ⏱ 15 min |
| 4 | Capturar errores de Mailgun API con try/except + logging | `services/email_service.py:10-18` | ⏱ 20 min |
| 5 | Cola de reintento para emails fallidos (ej. con `redis` + `rq`) | `services/notification_service.py` | 🧠 2-3 h |
| 6 | Reemplazar `app.run()` por `gunicorn` | `app.py:73`, `Dockerfile` | ⏱ 20 min |
| 7 | Tests con `pytest` + mock de `requests.post` a Mailgun | `tests/` (nuevo) | 🧠 3-4 h |

---

## Docker Compose

| # | Mejora | Archivo(s) | Esfuerzo |
|---|--------|------------|----------|
| 1 | Eliminar `version: "2.8"` obsoleto | `Docker-Compose.yml:1` | ⚡ 1 min |
| 2 | Agregar volúmenes nombrados para todas las DBs (datos persistentes entre reinicios) | `Docker-Compose.yml` | ⏱ 15 min |
| 3 | Mover passwords a archivo `.env` en vez de hardcodear `andres_1` | `Docker-Compose.yml` + `.env` (nuevo) | ⏱ 20 min |
| 4 | Agregar `healthcheck` a cada servicio para `depends_on` condicional real | `Docker-Compose.yml` | 🧠 1-2 h |
| 5 | Descomentar Prometheus + agregar servicio Grafana con dashboards | `Docker-Compose.yml`, `prometheus.yml` | 🧠 2-3 h |
| 6 | Separar redes Docker: `backend` (servicios internos), `database` (DBs), `monitoring` | `Docker-Compose.yml` | 🧠 2 h |

---

## Tests (Gherkin/Cucumber.js)

| # | Mejora | Archivo(s) | Esfuerzo |
|---|--------|------------|----------|
| 1 | Configurar script `"test"` en `package.json`: `"cucumber-js features/"` | `gherkin_tests/package.json` | ⚡ 2 min |
| 2 | Agregar reportería JUnit XML (para integración con Jenkins/CI) además del HTML actual | `gherkin_tests/index.js`, `cucumber.js` | ⏱ 20 min |
| 3 | Tests unitarios **por servicio individual** (Go `testing`, vitest, pytest según corresponda) | Cada microservicio | 🧠 4-6 h c/u |
| 4 | Contract testing con **Pact** entre gateway ↔ cada microservicio interno | `pact-tests/` (nuevo) | 🧠 4-6 h |
| 5 | Load testing con **k6** para escenarios críticos (login, CRUD users, logs query) | `load-tests/` (nuevo) | 🧠 3-4 h |
| 6 | `Jenkinsfile` declarativo: lint → unit tests → integration → E2E → deploy | `jenkins_configuration/Jenkinsfile` (nuevo) | 🧠 4-6 h |
| 7 | Usar **testcontainers-node** para entornos aislados en tests E2E sin depender de `docker-compose up` manual | `gherkin_tests/` | 🧠 6-8 h |

---

**Leyenda de esfuerzo:**
- ⚡ = < 10 minutos (cambio puntual, una línea o archivo)
- ⏱ = 10-60 minutos (refactor menor)
- 🧠 = 1-8 horas (cambio arquitectónico o suite de tests completa)
