from sqlalchemy.orm import Session
from models.application import Application
from database.db_config import get_engine


def _get_session() -> Session:
    return Session(get_engine())


def create_new_application(application_data: Application) -> None:
    with _get_session() as session:
        new_app = Application(
            name=application_data.name,
            endpoint=application_data.endpoint,
            frequency=application_data.frequency,
            email=application_data.email,
        )
        session.add(new_app)
        session.commit()


def get_all_registered_applications(page: int = 1, page_size: int = 10) -> list:
    """Returns applications with real pagination via query params."""
    offset = (page - 1) * page_size
    with _get_session() as session:
        return (
            session.query(Application)
            .offset(offset)
            .limit(page_size)
            .all()
        )


def get_application_by_name(name: str) -> Application | None:
    with _get_session() as session:
        return session.query(Application).filter_by(name=name).first()


def delete_application_by_name(name: str) -> bool:
    with _get_session() as session:
        app = session.query(Application).filter_by(name=name).first()
        if not app:
            return False
        session.delete(app)
        session.commit()
        return True


def update_application_by_name(name: str, new_data: Application) -> bool:
    with _get_session() as session:
        app = session.query(Application).filter_by(name=name).first()
        if not app:
            return False
        app.endpoint  = new_data.endpoint
        app.frequency = new_data.frequency
        app.email     = new_data.email
        session.commit()
        return True
