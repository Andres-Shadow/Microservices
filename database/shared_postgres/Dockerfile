# Imagen base de PostgreSQL
FROM postgres:16

# Base de datos compartida — cada servicio usa su propio schema
ENV POSTGRES_DB=appdb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

WORKDIR /docker-entrypoint-initdb.d

# El script se ejecuta automáticamente al iniciar el contenedor
COPY ./init.sql ./init.sql
RUN chmod 644 ./init.sql
