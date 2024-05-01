FROM python:latest

# Set the working directory
WORKDIR /app
COPY . .

# Install dependencies
RUN pip install flask
RUN pip install sqlalchemy mysqlclient
RUN pip install sqlalchemy requests
RUN pip install python-dotenv


CMD [ "python", "app.py"]