from typing import Optional

from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate


def create_campaign(db: Session, campaign_data: CampaignCreate) -> Campaign:
    campaign = Campaign(**campaign_data.model_dump())
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


def get_campaigns(
    db: Session,
    status: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc",
) -> list[Campaign]:
    query = db.query(Campaign)

    if status:
        query = query.filter(Campaign.status == status)
    if category:
        query = query.filter(Campaign.category == category)

    if sort_by in ("budget", "start_date"):
        column = getattr(Campaign, sort_by)
        order_func = desc if sort_order == "desc" else asc
        query = query.order_by(order_func(column))

    return query.all()


def get_campaign(db: Session, campaign_id: int) -> Optional[Campaign]:
    return db.query(Campaign).filter(Campaign.id == campaign_id).first()


def update_campaign(
    db: Session, campaign_id: int, campaign_data: CampaignUpdate
) -> Optional[Campaign]:
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        return None

    for field, value in campaign_data.model_dump().items():
        setattr(campaign, field, value)

    db.commit()
    db.refresh(campaign)
    return campaign


def delete_campaign(db: Session, campaign_id: int) -> bool:
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        return False

    db.delete(campaign)
    db.commit()
    return True
