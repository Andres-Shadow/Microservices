import os
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm import declarative_base
from database.db_config import get_engine

Base = declarative_base()


class Application(Base):
    __tablename__ = 'application'

    id       = Column(Integer, primary_key=True, autoincrement=True)
    name     = Column(String(100), nullable=False, unique=True)
    endpoint = Column(String(255), nullable=False)
    frequency = Column(String(50),  nullable=False)
    email    = Column(String(100), nullable=False)


def create_all_tables() -> None:
    engine = get_engine()
    Base.metadata.create_all(engine)


def create_sample_data() -> None:
    """Inserta datos de muestra solo si la tabla está vacía."""
    engine = get_engine()
    with Session(engine) as session:
        if session.query(Application).count() > 0:
            return

        samples = [
            Application(
                name="App1",
                endpoint="http://server:9090/api/v1/health",
                frequency="10",
                email="microservicios@gmail.com",
            ),
            Application(
                name="App2",
                endpoint="http://cliente:9091/api/v1/health",
                frequency="15",
                email="microservicios2@gmail.com",
            ),
            Application(
                name="App3",
                endpoint="http://user_profile:9094/api/v1/health",
                frequency="20",
                email="microservicios3@gmail.com",
            ),
            Application(
                name="App4",
                endpoint="http://notification_server:9096/api/v1/health",
                frequency="25",
                email="microservicios4@gmail.com",
            ),
        ]
        session.add_all(samples)
        session.commit()
