import os
import requests

def send_email(subject, body, to_email):
    api_key = os.getenv("API_KEY")
    domain = os.getenv("DOMAIN")

    request_url = f"https://api.mailgun.net/v3/{domain}/messages"

    requests.post(
        request_url,
        auth=("api", api_key),
        data={
            "from": "Servicio de Monitorización <monitor@tu-dominio.com>",
            "to": [to_email],
            "subject": subject,
            "text": body,
        },
    )
