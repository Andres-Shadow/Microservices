import logging
from models.notification import Notification
from services.notification_service import (
    get_notifications,
    create_notification,
    get_notifications_email,
    count_notifications,
)

logger = logging.getLogger(__name__)


def _safe_log(name, summary, description, log_type):
    """Send log to NATS without crashing if it fails."""
    try:
        from communication.communication import create_log
        create_log(name, summary, description, log_type)
    except Exception as exc:
        logger.warning("Failed to send log to NATS: %s", exc)


def get_notifications_handler(page, page_size):
    notifications = get_notifications(page, page_size)
    count = count_notifications()

    result = {
        "notifications": [
            {"subject": n.subject, "message": n.message, "target": n.target}
            for n in notifications
        ],
        "total": count,
    }

    _safe_log(
        "NOTIFICATION-API",
        "Notifications listed",
        "All notifications listed successfully",
        "INFO",
    )
    return result


def get_notifications_by_email_handler(page, page_size, email):
    notifications = get_notifications_email(page, page_size, email)

    result = [
        {"subject": n.subject, "message": n.message, "target": n.target}
        for n in notifications
    ]

    _safe_log(
        "NOTIFICATION-API",
        "Notifications listed by email",
        f"Notifications listed for {email}",
        "INFO",
    )
    return result


def create_notification_handler(body):
    if not body:
        raise ValueError("Request body is empty")

    required = ["subject", "message", "target"]
    for field in required:
        if field not in body:
            raise ValueError(f"Missing field: {field}")

    new_notif = Notification(
        subject=str(body["subject"]).strip(),
        message=str(body["message"]).strip(),
        target=str(body["target"]).strip(),
    )

    try:
        create_notification(new_notif)
    except Exception as exc:
        logger.error("Error creating notification: %s", exc)
        _safe_log("NOTIFICATION-API", "Notification creation failed", str(exc), "ERROR")
        raise

    _safe_log(
        "NOTIFICATION-API",
        "Notification created",
        f"Notification sent to {new_notif.target} — subject: {new_notif.subject}",
        "CREATION",
    )
    return {"message": "Notification created successfully"}
