from datetime import datetime
from database.db_config import get_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from models.data_check import CheckData, Check, HealthReport
from sqlalchemy import text
# engine = get_engine()
# Session = sessionmaker(bind=engine)


def verify_ready():
    #hacer una peticion de ping a la base de datos
    engine = get_engine()
    try:
        with engine.connect() as connection:
            print("Conexión exitosa a la base de datos")
            return True
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return False


def construct_ready_body():
    status = verify_ready()
    status_label = "READY" if status else "DOWN"
    check_status = "UP" if status else "DOWN"
    check_1 = Check(
        data=CheckData(
            from_=datetime.utcnow().isoformat(),
            status=status_label), 
        name="Database connection ready", 
        status=check_status
    )
    
    report = HealthReport(
        status=check_status,
        checks=[check_1]
    )
    return report


def verify_alive():
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    try:
        with Session() as session:
            session.execute(text("SELECT 1"))
            print("Conexión exitosa a la base de datos")
            return True
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return False
    
def construct_alive_body():
    status = verify_alive()
    status_label = "LIVE" if status else "DOWN"
    check_status = "UP" if status else "DOWN"
    check_1 = Check(
        data=CheckData(
            from_=datetime.utcnow().isoformat(),
            status=status_label), 
        name="Database connection alive", 
        status=check_status
    )
    
    report = HealthReport(
        status=check_status,
        checks=[check_1]
    )
    return report
