from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.campaign import CampaignCreate, CampaignResponse, CampaignUpdate
from app.services import campaign_service

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])


@router.post("", response_model=CampaignResponse, status_code=201)
def create_campaign(
    campaign_data: CampaignCreate, db: Session = Depends(get_db)
):
    campaign = campaign_service.create_campaign(db, campaign_data)
    return campaign


@router.get("", response_model=list[CampaignResponse])
def list_campaigns(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None),
    sort_order: Optional[str] = Query("asc"),
    db: Session = Depends(get_db),
):
    return campaign_service.get_campaigns(db, status, category, sort_by, sort_order)


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = campaign_service.get_campaign(db, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    campaign_id: int, campaign_data: CampaignUpdate, db: Session = Depends(get_db)
):
    campaign = campaign_service.update_campaign(db, campaign_id, campaign_data)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.delete("/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    deleted = campaign_service.delete_campaign(db, campaign_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign deleted"}
