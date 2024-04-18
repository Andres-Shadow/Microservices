FROM mysql:latest

# Copia el archivo de configuración personalizado
COPY ./my.cnf /etc/mysql/my.cnf

# Copia el script de inicialización de la base de datos
COPY ./init.sql /docker-entrypoint-initdb.d/

# Establece el directorio de trabajo
WORKDIR /app

# Expone el puerto MySQL
EXPOSE 3306

# Establece las variables de entorno
ENV MYSQL_ROOT_PASSWORD=andres_1
ENV MYSQL_DATABASE=logs
