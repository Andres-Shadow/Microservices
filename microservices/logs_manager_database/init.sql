-- =============================================================
-- Shared PostgreSQL instance — schema-per-service strategy
-- =============================================================
-- Este script inicializa el schema "logs" dentro de la base de
-- datos compartida "appdb" para el logs_manager_server.
-- =============================================================

-- Crear el schema del logs_manager_server
CREATE SCHEMA IF NOT EXISTS logs;

-- Crear el usuario de aplicación si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'logsuser') THEN
        CREATE ROLE logsuser WITH LOGIN PASSWORD 'logspassword';
    END IF;
END
$$;

-- Otorgar permisos restringidos al schema logs
GRANT CONNECT ON DATABASE appdb TO logsuser;
GRANT USAGE ON SCHEMA logs TO logsuser;
GRANT CREATE ON SCHEMA logs TO logsuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA logs
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO logsuser;
