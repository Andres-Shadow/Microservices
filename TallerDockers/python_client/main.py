import os
import random
import requests
import logging

# Configuración del registro de eventos
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# URL del servidor en local
#SERVER_URL = "http://192.168.1.4:80"
# URL del servidor en docker
SERVER_URL = os.getenv('SERVER_URL')

def main():

    print("la url del servidor es: ",SERVER_URL)
    # Generar usuario y clave aleatorios
    usuario = 'usuario_' + str(random.randint(1, 100))
    clave = 'clave_' + str(random.randint(1, 100))

    # Realizar la solicitud de login al servidor
    login_data = {'usuario': usuario, 'clave': clave}
    login_response = requests.post(f'{SERVER_URL}/login', json=login_data)

    try:
        # Intentar obtener el token JWT de la respuesta
        jwt_token = login_response.text
    except ValueError:
        # Manejar el caso en el que la respuesta no sea válida
        logger.error('La respuesta del servidor no es un JSON válido: %s', login_response.text)
        return

    # Verificar si el login fue exitoso
    if login_response.status_code == 200:
        # Realizar la solicitud de saludo al servidor con el token JWT
        saludo_response = requests.get(f'{SERVER_URL}/saludo?nombre={usuario}', headers={'Authorization': f'Bearer {jwt_token}'})

        # Imprimir la respuesta del servidor en el log del sistema
        logger.info('Respuesta del servidor (saludo): %s', saludo_response.text)
    else:
        logger.error('Error en el login: %s', login_response.text)

if __name__ == "__main__":
    print(SERVER_URL)
    main()
