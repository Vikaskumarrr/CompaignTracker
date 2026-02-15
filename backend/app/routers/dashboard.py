from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dashboard import (
    CategoryBudget,
    DashboardSummary,
    StatusCount,
    TimeSeriesPoint,
)
from app.services import dashboard_service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db)):
    return dashboard_service.get_summary(db)


@router.get("/status-distribution", response_model=list[StatusCount])
def get_status_distribution(db: Session = Depends(get_db)):
    return dashboard_service.get_status_distribution(db)


@router.get("/budget-by-category", response_model=list[CategoryBudget])
def get_budget_by_category(db: Session = Depends(get_db)):
    return dashboard_service.get_budget_by_category(db)


@router.get("/campaigns-over-time", response_model=list[TimeSeriesPoint])
def get_campaigns_over_time(db: Session = Depends(get_db)):
    return dashboard_service.get_campaigns_over_time(db)
