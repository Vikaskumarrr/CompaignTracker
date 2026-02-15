from datetime import date

import pytest

from app.schemas.campaign import CampaignCreate, CampaignUpdate
from app.services.campaign_service import (
    create_campaign,
    delete_campaign,
    get_campaign,
    get_campaigns,
    update_campaign,
)


def _make_campaign_data(**overrides) -> CampaignCreate:
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


class TestCreateCampaign:
    """Validates: Requirement 1.1 - campaign creation."""

    def test_creates_and_returns_campaign(self, db):
        data = _make_campaign_data()
        campaign = create_campaign(db, data)

        assert campaign.id is not None
        assert campaign.name == "Test Campaign"
        assert campaign.budget == 1000.0
        assert campaign.status == "draft"
        assert campaign.created_at is not None

    def test_assigns_unique_ids(self, db):
        c1 = create_campaign(db, _make_campaign_data(name="First"))
        c2 = create_campaign(db, _make_campaign_data(name="Second"))
        assert c1.id != c2.id


class TestGetCampaigns:
    """Validates: Requirements 2.2, 2.3, 2.4, 2.5 - listing with filter/sort."""

    def test_returns_all_campaigns(self, db):
        create_campaign(db, _make_campaign_data(name="A"))
        create_campaign(db, _make_campaign_data(name="B"))
        result = get_campaigns(db)
        assert len(result) == 2

    def test_filter_by_status(self, db):
        create_campaign(db, _make_campaign_data(status="active"))
        create_campaign(db, _make_campaign_data(status="draft"))
        result = get_campaigns(db, status="active")
        assert len(result) == 1
        assert result[0].status == "active"

    def test_filter_by_category(self, db):
        create_campaign(db, _make_campaign_data(category="sales"))
        create_campaign(db, _make_campaign_data(category="engagement"))
        result = get_campaigns(db, category="sales")
        assert len(result) == 1
        assert result[0].category == "sales"

    def test_sort_by_budget_asc(self, db):
        create_campaign(db, _make_campaign_data(name="Expensive", budget=5000))
        create_campaign(db, _make_campaign_data(name="Cheap", budget=100))
        result = get_campaigns(db, sort_by="budget", sort_order="asc")
        assert result[0].budget <= result[1].budget

    def test_sort_by_budget_desc(self, db):
        create_campaign(db, _make_campaign_data(name="Cheap", budget=100))
        create_campaign(db, _make_campaign_data(name="Expensive", budget=5000))
        result = get_campaigns(db, sort_by="budget", sort_order="desc")
        assert result[0].budget >= result[1].budget

    def test_sort_by_start_date_asc(self, db):
        create_campaign(db, _make_campaign_data(
            name="Later", start_date=date(2025, 6, 1), end_date=date(2025, 12, 31)
        ))
        create_campaign(db, _make_campaign_data(
            name="Earlier", start_date=date(2025, 1, 1), end_date=date(2025, 12, 31)
        ))
        result = get_campaigns(db, sort_by="start_date", sort_order="asc")
        assert result[0].start_date <= result[1].start_date

    def test_empty_list_when_no_campaigns(self, db):
        result = get_campaigns(db)
        assert result == []


class TestGetCampaign:
    """Validates: Requirement 3.2 - single campaign retrieval."""

    def test_returns_campaign_by_id(self, db):
        created = create_campaign(db, _make_campaign_data())
        found = get_campaign(db, created.id)
        assert found is not None
        assert found.id == created.id
        assert found.name == created.name

    def test_returns_none_for_nonexistent_id(self, db):
        result = get_campaign(db, 99999)
        assert result is None


class TestUpdateCampaign:
    """Validates: Requirement 3.1 - campaign update."""

    def test_updates_campaign_fields(self, db):
        created = create_campaign(db, _make_campaign_data())
        update_data = CampaignUpdate(
            name="Updated Name",
            description="Updated",
            status="active",
            budget=2000.0,
            start_date=date(2025, 2, 1),
            end_date=date(2025, 11, 30),
            platform="facebook",
            category="engagement",
        )
        updated = update_campaign(db, created.id, update_data)
        assert updated is not None
        assert updated.name == "Updated Name"
        assert updated.status == "active"
        assert updated.budget == 2000.0

    def test_returns_none_for_nonexistent_id(self, db):
        update_data = CampaignUpdate(
            name="X",
            start_date=date(2025, 1, 1),
            end_date=date(2025, 12, 31),
        )
        result = update_campaign(db, 99999, update_data)
        assert result is None


class TestDeleteCampaign:
    """Validates: Requirements 4.1, 4.2 - campaign deletion."""

    def test_deletes_existing_campaign(self, db):
        created = create_campaign(db, _make_campaign_data())
        result = delete_campaign(db, created.id)
        assert result is True
        assert get_campaign(db, created.id) is None

    def test_returns_false_for_nonexistent_id(self, db):
        result = delete_campaign(db, 99999)
        assert result is False
