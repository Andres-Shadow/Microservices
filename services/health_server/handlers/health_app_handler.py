from models.data_check import HealthReport
from services.health_service import construct_ready_body, construct_alive_body


def verify_server_ready() -> HealthReport:
    return construct_ready_body()


def verify_server_live() -> HealthReport:
    return construct_alive_body()


def verify_server_health() -> HealthReport:
    ready = construct_ready_body()
    alive = construct_alive_body()

    combined_status = "UP" if ready.status == "UP" and alive.status == "UP" else "DOWN"
    return HealthReport(
        status=combined_status,
        checks=alive.checks + ready.checks,
    )
