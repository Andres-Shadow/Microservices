import logging
from sqlalchemy.orm import Session
from database.db_config import get_engine
from models.notification import Notification
from services.email_service import send_email

logger = logging.getLogger(__name__)


def _session() -> Session:
    return Session(get_engine())


def get_notifications(page: int, page_size: int) -> list:
    offset = (max(1, int(page)) - 1) * max(1, int(page_size))
    try:
        with _session() as session:
            return session.query(Notification).offset(offset).limit(int(page_size)).all()
    except Exception as exc:
        logger.error("Error fetching notifications: %s", exc)
        return []


def get_notifications_email(page: int, page_size: int, email: str) -> list:
    offset = (max(1, int(page)) - 1) * max(1, int(page_size))
    try:
        with _session() as session:
            return (
                session.query(Notification)
                .filter(Notification.target == email)
                .offset(offset)
                .limit(int(page_size))
                .all()
            )
    except Exception as exc:
        logger.error("Error fetching notifications by email: %s", exc)
        return []


def count_notifications() -> int:
    try:
        with _session() as session:
            return session.query(Notification).count()
    except Exception as exc:
        logger.error("Error counting notifications: %s", exc)
        return 0


def create_notification(notification: Notification) -> str:
    with _session() as session:
        new_notif = Notification(
            subject=notification.subject,
            message=notification.message,
            target=notification.target,
        )
        session.add(new_notif)
        session.commit()

    send_email(notification.subject, notification.message, notification.target)
    return "Notification created and email sent successfully"
