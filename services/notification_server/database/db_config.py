import os
from sqlalchemy import create_engine, MetaData


def get_engine():
    host     = os.getenv("DB_HOST",     "localhost")
    port     = os.getenv("DB_PORT",     "5432")
    user     = os.getenv("DB_USER",     "notifuser")
    password = os.getenv("DB_PASSWORD", "notifpassword")
    dbname   = os.getenv("DB_NAME",     "appdb")
    schema   = os.getenv("DB_SCHEMA",   "notifications")

    url = (
        f"postgresql+psycopg2://{user}:{password}"
        f"@{host}:{port}/{dbname}"
        f"?options=-c%20search_path%3D{schema}"
    )
    return create_engine(url, pool_pre_ping=True)


meta = MetaData()
