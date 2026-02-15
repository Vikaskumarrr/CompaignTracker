"""Unit tests for the campaign router REST endpoints."""

VALID_CAMPAIGN = {
    "name": "Test Campaign",
    "description": "A test campaign",
    "status": "draft",
    "budget": 1000.0,
    "start_date": "2025-01-01",
    "end_date": "2025-06-30",
    "platform": "facebook",
    "category": "sales",
}


def _create_campaign(client, data=None):
    """Helper to create a campaign and return the response."""
    return client.post("/api/campaigns", json=data or VALID_CAMPAIGN)


class TestCreateCampaign:
    def test_create_returns_201(self, client):
        resp = _create_campaign(client)
        assert resp.status_code == 201

    def test_create_returns_campaign_with_id(self, client):
        data = resp = _create_campaign(client).json()
        assert "id" in data
        assert data["name"] == VALID_CAMPAIGN["name"]
        assert data["budget"] == VALID_CAMPAIGN["budget"]

    def test_create_invalid_empty_name_returns_422(self, client):
        payload = {**VALID_CAMPAIGN, "name": ""}
        resp = client.post("/api/campaigns", json=payload)
        assert resp.status_code == 422

    def test_create_negative_budget_returns_422(self, client):
        payload = {**VALID_CAMPAIGN, "budget": -100}
        resp = client.post("/api/campaigns", json=payload)
        assert resp.status_code == 422

    def test_create_end_before_start_returns_422(self, client):
        payload = {**VALID_CAMPAIGN, "start_date": "2025-06-30", "end_date": "2025-01-01"}
        resp = client.post("/api/campaigns", json=payload)
        assert resp.status_code == 422


class TestListCampaigns:
    def test_list_empty(self, client):
        resp = client.get("/api/campaigns")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_list_returns_created_campaigns(self, client):
        _create_campaign(client)
        _create_campaign(client, {**VALID_CAMPAIGN, "name": "Second"})
        resp = client.get("/api/campaigns")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_filter_by_status(self, client):
        _create_campaign(client, {**VALID_CAMPAIGN, "status": "active"})
        _create_campaign(client, {**VALID_CAMPAIGN, "status": "draft"})
        resp = client.get("/api/campaigns", params={"status": "active"})
        assert resp.status_code == 200
        campaigns = resp.json()
        assert len(campaigns) == 1
        assert campaigns[0]["status"] == "active"

    def test_filter_by_category(self, client):
        _create_campaign(client, {**VALID_CAMPAIGN, "category": "sales"})
        _create_campaign(client, {**VALID_CAMPAIGN, "category": "engagement"})
        resp = client.get("/api/campaigns", params={"category": "engagement"})
        campaigns = resp.json()
        assert len(campaigns) == 1
        assert campaigns[0]["category"] == "engagement"

    def test_sort_by_budget_asc(self, client):
        _create_campaign(client, {**VALID_CAMPAIGN, "budget": 500})
        _create_campaign(client, {**VALID_CAMPAIGN, "budget": 100})
        _create_campaign(client, {**VALID_CAMPAIGN, "budget": 900})
        resp = client.get("/api/campaigns", params={"sort_by": "budget", "sort_order": "asc"})
        budgets = [c["budget"] for c in resp.json()]
        assert budgets == sorted(budgets)

    def test_sort_by_budget_desc(self, client):
        _create_campaign(client, {**VALID_CAMPAIGN, "budget": 500})
        _create_campaign(client, {**VALID_CAMPAIGN, "budget": 100})
        _create_campaign(client, {**VALID_CAMPAIGN, "budget": 900})
        resp = client.get("/api/campaigns", params={"sort_by": "budget", "sort_order": "desc"})
        budgets = [c["budget"] for c in resp.json()]
        assert budgets == sorted(budgets, reverse=True)


class TestGetCampaign:
    def test_get_existing(self, client):
        created = _create_campaign(client).json()
        resp = client.get(f"/api/campaigns/{created['id']}")
        assert resp.status_code == 200
        assert resp.json()["id"] == created["id"]

    def test_get_not_found(self, client):
        resp = client.get("/api/campaigns/99999")
        assert resp.status_code == 404
        assert resp.json()["detail"] == "Campaign not found"


class TestUpdateCampaign:
    def test_update_existing(self, client):
        created = _create_campaign(client).json()
        update_data = {**VALID_CAMPAIGN, "name": "Updated Name", "budget": 2000}
        resp = client.put(f"/api/campaigns/{created['id']}", json=update_data)
        assert resp.status_code == 200
        assert resp.json()["name"] == "Updated Name"
        assert resp.json()["budget"] == 2000

    def test_update_not_found(self, client):
        resp = client.put("/api/campaigns/99999", json=VALID_CAMPAIGN)
        assert resp.status_code == 404
        assert resp.json()["detail"] == "Campaign not found"

    def test_update_invalid_data_returns_422(self, client):
        created = _create_campaign(client).json()
        bad_data = {**VALID_CAMPAIGN, "budget": -50}
        resp = client.put(f"/api/campaigns/{created['id']}", json=bad_data)
        assert resp.status_code == 422


class TestDeleteCampaign:
    def test_delete_existing(self, client):
        created = _create_campaign(client).json()
        resp = client.delete(f"/api/campaigns/{created['id']}")
        assert resp.status_code == 200
        assert resp.json()["message"] == "Campaign deleted"
        # Verify it's gone
        get_resp = client.get(f"/api/campaigns/{created['id']}")
        assert get_resp.status_code == 404

    def test_delete_not_found(self, client):
        resp = client.delete("/api/campaigns/99999")
        assert resp.status_code == 404
        assert resp.json()["detail"] == "Campaign not found"
