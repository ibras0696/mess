import os
import sys
from pathlib import Path
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure backend/ is on PYTHONPATH for imports
ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import create_app  # noqa: E402
from app.core.database import get_session  # noqa: E402
from app.models.base import Base  # noqa: E402
from app.core.config import settings  # noqa: E402


TEST_DB_URL = "sqlite:///./test.db"


@pytest.fixture(scope="session")
def engine():
    os.environ["DATABASE_URL"] = TEST_DB_URL
    engine = create_engine(
        TEST_DB_URL, connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def db_session(engine) -> Generator:
    connection = engine.connect()
    transaction = connection.begin()
    SessionLocal = sessionmaker(bind=connection, autocommit=False, autoflush=False)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture(autouse=True)
def disable_rate_limit(monkeypatch):
    monkeypatch.setattr("app.core.rate_limit.check_rate_limit", lambda *args, **kwargs: None)
    monkeypatch.setattr("app.services.chat_service.check_rate_limit", lambda *args, **kwargs: None)


@pytest.fixture(autouse=True)
def disable_email(monkeypatch):
    monkeypatch.setattr("app.services.chat_service.ChatService._notify_email", lambda *args, **kwargs: None)


@pytest.fixture(scope="function")
def client(db_session) -> TestClient:
    app = create_app()

    def override_session():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_session] = override_session
    return TestClient(app)
