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
    
    # Obtener todas las aplicaciones registradas
    applications = session.query(Application).all()
    
    # Cerrar la sesión
    session.close()
    
    return applications
    