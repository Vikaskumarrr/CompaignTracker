from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.schemas.dashboard import (
    CategoryBudget,
    DashboardSummary,
    StatusCount,
    TimeSeriesPoint,
)


def get_summary(db: Session) -> DashboardSummary:
    result = db.query(
        func.count(Campaign.id).label("total_campaigns"),
        func.coalesce(func.sum(Campaign.budget), 0.0).label("total_budget"),
        func.count(Campaign.id).filter(Campaign.status == "active").label("active_campaigns"),
    ).first()

    total_campaigns = result.total_campaigns
    total_budget = float(result.total_budget)
    active_campaigns = result.active_campaigns
    average_budget = total_budget / total_campaigns if total_campaigns > 0 else 0.0

    return DashboardSummary(
        total_campaigns=total_campaigns,
        total_budget=total_budget,
        active_campaigns=active_campaigns,
        average_budget=round(average_budget, 2),
    )


def get_status_distribution(db: Session) -> list[StatusCount]:
    results = (
        db.query(Campaign.status, func.count(Campaign.id).label("count"))
        .group_by(Campaign.status)
        .all()
    )
    return [StatusCount(status=row.status, count=row.count) for row in results]


def get_budget_by_category(db: Session) -> list[CategoryBudget]:
    results = (
        db.query(
            Campaign.category,
            func.coalesce(func.sum(Campaign.budget), 0.0).label("total_budget"),
        )
        .group_by(Campaign.category)
        .all()
    )
    return [
        CategoryBudget(category=row.category, total_budget=float(row.total_budget))
        for row in results
    ]


def get_campaigns_over_time(db: Session) -> list[TimeSeriesPoint]:
    date_col = func.date(Campaign.created_at)
    results = (
        db.query(date_col.label("date"), func.count(Campaign.id).label("count"))
        .group_by(date_col)
        .order_by(date_col)
        .all()
    )
    return [
        TimeSeriesPoint(date=str(row.date), count=row.count) for row in results
    ]
