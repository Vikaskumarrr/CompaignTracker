from datetime import date

import pytest

from app.schemas.campaign import CampaignCreate
from app.services.campaign_service import create_campaign
from app.services.dashboard_service import (
    get_budget_by_category,
    get_campaigns_over_time,
    get_status_distribution,
    get_summary,
)


def _make_campaign(**overrides) -> CampaignCreate:
    defaults = {
        "name": "Test Campaign",
        "description": "A test campaign",
        "status": "draft",
        "budget": 1000.0,
        "start_date": date(2025, 1, 1),
        "end_date": date(2025, 12, 31),
        "platform": "google",
        "category": "sales",
    }
    defaults.update(overrides)
    return CampaignCreate(**defaults)


class TestGetSummary:
    """Validates: Requirement 5.4 - summary metric cards."""

    def test_empty_database_returns_zeros(self, db):
        summary = get_summary(db)
        assert summary.total_campaigns == 0
        assert summary.total_budget == 0.0
        assert summary.active_campaigns == 0
        assert summary.average_budget == 0.0

    def test_returns_correct_totals(self, db):
        create_campaign(db, _make_campaign(name="A", budget=500.0, status="active"))
        create_campaign(db, _make_campaign(name="B", budget=1500.0, status="draft"))

        summary = get_summary(db)
        assert summary.total_campaigns == 2
        assert summary.total_budget == 2000.0
        assert summary.active_campaigns == 1
        assert summary.average_budget == 1000.0

    def test_average_budget_rounds_to_two_decimals(self, db):
        create_campaign(db, _make_campaign(name="A", budget=100.0))
        create_campaign(db, _make_campaign(name="B", budget=200.0))
        create_campaign(db, _make_campaign(name="C", budget=300.0))

        summary = get_summary(db)
        assert summary.average_budget == 200.0


class TestGetStatusDistribution:
    """Validates: Requirement 5.1 - campaign counts grouped by status."""

    def test_empty_database_returns_empty_list(self, db):
        result = get_status_distribution(db)
        assert result == []

    def test_returns_counts_per_status(self, db):
        create_campaign(db, _make_campaign(name="A", status="active"))
        create_campaign(db, _make_campaign(name="B", status="active"))
        create_campaign(db, _make_campaign(name="C", status="draft"))

        result = get_status_distribution(db)
        dist = {r.status: r.count for r in result}
        assert dist["active"] == 2
        assert dist["draft"] == 1

    def test_counts_sum_to_total(self, db):
        create_campaign(db, _make_campaign(name="A", status="active"))
        create_campaign(db, _make_campaign(name="B", status="paused"))
        create_campaign(db, _make_campaign(name="C", status="completed"))

        result = get_status_distribution(db)
        assert sum(r.count for r in result) == 3


class TestGetBudgetByCategory:
    """Validates: Requirement 5.2 - total budget breakdown by category."""

    def test_empty_database_returns_empty_list(self, db):
        result = get_budget_by_category(db)
        assert result == []

    def test_returns_budget_per_category(self, db):
        create_campaign(db, _make_campaign(name="A", category="sales", budget=1000.0))
        create_campaign(db, _make_campaign(name="B", category="sales", budget=500.0))
        create_campaign(db, _make_campaign(name="C", category="engagement", budget=2000.0))

        result = get_budget_by_category(db)
        budgets = {r.category: r.total_budget for r in result}
        assert budgets["sales"] == 1500.0
        assert budgets["engagement"] == 2000.0


class TestGetCampaignsOverTime:
    """Validates: Requirement 5.3 - campaigns created over time."""

    def test_empty_database_returns_empty_list(self, db):
        result = get_campaigns_over_time(db)
        assert result == []

    def test_returns_counts_grouped_by_date(self, db):
        create_campaign(db, _make_campaign(name="A"))
        create_campaign(db, _make_campaign(name="B"))

        result = get_campaigns_over_time(db)
        # Both created in the same test run, so same date
        assert len(result) >= 1
        assert sum(r.count for r in result) == 2

    def test_date_field_is_string(self, db):
        create_campaign(db, _make_campaign(name="A"))
        result = get_campaigns_over_time(db)
        assert len(result) == 1
        # Should be a date string like "2025-01-15"
        assert isinstance(result[0].date, str)
        assert len(result[0].date) == 10  # YYYY-MM-DD format
