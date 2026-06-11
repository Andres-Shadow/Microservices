import logging
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request

from handlers.health_handler import verify_server_health, verify_server_live, verify_server_ready
from handlers.notification_handler import (
    create_notification_handler,
    get_notifications_by_email_handler,
    get_notifications_handler,
)
from models.notification import create_all_tables

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)

app = Flask(__name__)


# ─── Notification routes ──────────────────────────────────────────────────────

@app.route("/api/v1/notifications", methods=["GET"])
def list_notifications():
    page      = request.args.get("page",      1)
    page_size = request.args.get("page_size", 10)
    return jsonify(get_notifications_handler(page, page_size))


@app.route("/api/v1/notifications", methods=["POST"])
def create_notification():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Request body must be JSON"}), 400
    try:
        response = create_notification_handler(body)
        return jsonify(response), 201
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception:
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/v1/notifications/<email>", methods=["GET"])
def list_notifications_by_email(email: str):
    page      = request.args.get("page",      1)
    page_size = request.args.get("page_size", 10)
    return jsonify(get_notifications_by_email_handler(page, page_size, email))


# Backward compatibility — old route without plural
@app.route("/api/v1/notification", methods=["GET", "POST"])
def notification_compat():
    if request.method == "POST":
        return create_notification()
    return list_notifications()


@app.route("/api/v1/notification/<email>", methods=["GET"])
def notification_by_email_compat(email: str):
    return list_notifications_by_email(email)


# ─── Health routes ────────────────────────────────────────────────────────────

@app.route("/api/v1/health", methods=["GET"])
def health():
    return jsonify(verify_server_health().to_dict())


@app.route("/api/v1/health/ready", methods=["GET"])
def ready():
    return jsonify(verify_server_ready().to_dict())


@app.route("/api/v1/health/live", methods=["GET"])
def live():
    return jsonify(verify_server_live().to_dict())


# ─── Startup ──────────────────────────────────────────────────────────────────

def init_app() -> None:
    create_all_tables()


init_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "9096"))
    app.run(host="0.0.0.0", port=port, debug=False)
