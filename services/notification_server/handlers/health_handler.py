from services.health_service import *
from models.data_check import HelathCheck
def verify_server_ready():
    body = construct_ready_body()
    return body

def verify_server_live():
    body = construct_alive_body()
    return body

def verify_server_health():
    ready_report = construct_ready_body()
    alive_report = construct_alive_body()
    
    combined_report = HelathCheck(
        ready=ready_report,
        live=alive_report
    )
    return combined_report