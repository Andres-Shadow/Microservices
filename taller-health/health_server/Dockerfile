FROM python:latest

# Set the working directory
WORKDIR /app
COPY . .

# Install dependencies
RUN pip install flask
RUN pip install sqlalchemy mysqlclient

# Expose the port
EXPOSE 9002

CMD [ "python", "app.py"]