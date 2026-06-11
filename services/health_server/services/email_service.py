import json
import logging
import os
import requests

logger = logging.getLogger(__name__)

# Per-app alert state to avoid re-sending the same alert while the service is still down.
_alert_sent: dict[str, dict[str, bool]] = {}


def _notification_url() -> str:
    host = os.getenv("NOTIFICATION_HOST", "localhost")
    port = os.getenv("NOTIFICATION_PORT", "9096")
    return f"http://{host}:{port}/api/v1/notification"


def send_email(subject: str, body: str, to_email: str) -> None:
    """Sends a notification to the notification_server via HTTP."""
    payload = {
        "subject": subject,
        "message": body,
        "target":  to_email,
    }
    try:
        response = requests.post(_notification_url(), json=payload, timeout=5)
        response.raise_for_status()
        logger.info("Notification sent to %s", to_email)
    except requests.exceptions.RequestException as exc:
        logger.error("Failed to send notification to %s: %s", to_email, exc)


def check_application_status(app_name: str, result: dict, email: str) -> None:
    """
    Checks the health result of an application and sends alert emails
    when the status transitions to DOWN. Resets the flag when the service recovers.
    """
    state = _alert_sent.setdefault(app_name, {"live": False, "ready": False})

    for check_key in ("live", "ready"):
        check = result.get(check_key)
        if check is None:
            continue

        is_down = check.get("status") == "DOWN"

        if is_down and not state[check_key]:
            subject = f"[{app_name}] Alert: {check_key.upper()} status is DOWN"
            body    = json.dumps(check, indent=4)
            send_email(subject, body, email)
            state[check_key] = True

        elif not is_down and state[check_key]:
            # Service recovered — reset flag
            state[check_key] = False
