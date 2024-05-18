from flask import jsonify
from services.notification_service import get_notifications, create_notification
from models.notification import Notification


def get_notificaions_handler(page, page_size):
    notifications = get_notifications(page, page_size)
    
    #mapear las notificaciones a un json
    notifications_list = []
    for notification in notifications:
        notification_dict = {
            'subject': notification.subject,
            'message': notification.message,
            'target': notification.target
        }
        notifications_list.append(notification_dict)
    return notifications_list

def create_notification_handler(notification):
    
    # Sanitizar los datos (evitar inyección de scripts u otros datos maliciosos)
    new_notification = Notification()
    new_notification.subject = str(notification['subject']).strip()
    new_notification.message = str(notification['message']).strip()
    new_notification.target = str(notification['target']).strip()

    response = create_notification(new_notification)
    return response