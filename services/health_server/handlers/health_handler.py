import logging
import requests
from flask import jsonify, request
from models.application import Application
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from services.application_service import (
    create_new_application,
    get_all_registered_applications,
    get_application_by_name,
    delete_application_by_name,
    update_application_by_name,
)
from communication.communication import create_log

logger = logging.getLogger(__name__)


def health_handler():
    """
    Ejecuta el health check sobre las aplicaciones registradas.
    Soporta paginación via ?page=&page_size= (elimina el magic number [:2]).
    """
    try:
        page      = int(request.args.get("page",      1))
        page_size = int(request.args.get("page_size", 10))
    except ValueError:
        return jsonify({"error": "page and page_size must be integers"}), 400

    applications = get_all_registered_applications(page=page, page_size=page_size)

    if not applications:
        return jsonify({"message": "No applications found"}), 200

    response = []
    for app in applications:
        try:
            result = requests.get(app.endpoint, timeout=5)
            result.raise_for_status()
            response.append({"name": app.name, "response": result.json()})
        except requests.exceptions.RequestException as exc:
            logger.warning("Health check failed for %s: %s", app.name, exc)
            response.append({"name": app.name, "error": str(exc)})

    create_log(
        name="Health Check",
        summary="Health check executed",
        description=f"Health check ran for {len(applications)} application(s)",
        log_type="INFO",
    )
    return jsonify(response), 200


def create_application_handler():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required = ["name", "endpoint", "frequency", "email"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
        if not isinstance(data[field], str):
            return jsonify({"error": f"Field '{field}' must be a string"}), 400

    new_app = Application(
        name=data["name"].strip(),
        endpoint=data["endpoint"].strip(),
        frequency=data["frequency"].strip(),
        email=data["email"].strip(),
    )

    try:
        create_new_application(new_app)
        return jsonify({"message": "Application created successfully"}), 201
    except IntegrityError:
        return jsonify({"error": "An application with that name already exists"}), 409
    except SQLAlchemyError as exc:
        logger.error("DB error creating application: %s", exc)
        return jsonify({"error": "Database error"}), 500


def delete_application_handler():
    name = request.args.get("name")
    if not name:
        return jsonify({"error": "Missing query param: name"}), 400

    try:
        deleted = delete_application_by_name(name)
        if not deleted:
            return jsonify({"error": f"Application '{name}' not found"}), 404
        return jsonify({"message": "Application deleted successfully"}), 200
    except SQLAlchemyError as exc:
        logger.error("DB error deleting application: %s", exc)
        return jsonify({"error": "Database error"}), 500


def update_application_handler():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    name = data.get("name")
    if not name:
        return jsonify({"error": "Missing field: name"}), 400

    application = get_application_by_name(name)
    if not application:
        return jsonify({"error": f"Application '{name}' not found"}), 404

    updated = Application(
        name=application.name,
        endpoint=data.get("endpoint", application.endpoint).strip(),
        frequency=data.get("frequency", application.frequency).strip(),
        email=data.get("email", application.email).strip(),
    )

    try:
        update_application_by_name(application.name, updated)
        return jsonify({"message": "Application updated successfully"}), 200
    except SQLAlchemyError as exc:
        logger.error("DB error updating application: %s", exc)
        return jsonify({"error": "Database error"}), 500


def get_application_by_name_handler(name: str):
    application = get_application_by_name(name)
    if not application:
        return jsonify({"error": "Application not found"}), 404

    return jsonify({
        "name":      application.name,
        "endpoint":  application.endpoint,
        "frequency": application.frequency,
        "email":     application.email,
    }), 200
