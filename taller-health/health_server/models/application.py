from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
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
    Session = sessionmaker(bind=engine)
    session = Session()
    Base.metadata.create_all(engine)
    
def create_sample_data():
    engine = get_engine()  # Obtener el motor de la base de datos
    Session = sessionmaker(bind=engine)
    session = Session()
    application = Application(name="App1", endpoint="http://server:9090/api/v1/health", frequency="10", email="miccroservicios@gmail.com")
    session.add(application)
    session.commit()
    session.close()