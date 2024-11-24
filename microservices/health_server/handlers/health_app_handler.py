from services.health_service import *

def verify_server_ready():
    body = construct_ready_body()
    return body

def verify_server_live():
    body = construct_alive_body()
    return body

def verify_server_health():
    ready_report = construct_ready_body()
    alive_report = construct_alive_body()
    
    combined_status = "UP" if ready_report.status == "UP" and alive_report.status == "UP" else "DOWN"
    combined_checks = ready_report.checks + alive_report.checks
    
    combined_report = HealthReport(
        status=combined_status,
        checks=combined_checks
    )
    return combined_report