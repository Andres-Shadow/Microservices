import logging
import os
import requests

logger = logging.getLogger(__name__)


def send_email(subject: str, body: str, to_email: str) -> None:
    """
    Sends an email via the configured email provider (currently Mailgun).
    Requires MAILGUN_API_KEY and MAILGUN_DOMAIN env vars.
    If not configured, the email is skipped gracefully.
    """
    api_key = os.getenv("MAILGUN_API_KEY")
    domain  = os.getenv("MAILGUN_DOMAIN")

    if not api_key or not domain:
        logger.warning(
            "MAILGUN_API_KEY or MAILGUN_DOMAIN not set — email to %s skipped", to_email
        )
        return

    url = f"https://api.mailgun.net/v3/{domain}/messages"
    try:
        response = requests.post(
            url,
            auth=("api", api_key),
            data={
                "from":    f"Notification Service <notifications@{domain}>",
                "to":      [to_email],
                "subject": subject,
                "text":    body,
            },
            timeout=10,
        )
        response.raise_for_status()
        logger.info("Email sent to %s (subject: %s)", to_email, subject)
    except requests.exceptions.RequestException as exc:
        logger.error("Failed to send email to %s: %s", to_email, exc)
