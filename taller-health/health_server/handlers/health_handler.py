from flask import jsonify, request  # Importar clases de Flask
from models.application import Application
import requests
from services.application_service import *
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
        # Obtener el nombre de la aplicación de la solicitud
        name = request.args.get('name')
        
        # Validar que el nombre de la aplicación esté presente
        if not name:
            return jsonify({'error': 'Missing application name'}), 400

        # Obtener los nuevos datos de la aplicación de la solicitud
        data = request.get_json()
        
        # Validación de datos (asegúrate de que al menos un campo esté presente)
        if not data:
            return jsonify({'error': 'No data provided for update'}), 400

        # Obtener la aplicación existente por su nombre
        application = get_application_by_name(name)
        
        # Si la aplicación no existe, devolver un error
        if not application:
            return jsonify({'error': 'Application not found'}), 404

        # Actualizar los datos de la aplicación
        if 'name' in data:
            application.name = str(data['name']).strip()
        if 'endpoint' in data:
            application.endpoint = str(data['endpoint']).strip()
        if 'frequency' in data:
            application.frequency = str(data['frequency']).strip()
        if 'email' in data:
            application.email = str(data['email']).strip()
        
        # Guardar los cambios en la base de datos
        update_application_by_name(name, application)
        
        # Devolver una respuesta
        return jsonify({'message': 'Application updated successfully'}), 200

    except IntegrityError:
        return jsonify({'error': 'Database integrity error'}), 500

    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    
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