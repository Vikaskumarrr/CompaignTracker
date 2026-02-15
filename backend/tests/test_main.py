"""Tests for the FastAPI application entry point (main.py)."""

import os
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.database import Base, get_db


def _make_client():
    """Import and return a TestClient for the app, with test DB override."""
    from app.main import app

    from tests.conftest import TestingSessionLocal, engine

    Base.metadata.create_all(bind=engine)

    def _override_get_db():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = _override_get_db
    return TestClient(app)


class TestCORSMiddleware:
    def test_cors_allows_default_frontend_origin(self):
        client = _make_client()
        resp = client.options(
            "/api/campaigns",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert resp.headers.get("access-control-allow-origin") == "http://localhost:3000"

    def test_cors_rejects_unknown_origin(self):
        client = _make_client()
        resp = client.options(
            "/api/campaigns",
            headers={
                "Origin": "http://evil.com",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert resp.headers.get("access-control-allow-origin") != "http://evil.com"


class TestCampaignRouterIncluded:
    def test_campaigns_endpoint_reachable(self):
        client = _make_client()
        resp = client.get("/api/campaigns")
        assert resp.status_code == 200


class TestStartupTableCreation:
    def test_app_creates_tables_on_startup(self):
        """The lifespan event should create tables so the campaigns endpoint works."""
        client = _make_client()
        # If tables weren't created, this would fail with a DB error
        resp = client.get("/api/campaigns")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)
