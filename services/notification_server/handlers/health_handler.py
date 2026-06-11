from models.data_check import HealthCheck
from services.health_service import construct_ready_body, construct_alive_body


def verify_server_ready():
    return construct_ready_body()


def verify_server_live():
    return construct_alive_body()


def verify_server_health():
    return HealthCheck(
        ready=construct_ready_body(),
        live=construct_alive_body(),
    )
