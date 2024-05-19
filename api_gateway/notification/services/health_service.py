from datetime import datetime
from database.db_config import get_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from models.data_check import CheckData, Check, HealthReport
from sqlalchemy import text
from communication.communication import test_connection, send_sample_message


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
    
    #verify database ready
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
    
    #verify nats ready
    nast_status = verify_nats_ready()
    nast_status_label = "READY" if nast_status else "DOWN"
    check_status = "UP" if nast_status else "DOWN"
    check_2 = Check(
        data = CheckData(
            from_=datetime.utcnow().isoformat(),
            status=nast_status_label),
        name="NATS connection ready",
        status=check_status
        
    )
    general_status = "UP" if status and nast_status else "DOWN"
    report = HealthReport(
        status=general_status,
        checks=[check_1, check_2]
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
    #verify database alive
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
    
    #verify nats alive
    nast_status = verify_nats_alive()
    nast_status_label = "LIVE" if nast_status else "DOWN"
    check_status = "UP" if nast_status else "DOWN"
    check_2 = Check(
        data=CheckData(
            from_=datetime.utcnow().isoformat(),
            status=nast_status_label),
        name="NATS connection alive",
        status=check_status
    )
    
    genera_status = "UP" if status and nast_status else "DOWN"
    
    report = HealthReport(
        status=genera_status,
        checks=[check_1, check_2]
    )
    return report

def verify_nats_ready():
    try:
        test_connection()
        return True
    except Exception as e:
        return False
    
    
def verify_nats_alive():
    try:
        send_sample_message()
        return True
    except Exception as e:
        return False

