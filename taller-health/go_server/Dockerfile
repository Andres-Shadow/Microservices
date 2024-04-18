#UTILIZAMOS LA ULTIMA IMAGEN DE GOLANG
FROM golang:latest
#ESTABLECEMOS EL DIRECTORIO DE TRABAJO
WORKDIR /app
#COPIAMOS LOS ARCHIVOS
COPY . .
#DESCARGAMOS DEPENDENCIAS
RUN  go get -u github.com/gorilla/mux
RUN  go get -u gorm.io/driver/postgres
RUN  go get -u gorm.io/gorm
RUN  go get github.com/nats-io/nats.go
RUN  go get github.com/jackc/pgx/v5/pgxpool@v5.5.5

#EJECUTAMOS EL PROYECTO
CMD ["go", "run", "main.go"]

