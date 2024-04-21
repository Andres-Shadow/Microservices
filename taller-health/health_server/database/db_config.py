from sqlalchemy import create_engine, MetaData
import os
# Función para crear el motor
def get_engine():
    # Configura el motor de conexión
    host = os.getenv("DB_HOST", "localhost:3306")
    
    engine = create_engine("mysql://root:andres_1@"+host+"/db1")
    return engine

# Metadatos compartidos
meta = MetaData()
