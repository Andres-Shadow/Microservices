import requests
import json
import json
import os

estado_correo = {
    "live": False,
    "ready": False,
}
# Función para enviar correos
def send_email(subject, body, to_email):
    # api_key = os.getenv("API_KEY")
    # domain = os.getenv("DOMAIN")

    # request_url = f"https://api.mailgun.net/v3/{domain}/messages"

    # requests.post(
    #     request_url,
    #     auth=("api", api_key),
    #     data={
    #         "from": "Servicio de Monitorización <monitor@tu-dominio.com>",
    #         "to": [to_email],
    #         "subject": subject,
    #         "text": body,
    #     },
    # )
    
    #crear un objeto json con el contenido del correo
    email = {
        'subject': subject,
        'message': body,
        'target': to_email
    }
    
    #hacer una peticion post al servicio de notificaciones
    response = requests.post('http://localhost:9096/api/v1/notification', json=email)



# Función para revisar los resultados y enviar correos si es necesario
def revisar_aplicaciones(result, email):
    # Uso de la variable global importada
    if "live" in result and result["live"]["status"] == "DOWN" and not estado_correo["live"]:
        subject = "Alerta: Estado LIVE en DOWN"
        body = json.dumps(result["live"], indent=4)
        print("Sending email")
        send_email(subject, body, email)
        estado_correo["live"] = True  # Marcar como enviado

    if "ready" in result and result["ready"]["status"] == "DOWN" and not estado_correo["ready"]:
        subject = "Alerta: Estado READY en DOWN"
        body = json.dumps(result["ready"], indent=4)
        print("Sending email")
        send_email(subject, body, email)
        estado_correo["ready"] = True  # Marcar como enviado

    # Restablecer el estado si se recupera
    if "live" in result and result["live"]["status"] != "DOWN":
        estado_correo["live"] = False

    if "ready" in result and result["ready"]["status"] != "DOWN":
        estado_correo["ready"] = False

    return 0