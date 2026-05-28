FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para psycopg2-binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9092

# Gunicorn como servidor WSGI de producción
CMD ["gunicorn", "--bind", "0.0.0.0:9092", "--workers", "2", "--timeout", "60", "app:app"]
