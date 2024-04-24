import requests
import json
import json
import os

def send_email(subject, body, to_email):
    api_key = os.getenv("API_KEY")
    domain = os.getenv("DOMAIN")
    
    

    request_url = f"https://api.mailgun.net/v3/{domain}/messages"
    
    response = requests.post(
        request_url,
        auth=("api", api_key),
        data={
            "from": "Servicio de Monitorización <monitor@tu-dominio.com>",
            "to": [to_email],
            "subject": subject,
            "text": body,
        },
    )
    
    if response.status_code != 200:
        print(f"Error al enviar correo: {response.text}")
    else:
        print("Correo enviado correctamente")
    return response.status_code


def revisar_aplicaciones(result, email):

    if "live" in result and result["live"]["status"] == "DOWN":
        subject = "Alerta: Estado LIVE en DOWN"
        body = json.dumps(result["live"], indent=4)
        send_email(subject, body, email)
    
    if "ready" in result and result["ready"]["status"] == "DOWN":
        subject = "Alerta: Estado READY en DOWN"
        body = json.dumps(result["ready"], indent=4)
        send_email(subject, body, email)
    
    return 0
