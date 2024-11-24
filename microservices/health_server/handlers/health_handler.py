from flask import jsonify, request  # Importar clases de Flask
from models.application import Application
import requests
from services.application_service import *
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from communication.communication import create_log

def health_handler():
    applications = get_all_registered_applications()[:2]  # Obtiene las primeras 10 aplicaciones
    response = []

    if len(applications) == 0:
        return jsonify({'message': 'No applications found'})

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
    name = 'Health Check'
    summary = 'Health Check with all applications registered'
    description = 'Health Check with all applications registered in monitor database'
    log_type = 'INFO'
    create_log(name, summary, description, log_type)
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
            if not isinstance(data[field], str):
                return jsonify({'error': f'Invalid data type for field {field}. Expected string.'}), 400

        # Sanitizar los datos (evitar inyección de scripts u otros datos maliciosos)
        new_application = Application()
        new_application.name = str(data['name']).strip()
        new_application.endpoint = str(data['endpoint']).strip()
        new_application.frequency = str(data['frequency']).strip()
        new_application.email = str(data['email']).strip()

        
        # Guardar la nueva aplicación en la base de datos
        create_new_application(new_application)
        
        # Devolver una respuesta
        return jsonify({'message': 'Application created successfully'}), 200

    except IntegrityError:
        return jsonify({'error': 'Database integrity error'}), 400

    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 400

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 400

def delete_application_handler():
    try:
        # Obtener el nombre de la aplicación de la solicitud
        name = request.args.get('name')
        
        # Validar que el nombre de la aplicación esté presente
        if not name:
            return jsonify({'error': 'Missing application name'}), 400

        # Eliminar la aplicación de la base de datos
        delete_application_by_name(name)
        
        # Devolver una respuesta
        return jsonify({'message': 'Application deleted successfully'}), 200

    except IntegrityError:
        return jsonify({'error': 'Database integrity error'}), 500

    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    
def update_application_handler():
    try:
        # Obtener el cuerpo de la solicitud y verificar que es JSON
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 404
        
        # Obtener el nombre de la aplicación del cuerpo de la solicitud
        name = data.get('name')  # Usar .get() para evitar KeyError
        
        # Validar que el nombre está presente
        if not name:
            return jsonify({'error': 'Missing application name in request body'}), 404
        
        # Obtener la aplicación por el nombre
        application = get_application_by_name(name)
        
        # Si la aplicación no existe, devolver un error
        if not application:
            return jsonify({'error': f'Application with name "{name}" not found'}), 404
        
        # Actualizar los campos de la aplicación solo si están presentes
        new_Application = Application()
        new_Application.name = application.name
        if 'endpoint' in data:
            new_Application.endpoint = str(data['endpoint']).strip()
        if 'frequency' in data:
            new_Application.frequency = str(data['frequency']).strip()
        if 'email' in data:
            new_Application.email = str(data['email']).strip()

        # Guardar los cambios
        update_application_by_name(application.name, new_Application)
        
        # Devolver una respuesta de éxito
        return jsonify({'message': 'Application updated successfully'}), 200

    except IntegrityError:
        return jsonify({'error': 'Database integrity error'}), 400
    
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 400
    
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 400
    
def get_application_by_name_handler(name):
    # Obtener la aplicación por su nombre
    application = get_application_by_name(name)
    
    # Si la aplicación no existe, devolver un error
    if not application:
        return jsonify({'error': 'Application not found'}), 404
    
    # Devolver los datos de la aplicación como respuesta JSON
    return jsonify({
        'name': application.name,
        'endpoint': application.endpoint,
        'frequency': application.frequency,
        'email': application.email
    })