from flask import Flask, request, jsonify  # Importar clases de Flask
from models.application import create_all_tables  # Importar la función para crear tablas
from handlers.health_handler import create_application_handler

app = Flask(__name__)

@app.route('/health', methods=['POST'])
def health():
    return create_application_handler()

# Ejecutar el servidor y crear las tablas cuando se inicie
if __name__ == '__main__':
    create_all_tables()  # Asegurarse de que las tablas estén creadas
    app.run(debug=True, port=9092)  # Ejecutar Flask en modo depuración
