import os
from typing import List

import httpx
from fastapi import HTTPException

from app.schemas.news import NewsArticle

NEWS_API_BASE_URL = "https://newsapi.org/v2"


async def fetch_news(keyword: str | None = None) -> List[NewsArticle]:
    """Fetch news articles from NewsAPI.

    If keyword is provided, uses /v2/everything endpoint.
    Otherwise, uses /v2/top-headlines with country=us.
    """
    api_key = os.environ.get("NEWS_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=502,
            detail="News service temporarily unavailable",
        )

    if keyword:
        url = f"{NEWS_API_BASE_URL}/everything"
        params = {"q": keyword, "apiKey": api_key, "pageSize": 20}
    else:
        url = f"{NEWS_API_BASE_URL}/top-headlines"
        params = {"country": "us", "apiKey": api_key, "pageSize": 20}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail="News service temporarily unavailable",
        )

    if response.status_code == 429:
        raise HTTPException(
            status_code=429,
            detail="News API rate limit exceeded. Please try again later.",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="News service temporarily unavailable",
        )

    data = response.json()
    articles: List[NewsArticle] = []
    for article in data.get("articles", []):
        articles.append(
            NewsArticle(
                title=article.get("title", ""),
                description=article.get("description"),
                source=article.get("source", {}).get("name", "Unknown"),
                url=article.get("url", ""),
                published_at=article.get("publishedAt", ""),
            )
        )

    return articles
