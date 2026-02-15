from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class CampaignBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(default="", max_length=2000)
    status: Literal["draft", "active", "paused", "completed"] = "draft"
    budget: float = Field(default=0.0, ge=0)
    start_date: date
    end_date: date
    platform: Literal[
        "facebook", "instagram", "twitter", "google", "linkedin", "email", "other"
    ] = "other"
    category: Literal[
        "brand_awareness", "lead_generation", "sales", "engagement", "retention", "other"
    ] = "other"

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date")
        return self


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(CampaignBase):
    pass


class CampaignResponse(CampaignBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
