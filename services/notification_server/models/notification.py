from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import Session, declarative_base
from database.db_config import get_engine

Base = declarative_base()


class Notification(Base):
    __tablename__ = 'notification'

    id      = Column(Integer, primary_key=True, autoincrement=True)
    target  = Column(String(100), nullable=False)
    subject = Column(String(255), nullable=False)
    message = Column(Text,        nullable=False)


def create_all_tables() -> None:
    engine = get_engine()
    Base.metadata.create_all(engine)
