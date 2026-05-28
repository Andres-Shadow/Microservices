import asyncio
import logging
from datetime import datetime, timezone

from database.db_config import get_engine
from models.data_check import Check, CheckData, HealthReport
from communication.communication import test_connection, send_sample_message

logger = logging.getLogger(__name__)


# ─── helpers ──────────────────────────────────────────────────────────────────

def _build_check(name: str, is_up: bool, ready_label: str = "READY") -> Check:
    status_label = ready_label if is_up else "DOWN"
    return Check(
        data=CheckData(
            from_=datetime.now(timezone.utc).isoformat(),
            status=status_label,
        ),
        name=name,
        status="UP" if is_up else "DOWN",
    )


def _build_report(checks: list[Check]) -> HealthReport:
    overall = "UP" if all(c.status == "UP" for c in checks) else "DOWN"
    return HealthReport(status=overall, checks=checks)


def _run_async(coro):
    """Ejecuta una coroutine desde código síncrono de forma segura."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                future = pool.submit(asyncio.run, coro)
                return future.result()
        return loop.run_until_complete(coro)
    except Exception:
        return asyncio.run(coro)


# ─── database checks ──────────────────────────────────────────────────────────

def verify_alive() -> bool:
    """Verifica que la conexión a la DB esté activa (liveness)."""
    try:
        engine = get_engine()
        with engine.connect():
            return True
    except Exception as exc:
        logger.warning("DB liveness check failed: %s", exc)
        return False


def verify_ready() -> bool:
    """Verifica que la DB esté lista para recibir queries (readiness)."""
    try:
        from sqlalchemy import text
        engine = get_engine()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            return True
    except Exception as exc:
        logger.warning("DB readiness check failed: %s", exc)
        return False


# ─── NATS checks ──────────────────────────────────────────────────────────────

def verify_nats_alive() -> bool:
    try:
        return _run_async(test_connection())
    except Exception as exc:
        logger.warning("NATS liveness check failed: %s", exc)
        return False


def verify_nats_ready() -> bool:
    try:
        return _run_async(send_sample_message())
    except Exception as exc:
        logger.warning("NATS readiness check failed: %s", exc)
        return False


# ─── report builders ──────────────────────────────────────────────────────────

def construct_alive_body() -> HealthReport:
    return _build_report([
        _build_check("Health Server — Database liveness check",  verify_alive(),      "LIVE"),
        _build_check("Health Server — NATS liveness check",      verify_nats_alive(), "LIVE"),
    ])


def construct_ready_body() -> HealthReport:
    return _build_report([
        _build_check("Health Server — Database readiness check", verify_ready(),      "READY"),
        _build_check("Health Server — NATS readiness check",     verify_nats_ready(), "READY"),
    ])
