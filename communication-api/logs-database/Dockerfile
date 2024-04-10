FROM mysql:latest

COPY ./init.sql /docker-entrypoint-initdb.d/

WORKDIR /app

EXPOSE 3306

ENV MYSQL_ROOT_PASSWORD=andres_1
ENV MYSQL_DATABASE=logs