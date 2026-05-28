# El logs_manager_server ya no necesita su propia instancia de base de datos.
# El schema "logs" se inicializa dentro de la instancia PostgreSQL compartida (auth_database).
# Este Dockerfile queda como referencia del script de migración del schema.
#
# Para aplicar el schema manualmente sobre la instancia compartida:
#   docker exec -i <postgres_container> psql -U postgres -d appdb < init.sql

FROM postgres:16

COPY ./init.sql /docker-entrypoint-initdb.d/init-logs-schema.sql
RUN chmod 644 /docker-entrypoint-initdb.d/init-logs-schema.sql
