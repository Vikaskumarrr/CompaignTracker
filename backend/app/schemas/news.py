from pydantic import BaseModel


class NewsArticle(BaseModel):
    title: str
    description: str | None
    source: str
    url: str
    published_at: str
