from database.db_config import get_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from models.notification import Notification
from services.email_service import send_email

engine = get_engine()
Session = sessionmaker(bind=engine)

def get_notifications(page, page_size):
    #buscar las notificaciones en la base de datos
    notificions = []
    try:
        session = Session()
        offset = (page - 1) * page_size
        notifications = session.query(Notification).offset(offset).limit(page_size).all()
        session.close()
    except Exception as e:
        return []
    return notifications

def get_notifications_email(page, page_size, email):
    #buscar las notificaciones en la base de datos
    notificions = []
    try:
        session = Session()
        offset = (page - 1) * page_size
        notifications = session.query(Notification).filter(Notification.target == email).offset(offset).limit(page_size).all()
        session.close()
    except Exception as e:
        return []
    return notifications

def count_notifications():
    #contar las notificaciones en la base de datos
    try:
        session = Session()
        count = session.query(Notification).count()
        session.close()
    except Exception as e:
        return 0
    return count

def create_notification(notification):
    #crear una notificacion en la base de datos
    session = Session()
    
    new_notification = Notification(
        subject=notification.subject,
        message=notification.message,
        target=notification.target
    )
    try:
        session.add(new_notification)
        session.commit()
        session.close()
        send_email(notification.subject, notification.message, notification.target)
    except Exception as e:
        print(e)
        return e
    return 'Notification created successfully and email was sended'