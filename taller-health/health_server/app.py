from flask import Flask, request, jsonify  # Importar clases de Flask
from models.application import create_all_tables  # Importar la función para crear tablas
from handlers.health_handler import *
from services.email_service import revisar_aplicaciones
import threading
import time
import requests
from dotenv import load_dotenv

app = Flask(__name__)

# Función que realiza peticiones periódicas a un endpoint
def periodic_request(app_name, endpoint, frequency, app_email):
    
    while True:
        try:
            result = requests.get(endpoint)  # Hace una solicitud GET
            result.raise_for_status()  # Comprueba si la solicitud fue exitosa
            revisar_aplicaciones(result.json(), app_email)
        except requests.exceptions.RequestException as e:
            
            print(f"Error haciendo request a {app_name}")
        
        time.sleep(int(frequency))  # Espera antes de la siguiente solicitud

# Ruta para iniciar las tareas periódicas para todas las aplicaciones
def start_monitoring():
    print("Starting monitoring...")
    applications = get_all_registered_applications()  # Necesitas esta función
    # Inicia un hilo para cada aplicación con su frecuencia
    for app in applications:
        thread = threading.Thread(
            target=periodic_request,
            args=(app.name, app.endpoint, app.frequency, app.email)
        )
        thread.daemon = True  # Hace que el hilo se cierre cuando la aplicación se detenga
        thread.start()  # Inicia el hilo

# Ruta para el manejo de solicitudes generales
@app.route('/api/v1/health', methods=['GET', 'POST', 'PUT', 'DELETE'])
def health():
    if request.method == 'POST':
        return create_application_handler()
    elif request.method == 'GET':
        return health_handler()
    elif request.method == 'PUT':
        return update_application_handler()
    elif request.method == 'DELETE':
        return delete_application_handler()

# Ruta para obtener una aplicación por nombre
@app.route('/api/v1/health/<application_name>', methods=['GET'])
def get_application_by_name(application_name):
    return get_application_by_name_handler(application_name)

# Ejecutar el servidor y crear las tablas cuando se inicie
if __name__ == '__main__':
    create_all_tables()  # Asegurarse de que las tablas estén creadas
    start_monitoring()
    load_dotenv()
    app.run(debug=True, port=9092)  # Ejecutar Flask en modo depuración