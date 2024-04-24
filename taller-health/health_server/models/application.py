from sqlalchemy import Column, Integer, String
from database.db_config import get_engine, meta
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()  # Base para definir modelos

# Define tu modelo como una clase
class Application(Base):
    __tablename__ = 'application'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50))
    endpoint = Column(String(50))
    frequency = Column(String(50))
    email = Column(String(50))

# Función para crear todas las tablas
def create_all_tables():
    engine = get_engine()  # Obtener el motor de la base de datos
    meta.create_all(engine)  # Crear todas las tablas definidas