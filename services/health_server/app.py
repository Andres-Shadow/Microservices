import logging
import os
import threading
import time

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request

from handlers.health_app_handler import (
    verify_server_health,
    verify_server_live,
    verify_server_ready,
)
from handlers.health_handler import (
    create_application_handler,
    delete_application_handler,
    get_application_by_name_handler,
    health_handler,
    update_application_handler,
)
from models.application import create_all_tables, create_sample_data
from services.application_service import get_all_registered_applications
from services.email_service import check_application_status

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)


# ─── Monitoring threads ───────────────────────────────────────────────────────

def _monitor_app(app_name: str, endpoint: str, frequency: int, email: str) -> None:
    """Monitoring thread for a registered application."""
    while True:
        try:
            result = requests.get(endpoint, timeout=5)
            result.raise_for_status()
            check_application_status(app_name, result.json(), email)
        except requests.exceptions.RequestException as exc:
            logger.warning("Monitor request failed for %s: %s", app_name, exc)
        time.sleep(frequency)


def start_monitoring() -> None:
    applications = get_all_registered_applications()
    if not applications:
        logger.info("No applications registered — monitoring not started.")
        return

    for app_entry in applications:
        try:
            freq = int(app_entry.frequency)
        except (ValueError, TypeError):
            freq = 30

        t = threading.Thread(
            target=_monitor_app,
            args=(app_entry.name, app_entry.endpoint, freq, app_entry.email),
            daemon=True,
        )
        t.start()
        logger.info("Monitoring started for %s (every %ds)", app_entry.name, freq)


# ─── Application CRUD routes ─────────────────────────────────────────────────

@app.route("/api/v1/apps", methods=["GET"])
def get_apps():
    return health_handler()


@app.route("/api/v1/apps", methods=["POST"])
def create_app():
    return create_application_handler()


@app.route("/api/v1/apps", methods=["PUT"])
def update_app():
    return update_application_handler()


@app.route("/api/v1/apps/<name>", methods=["GET"])
def get_app_by_name(name: str):
    return get_application_by_name_handler(name)


@app.route("/api/v1/apps/<name>", methods=["DELETE"])
def delete_app(name: str):
    return delete_application_handler(name)


# ─── Health routes ────────────────────────────────────────────────────────────

@app.route("/api/v1/health/ready", methods=["GET"])
def get_ready():
    return jsonify(verify_server_ready().to_dict())


@app.route("/api/v1/health/live", methods=["GET"])
def get_live():
    return jsonify(verify_server_live().to_dict())


@app.route("/api/v1/health", methods=["GET"])
def get_health():
    return jsonify(verify_server_health().to_dict())


# ─── Startup ──────────────────────────────────────────────────────────────────

def init_app() -> None:
    create_all_tables()
    create_sample_data()
    start_monitoring()


init_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "9092"))
    app.run(host="0.0.0.0", port=port, debug=False)
