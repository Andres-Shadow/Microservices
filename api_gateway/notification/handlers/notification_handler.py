from models.notification import Notification
from services.notification_service import get_notifications, create_notification, get_notifications_email, count_notifications
from communication.communication import create_log

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
        
    count = count_notifications()
    
    #unir las notificaciones con el total de notificaciones
    notifications_list = {
        'notifications': notifications_list,
        'count': count
    }
    
    name = "User wanted to list all notificacion"
    summary = "User listed all notifications"
    description = "User listed all notifications"
    log_type = "INFO"
    create_log(name, summary, description, log_type)
    
    
    return notifications_list

def get_notificaions_by_email_handler(page, page_size, email):
    notifications = get_notifications_email(page, page_size, email)
    
    #mapear las notificaciones a un json
    notifications_list = []
    for notification in notifications:
        notification_dict = {
            'subject': notification.subject,
            'message': notification.message,
            'target': notification.target
        }
        notifications_list.append(notification_dict)
        
    name = "User wanted to list all notificacion by email"
    summary = "User listed all notifications by email"
    description = "User listed all notifications by email"
    log_type = "INFO"
    create_log(name, summary, description, log_type)
    return notifications_list

def create_notification_handler(notification):
    
    # Sanitizar los datos (evitar inyección de scripts u otros datos maliciosos)
    new_notification = Notification()
    new_notification.subject = str(notification['subject']).strip()
    new_notification.message = str(notification['message']).strip()
    new_notification.target = str(notification['target']).strip()

    try:
        response = create_notification(new_notification)
    except Exception as e:
        name = "User wanted to create a notification"
        summary = "Error creating a notification"
        description = "Error creating a notification"
        log_type = "ERROR"
        create_log(name, summary, description, log_type)
        return str(e)
    
    name = "User wanted to create a notification"
    summary = "User sended an email to "+new_notification.target
    description = "User sended an email to "+new_notification.target+" with the subject "+new_notification.subject+" and the message "+new_notification.message
    log_type = "CREATION"
    create_log(name, summary, description, log_type)
    return response