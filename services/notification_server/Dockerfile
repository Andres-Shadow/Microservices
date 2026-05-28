FROM python:latest

WORKDIR /app

COPY . .

RUN pip install flask
RUN pip install sqlalchemy mysqlclient
RUN pip install sqlalchemy requests
RUN pip install python-dotenv
RUN pip install nats-py

CMD ["python", "app.py"]