from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_campaigns: int
    total_budget: float
    active_campaigns: int
    average_budget: float


class StatusCount(BaseModel):
    status: str
    count: int


class CategoryBudget(BaseModel):
    category: str
    total_budget: float


class TimeSeriesPoint(BaseModel):
    date: str
    count: int
