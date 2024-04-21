from flask import jsonify, Response

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