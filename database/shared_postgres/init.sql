-- =============================================================
-- Shared PostgreSQL instance — schema-per-service strategy
-- =============================================================
-- Este script inicializa la base de datos compartida "appdb"
-- y crea un schema aislado por cada microservicio.
-- La DB es creada automáticamente por POSTGRES_DB=appdb en el Dockerfile.
-- =============================================================

-- -----------------------------------------------
-- Schema: auth  (auth_server)
-- -----------------------------------------------
CREATE SCHEMA IF NOT EXISTS auth;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'devuser') THEN
        CREATE ROLE devuser WITH LOGIN PASSWORD 'devpassword';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE appdb TO devuser;
GRANT USAGE ON SCHEMA auth TO devuser;
GRANT CREATE ON SCHEMA auth TO devuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO devuser;

-- -----------------------------------------------
-- Schema: logs  (logs_manager_server)
-- -----------------------------------------------
CREATE SCHEMA IF NOT EXISTS logs;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'logsuser') THEN
        CREATE ROLE logsuser WITH LOGIN PASSWORD 'logspassword';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE appdb TO logsuser;
GRANT USAGE ON SCHEMA logs TO logsuser;
GRANT CREATE ON SCHEMA logs TO logsuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA logs
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO logsuser;

-- -----------------------------------------------
-- Schema: user_profile  (user_profile_server)
-- -----------------------------------------------
CREATE SCHEMA IF NOT EXISTS user_profile;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'profileuser') THEN
        CREATE ROLE profileuser WITH LOGIN PASSWORD 'profilepassword';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE appdb TO profileuser;
GRANT USAGE ON SCHEMA user_profile TO profileuser;
GRANT CREATE ON SCHEMA user_profile TO profileuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA user_profile
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO profileuser;

-- -----------------------------------------------
-- Schema: health  (health_server)
-- -----------------------------------------------
CREATE SCHEMA IF NOT EXISTS health;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'healthuser') THEN
        CREATE ROLE healthuser WITH LOGIN PASSWORD 'healthpassword';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE appdb TO healthuser;
GRANT USAGE ON SCHEMA health TO healthuser;
GRANT CREATE ON SCHEMA health TO healthuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA health
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO healthuser;
