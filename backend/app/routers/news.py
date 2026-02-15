from typing import Optional

from fastapi import APIRouter, Query

from app.schemas.news import NewsArticle
from app.services.news_service import fetch_news

router = APIRouter(prefix="/api", tags=["news"])


@router.get("/news", response_model=list[NewsArticle])
async def get_news(keyword: Optional[str] = Query(None)):
    return await fetch_news(keyword)
