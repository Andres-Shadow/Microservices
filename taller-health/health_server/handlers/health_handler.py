from flask import jsonify, request  # Importar clases de Flask
from models.application import Application
from services.application_service import create_new_application

def health_handler():
    data = {
        'status': 'Healthy',
        'message': 'All systems are operational'
    }

    response = jsonify(data)  # Crear respuesta JSON
    response.status_code = 200  # Código de estado HTTP

    # Establecer cabeceras personalizadas
    response.headers['X-Custom-Header'] = 'MyCustomHeaderValue'

    return response

def create_application_handler():
    # Obtener los datos JSON de la solicitud
    data = request.get_json()
    
    # # Crear una nueva aplicación
    new_application = Application()
    new_application.name = data['name']  
    new_application.endpoint = data['endpoint']
    new_application.frequency = data['frequency']
    new_application.email = data['email']
    

    # Guardar la nueva aplicación en la base de datos
    create_new_application(new_application)
    # Devolver una respuesta
    return jsonify({'message': 'Application created successfully'}), 201