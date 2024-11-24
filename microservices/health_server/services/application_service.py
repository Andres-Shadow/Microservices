from sqlalchemy.orm import Session
from models.application import Application
from sqlalchemy.orm import sessionmaker
from database.db_config import get_engine

engine = get_engine()
Session = sessionmaker(bind=engine)

def create_new_application(application_data):
    # Crear una nueva sesión
    session = Session()
    
    # Crear una nueva instancia de Application con los datos proporcionados
    new_application = Application(
        name=application_data.name,
        endpoint=application_data.endpoint,
        frequency=application_data.frequency,
        email=application_data.email
    )
    
    # Agregar la nueva aplicación a la sesión
    session.add(new_application)
    
    # Confirmar la transacción
    session.commit()
    
    # Cerrar la sesión
    session.close()

def get_all_registered_applications():
    # Crear una nueva sesión
    session = Session()
    
    # Obtener las primeras 4 aplicaciones registradas
    applications = session.query(Application).limit(4).all()
    
    # Cerrar la sesión
    session.close()
    
    return applications
    
def get_application_by_name(name):
    # Crear una nueva sesión
    session = Session()
    
    # Obtener la aplicación por su nombre
    application = session.query(Application).filter_by(name=name).first()
    
    # Cerrar la sesión
    session.close()
    
    return application

def delete_application_by_name(name):
    # Crear una nueva sesión
    session = Session()
    
    # Obtener la aplicación por su nombre
    application = session.query(Application).filter_by(name=name).first()
    
    # Eliminar la aplicación si existe
    if application:
        session.delete(application)
        session.commit()
    
    # Cerrar la sesión
    session.close()

def update_application_by_name(name, new_data):
    # Crear una nueva sesión
    session = Session()
    
    # Obtener la aplicación por su nombre
    application = session.query(Application).filter_by(name=name).first()
    
    # Actualizar los datos de la aplicación si existe
    if application:
        application.name = new_data.name
        application.endpoint = new_data.endpoint
        application.frequency = new_data.frequency
        application.email = new_data.email
        
        session.commit()
    
    # Cerrar la sesión
    session.close()