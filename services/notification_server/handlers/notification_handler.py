import logging
from models.notification import Notification
from services.notification_service import (
    get_notifications,
    create_notification,
    get_notifications_email,
    count_notifications,
)
from communication.communication import create_log

logger = logging.getLogger(__name__)


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

    create_log(
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

    create_log(
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
        create_log("NOTIFICATION-API", "Notification creation failed", str(exc), "ERROR")
        raise

    create_log(
        "NOTIFICATION-API",
        "Notification created",
        f"Notification sent to {new_notif.target} — subject: {new_notif.subject}",
        "CREATION",
    )
    return {"message": "Notification created successfully"}
