import asyncio
import logging
from datetime import datetime, timezone

from database.db_config import get_engine
from models.data_check import Check, CheckData, HealthReport
from communication.communication import test_connection, send_sample_message

logger = logging.getLogger(__name__)


def _run_async(coro):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(asyncio.run, coro).result()
        return loop.run_until_complete(coro)
    except Exception:
        return asyncio.run(coro)


def _build_check(name: str, is_up: bool, ready_label: str = "READY") -> Check:
    return Check(
        data=CheckData(
            from_=datetime.now(timezone.utc).isoformat(),
            status=ready_label if is_up else "DOWN",
        ),
        name=name,
        status="UP" if is_up else "DOWN",
    )


def _build_report(checks: list) -> HealthReport:
    overall = "UP" if all(c.status == "UP" for c in checks) else "DOWN"
    return HealthReport(status=overall, checks=checks)


def verify_ready() -> bool:
    try:
        with get_engine().connect():
            return True
    except Exception as exc:
        logger.warning("DB readiness check failed: %s", exc)
        return False


def verify_alive() -> bool:
    try:
        from sqlalchemy import text
        with get_engine().connect() as conn:
            conn.execute(text("SELECT 1"))
            return True
    except Exception as exc:
        logger.warning("DB liveness check failed: %s", exc)
        return False


def verify_nats_ready() -> bool:
    try:
        return _run_async(test_connection())
    except Exception:
        return False


def verify_nats_alive() -> bool:
    try:
        return _run_async(send_sample_message())
    except Exception:
        return False


def construct_ready_body() -> HealthReport:
    return _build_report([
        _build_check("Notification Service — Database readiness check", verify_ready()),
        _build_check("Notification Service — NATS readiness check",     verify_nats_ready()),
    ])


def construct_alive_body() -> HealthReport:
    return _build_report([
        _build_check("Notification Service — Database liveness check", verify_alive(),      "LIVE"),
        _build_check("Notification Service — NATS liveness check",     verify_nats_alive(), "LIVE"),
    ])
