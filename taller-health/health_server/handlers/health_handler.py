from flask import jsonify, request  # Importar clases de Flask
from models.application import Application
import requests
from services.application_service import create_new_application, get_all_registered_applications
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

def health_handler():
    applications = get_all_registered_applications()  # Obtiene todas las aplicaciones
    response = []

    for app in applications:
        # Realiza una solicitud GET al endpoint de cada aplicación
        try:
            result = requests.get(app.endpoint)  # Hace una solicitud GET
            result.raise_for_status()  # Comprueba si la solicitud fue exitosa (status 2xx)
            # Agrega el nombre de la aplicación y la respuesta JSON a la lista de respuestas
            response.append({
                'name': app.name,
                'response': result.json()  # Convierte el contenido de la respuesta a JSON
            })
        except requests.exceptions.RequestException as e:
            # Si hay un error en la solicitud, agrega la información del error
            response.append({
                'name': app.name,
                'error': str(e)
            })

    # Devuelve la lista de resultados como respuesta JSON
    return jsonify(response)

def create_application_handler():
    try:
        # Obtener los datos JSON de la solicitud
        data = request.get_json()
        
        # Validación de datos (asegúrate de que todos los campos requeridos están presentes)
        required_fields = ['name', 'endpoint', 'frequency', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Sanitizar los datos (evitar inyección de scripts u otros datos maliciosos)
        new_application = Application()
        new_application.name = str(data['name']).strip()
        new_application.endpoint = str(data['endpoint']).strip()
        new_application.frequency = str(data['frequency']).strip()
        new_application.email = str(data['email']).strip()

        
        # Guardar la nueva aplicación en la base de datos
        create_new_application(new_application)
        
        # Devolver una respuesta
        return jsonify({'message': 'Application created successfully'}), 201

    except IntegrityError:
        return jsonify({'error': 'Database integrity error'}), 500

    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500