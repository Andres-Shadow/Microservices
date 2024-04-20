from flask import Flask

app = Flask(__name__)


@app.route('/health')
def health():
    return 'Healthy!'

if __name__ == '__main__':
    app.run(debug=True, port = 9092)