"""Tests for the news router endpoint."""

import pytest
from unittest.mock import patch, AsyncMock

import httpx
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routers.news import router as news_router
from app.schemas.news import NewsArticle


SAMPLE_API_RESPONSE = {
    "status": "ok",
    "totalResults": 2,
    "articles": [
        {
            "source": {"id": "bbc", "name": "BBC News"},
            "title": "Test Article 1",
            "description": "Description 1",
            "url": "https://example.com/1",
            "publishedAt": "2024-01-15T10:00:00Z",
        },
        {
            "source": {"id": None, "name": "TechCrunch"},
            "title": "Test Article 2",
            "description": None,
            "url": "https://example.com/2",
            "publishedAt": "2024-01-14T08:00:00Z",
        },
    ],
}


def _make_app():
    app = FastAPI()
    app.include_router(news_router)
    return app


def test_get_news_without_keyword():
    """GET /api/news without keyword returns articles from top-headlines."""
    mock_response = httpx.Response(200, json=SAMPLE_API_RESPONSE)

    with patch.dict("os.environ", {"NEWS_API_KEY": "test-key"}):
        with patch("app.services.news_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.get = AsyncMock(return_value=mock_response)
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client_cls.return_value = mock_client

            client = TestClient(_make_app())
            resp = client.get("/api/news")

            assert resp.status_code == 200
            data = resp.json()
            assert len(data) == 2
            assert data[0]["title"] == "Test Article 1"
            assert data[0]["source"] == "BBC News"
            assert data[1]["description"] is None


def test_get_news_with_keyword():
    """GET /api/news?keyword=marketing passes keyword to service."""
    mock_response = httpx.Response(200, json=SAMPLE_API_RESPONSE)

    with patch.dict("os.environ", {"NEWS_API_KEY": "test-key"}):
        with patch("app.services.news_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.get = AsyncMock(return_value=mock_response)
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client_cls.return_value = mock_client

            client = TestClient(_make_app())
            resp = client.get("/api/news", params={"keyword": "marketing"})

            assert resp.status_code == 200
            call_args = mock_client.get.call_args
            assert "everything" in call_args[0][0]
            assert call_args[1]["params"]["q"] == "marketing"


def test_get_news_missing_api_key_returns_502():
    """GET /api/news without NEWS_API_KEY returns 502."""
    with patch.dict("os.environ", {}, clear=True):
        client = TestClient(_make_app(), raise_server_exceptions=False)
        resp = client.get("/api/news")
        assert resp.status_code == 502


def test_get_news_rate_limit_returns_429():
    """GET /api/news returns 429 when NewsAPI rate-limits."""
    mock_response = httpx.Response(429, json={"status": "error"})

    with patch.dict("os.environ", {"NEWS_API_KEY": "test-key"}):
        with patch("app.services.news_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.get = AsyncMock(return_value=mock_response)
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client_cls.return_value = mock_client

            client = TestClient(_make_app(), raise_server_exceptions=False)
            resp = client.get("/api/news")
            assert resp.status_code == 429


def test_news_router_included_in_main():
    """The news router should be reachable via the main app."""
    from app.main import app

    client = TestClient(app, raise_server_exceptions=False)
    # We just verify the endpoint exists (not 404/405).
    # It may return 502 if no API key is set, which is fine.
    resp = client.get("/api/news")
    assert resp.status_code != 404
    assert resp.status_code != 405
