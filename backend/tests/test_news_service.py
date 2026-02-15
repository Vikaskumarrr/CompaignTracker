import pytest
from unittest.mock import patch, AsyncMock
import httpx

from app.services.news_service import fetch_news


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


@pytest.mark.asyncio
async def test_fetch_news_missing_api_key():
    """Missing NEWS_API_KEY should raise 502."""
    with patch.dict("os.environ", {}, clear=True):
        with pytest.raises(httpx.HTTPStatusError if False else Exception) as exc_info:
            await fetch_news()
        from fastapi import HTTPException
        assert isinstance(exc_info.value, HTTPException)
        assert exc_info.value.status_code == 502
        assert "temporarily unavailable" in exc_info.value.detail


@pytest.mark.asyncio
async def test_fetch_news_top_headlines_no_keyword():
    """Without keyword, should call top-headlines endpoint."""
    mock_response = httpx.Response(200, json=SAMPLE_API_RESPONSE)

    with patch.dict("os.environ", {"NEWS_API_KEY": "test-key"}):
        with patch("app.services.news_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.get = AsyncMock(return_value=mock_response)
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client_cls.return_value = mock_client

            articles = await fetch_news()

            assert len(articles) == 2
            assert articles[0].title == "Test Article 1"
            assert articles[0].source == "BBC News"
            assert articles[1].description is None

            call_args = mock_client.get.call_args
            assert "top-headlines" in call_args[0][0]
            assert call_args[1]["params"]["country"] == "us"


@pytest.mark.asyncio
async def test_fetch_news_everything_with_keyword():
    """With keyword, should call everything endpoint."""
    mock_response = httpx.Response(200, json=SAMPLE_API_RESPONSE)

    with patch.dict("os.environ", {"NEWS_API_KEY": "test-key"}):
        with patch("app.services.news_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.get = AsyncMock(return_value=mock_response)
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client_cls.return_value = mock_client

            articles = await fetch_news(keyword="marketing")

            call_args = mock_client.get.call_args
            assert "everything" in call_args[0][0]
            assert call_args[1]["params"]["q"] == "marketing"


@pytest.mark.asyncio
async def test_fetch_news_api_rate_limit():
    """429 from NewsAPI should raise HTTPException with 429."""
    mock_response = httpx.Response(429, json={"status": "error", "message": "rate limited"})

    with patch.dict("os.environ", {"NEWS_API_KEY": "test-key"}):
        with patch("app.services.news_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.get = AsyncMock(return_value=mock_response)
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client_cls.return_value = mock_client

            with pytest.raises(Exception) as exc_info:
                await fetch_news()
            from fastapi import HTTPException
            assert isinstance(exc_info.value, HTTPException)
            assert exc_info.value.status_code == 429
            assert "rate limit" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_fetch_news_api_server_error():
    """Non-200/non-429 from NewsAPI should raise 502."""
    mock_response = httpx.Response(500, json={"status": "error"})

    with patch.dict("os.environ", {"NEWS_API_KEY": "test-key"}):
        with patch("app.services.news_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.get = AsyncMock(return_value=mock_response)
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client_cls.return_value = mock_client

            with pytest.raises(Exception) as exc_info:
                await fetch_news()
            from fastapi import HTTPException
            assert isinstance(exc_info.value, HTTPException)
            assert exc_info.value.status_code == 502


@pytest.mark.asyncio
async def test_fetch_news_network_error():
    """Network failure should raise 502."""
    with patch.dict("os.environ", {"NEWS_API_KEY": "test-key"}):
        with patch("app.services.news_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client.get = AsyncMock(side_effect=httpx.ConnectError("connection failed"))
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client_cls.return_value = mock_client

            with pytest.raises(Exception) as exc_info:
                await fetch_news()
            from fastapi import HTTPException
            assert isinstance(exc_info.value, HTTPException)
            assert exc_info.value.status_code == 502
