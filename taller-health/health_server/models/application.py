from sqlalchemy import Table, Column, Integer, String
from database.db_config import get_engine, meta

# Definición de la tabla 'students'
students = Table(
   'students', meta, 
   Column('id', Integer, primary_key=True),
   Column('name', String(50)),
   Column('lastname', String(50)),
)

# Función para crear todas las tablas
def create_all_tables():
    engine = get_engine()  # Obtener el motor de la base de datos
    meta.create_all(engine)  # Crear todas las tablas definidas