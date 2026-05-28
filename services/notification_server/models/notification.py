from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
from database.db_config import get_engine, meta
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()  # Base para definir modelos

# Define tu modelo como una clase
class Notification(Base):
    __tablename__ = 'notification'
    id = Column(Integer, primary_key=True, autoincrement=True)
    target = Column(String(50))
    subject = Column(String(50))
    message = Column(String(50))
    

# Función para crear todas las tablas
def create_all_tables():
    engine = get_engine()  # Obtener el motor de la base de datos
    Session = sessionmaker(bind=engine)
    session = Session()
    Base.metadata.create_all(engine)