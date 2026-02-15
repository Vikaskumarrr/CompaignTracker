from datetime import date, datetime

import pytest
from pydantic import ValidationError

from app.schemas.campaign import CampaignBase, CampaignCreate, CampaignResponse, CampaignUpdate


class TestCampaignBase:
    """Unit tests for CampaignBase schema validation."""

    def _valid_data(self, **overrides):
        defaults = {
            "name": "Test Campaign",
            "start_date": date(2025, 1, 1),
            "end_date": date(2025, 12, 31),
        }
        defaults.update(overrides)
        return defaults

    def test_valid_minimal(self):
        c = CampaignBase(**self._valid_data())
        assert c.name == "Test Campaign"
        assert c.description == ""
        assert c.status == "draft"
        assert c.budget == 0.0
        assert c.platform == "other"
        assert c.category == "other"

    def test_valid_all_fields(self):
        c = CampaignBase(**self._valid_data(
            description="A campaign",
            status="active",
            budget=1500.50,
            platform="facebook",
            category="sales",
        ))
        assert c.status == "active"
        assert c.budget == 1500.50
        assert c.platform == "facebook"
        assert c.category == "sales"

    def test_empty_name_rejected(self):
        """Validates: Requirement 1.2 - empty name rejected."""
        with pytest.raises(ValidationError) as exc_info:
            CampaignBase(**self._valid_data(name=""))
        assert "name" in str(exc_info.value).lower()

    def test_missing_name_rejected(self):
        """Validates: Requirement 1.2 - missing name rejected."""
        data = self._valid_data()
        del data["name"]
        with pytest.raises(ValidationError):
            CampaignBase(**data)

    def test_negative_budget_rejected(self):
        """Validates: Requirement 1.3 - negative budget rejected."""
        with pytest.raises(ValidationError) as exc_info:
            CampaignBase(**self._valid_data(budget=-1.0))
        assert "budget" in str(exc_info.value).lower()

    def test_zero_budget_accepted(self):
        c = CampaignBase(**self._valid_data(budget=0))
        assert c.budget == 0.0

    def test_end_date_before_start_date_rejected(self):
        """Validates: Requirement 1.4 - invalid date range rejected."""
        with pytest.raises(ValidationError) as exc_info:
            CampaignBase(**self._valid_data(
                start_date=date(2025, 6, 1),
                end_date=date(2025, 1, 1),
            ))
        assert "end_date must be on or after start_date" in str(exc_info.value)

    def test_same_start_and_end_date_accepted(self):
        c = CampaignBase(**self._valid_data(
            start_date=date(2025, 6, 1),
            end_date=date(2025, 6, 1),
        ))
        assert c.start_date == c.end_date

    def test_invalid_status_rejected(self):
        """Validates: Requirement 1.5 - invalid status rejected."""
        with pytest.raises(ValidationError):
            CampaignBase(**self._valid_data(status="invalid"))

    def test_invalid_platform_rejected(self):
        with pytest.raises(ValidationError):
            CampaignBase(**self._valid_data(platform="tiktok"))

    def test_invalid_category_rejected(self):
        with pytest.raises(ValidationError):
            CampaignBase(**self._valid_data(category="unknown"))


class TestCampaignCreateUpdate:
    """CampaignCreate and CampaignUpdate inherit all CampaignBase validation."""

    def test_create_inherits_validation(self):
        c = CampaignCreate(
            name="New", start_date=date(2025, 1, 1), end_date=date(2025, 12, 31)
        )
        assert c.name == "New"

    def test_update_inherits_validation(self):
        with pytest.raises(ValidationError):
            CampaignUpdate(
                name="", start_date=date(2025, 1, 1), end_date=date(2025, 12, 31)
            )


class TestCampaignResponse:
    """Validates: Requirements 9.4 - serialization from ORM attributes."""

    def test_from_attributes(self):
        """CampaignResponse can be built from an ORM-like object."""

        class FakeORM:
            id = 1
            name = "Campaign"
            description = "desc"
            status = "active"
            budget = 100.0
            start_date = date(2025, 1, 1)
            end_date = date(2025, 12, 31)
            platform = "google"
            category = "sales"
            created_at = datetime(2025, 1, 1, 0, 0, 0)
            updated_at = datetime(2025, 1, 1, 0, 0, 0)

        resp = CampaignResponse.model_validate(FakeORM(), from_attributes=True)
        assert resp.id == 1
        assert resp.name == "Campaign"
        assert resp.created_at == datetime(2025, 1, 1, 0, 0, 0)
