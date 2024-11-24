from flask import Flask, request, jsonify  # Importar clases de Flask
from models.notification import create_all_tables
from handlers.notification_handler import get_notificaions_handler, create_notification_handler, get_notificaions_by_email_handler
from handlers.health_handler import verify_server_ready, verify_server_live, verify_server_health
from dotenv import load_dotenv

app = Flask(__name__)

@app.route('/api/v1/notification', methods=['GET', 'POST'])
def notification():
    if request.method == 'GET':
        #obtener los query params page y page size
        page = request.args.get('page')
        page_size = request.args.get('page_size')
        
        #verificar si vienen vacios los params
        if page is None:
            page = 1
        if page_size is None:
            page_size = 10
        notifications =  get_notificaions_handler(page, page_size)
        return jsonify(notifications)
    elif request.method == 'POST':
        #obtener el body de la petición
        body = request.json
        #crear una notificación
        try: 
            response = create_notification_handler(body)
            return jsonify(response), 200
        except Exception as e:
            print(e)
            return jsonify({'error': str(e)}), 400
        
    else :
        return jsonify({'error': 'Metodo no permitido'}), 405
    
@app.route('/api/v1/notification/<email>', methods=['GET'])
def filter(email):
    if request.method == 'GET':
        #obtener los query params page y page size
        page = request.args.get('page')
        page_size = request.args.get('page_size')
        
        #verificar si vienen vacios los params
        if page is None:
            page = 1
        if page_size is None:
            page_size = 10
        notifications =  get_notificaions_by_email_handler(page, page_size, email)
        return (notifications)
    else :
        return jsonify({'error': 'Metodo no permitido'}), 405
    
@app.route('/api/v1/health', methods=['GET'])
def health():
    body = verify_server_health()
    return jsonify(body.to_dict())

@app.route('/api/v1/health/ready', methods=['GET'])
def ready():
    body = verify_server_ready()
    return jsonify(body.to_dict())

@app.route('/api/v1/health/live', methods=['GET'])
def live():
    body = verify_server_live()
    return jsonify(body.to_dict())


if __name__ == '__main__':
    load_dotenv()
    create_all_tables()
    app.run(host='0.0.0.0', port=9096)