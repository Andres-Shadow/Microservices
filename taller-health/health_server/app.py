from flask import Flask, request, jsonify  # Importar clases de Flask
from models.application import create_all_tables  # Importar la función para crear tablas
from handlers.health_handler import *

app = Flask(__name__)

@app.route('/health', methods=['GET', 'POST', 'PUT', 'DELETE'])
def health():
    if request.method == 'POST':
        return create_application_handler()
    elif request.method == 'GET':
        return health_handler()
    elif request.method == 'PUT':
        return update_application_handler()
    elif request.method == 'DELETE':
        return delete_application_handler()
    
@app.route('/health/<application_name>', methods=['GET'])
def get_application_by_name(application_name):
    return get_application_by_name_handler(application_name)


# Ejecutar el servidor y crear las tablas cuando se inicie
if __name__ == '__main__':
    create_all_tables()  # Asegurarse de que las tablas estén creadas
    app.run(debug=True, port=9092)  # Ejecutar Flask en modo depuración
