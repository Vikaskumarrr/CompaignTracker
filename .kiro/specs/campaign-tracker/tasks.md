# Implementation Plan: Campaign Tracker

## Overview

This plan implements the Campaign Tracker as a monorepo with `/backend` (FastAPI + SQLAlchemy + Pydantic) and `/frontend` (Next.js 14 + Tailwind CSS + Framer Motion + Recharts). Tasks are ordered so each step builds on the previous, with property tests and unit tests placed close to the code they validate.

## Tasks

- [x] 1. Initialize project structure and configuration
  - [x] 1.1 Create monorepo directory structure with `/backend` and `/frontend` directories
    - Create `backend/` with `app/`, `app/routers/`, `app/services/`, `app/models/`, `app/schemas/`, `tests/` directories
    - Create `backend/requirements.txt` with fastapi, uvicorn, sqlalchemy, psycopg2-binary, pydantic, httpx, python-dotenv, hypothesis, pytest, pytest-asyncio
    - Create `backend/.env.example` with DATABASE_URL, NEWS_API_KEY, FRONTEND_URL
    - Create `backend/app/__init__.py` and other `__init__.py` files
    - _Requirements: 10.1, 10.2_

  - [x] 1.2 Initialize Next.js 14 frontend with Tailwind CSS
    - Run `npx create-next-app@14` in `/frontend` with App Router, TypeScript, Tailwind CSS, ESLint
    - Install dependencies: framer-motion, recharts
    - Create `frontend/.env.example` with NEXT_PUBLIC_API_URL=http://localhost:8000
    - _Requirements: 10.1, 10.2, 10.4_

  - [x] 1.3 Create root README.md with setup instructions
    - Document prerequisites (Python 3.11+, Node.js 18+, PostgreSQL/Supabase)
    - Document backend setup: virtual env, pip install, .env configuration, uvicorn run command
    - Document frontend setup: npm install, .env configuration, npm run dev
    - Document database setup with Supabase connection string
    - _Requirements: 10.3_

- [x] 2. Implement backend database layer and schemas
  - [x] 2.1 Create database configuration and Campaign SQLAlchemy model
    - Create `backend/app/database.py` with SQLAlchemy engine, SessionLocal, Base, and `get_db` dependency
    - Create `backend/app/models/campaign.py` with Campaign model (id, name, description, status, budget, start_date, end_date, platform, category, created_at, updated_at)
    - _Requirements: 9.1, 9.3_

  - [x] 2.2 Create Pydantic schemas for campaign validation and serialization
    - Create `backend/app/schemas/campaign.py` with CampaignBase, CampaignCreate, CampaignUpdate, CampaignResponse
    - Implement model_validator for date range validation (end_date >= start_date)
    - Add Field constraints: name min_length=1, budget ge=0, Literal types for status/platform/category
    - _Requirements: 9.2, 9.4, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.3 Create Pydantic schemas for dashboard and news responses
    - Create `backend/app/schemas/dashboard.py` with DashboardSummary, StatusCount, CategoryBudget, TimeSeriesPoint
    - Create `backend/app/schemas/news.py` with NewsArticle
    - _Requirements: 5.4, 6.2_

- [ ] 3. Implement backend campaign CRUD service and router
  - [x] 3.1 Implement campaign service with CRUD operations
    - Create `backend/app/services/campaign_service.py`
    - Implement `create_campaign(db, data)` - creates and returns new campaign
    - Implement `get_campaigns(db, status, category, sort_by, sort_order)` - list with optional filter/sort
    - Implement `get_campaign(db, campaign_id)` - single campaign by ID
    - Implement `update_campaign(db, campaign_id, data)` - update existing campaign
    - Implement `delete_campaign(db, campaign_id)` - delete campaign
    - _Requirements: 1.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 4.1, 4.2_

  - [x] 3.2 Implement campaign router with REST endpoints
    - Create `backend/app/routers/campaigns.py`
    - POST `/api/campaigns` - create campaign (201)
    - GET `/api/campaigns` - list campaigns with query params (status, category, sort_by, sort_order)
    - GET `/api/campaigns/{id}` - get single campaign
    - PUT `/api/campaigns/{id}` - update campaign
    - DELETE `/api/campaigns/{id}` - delete campaign
    - Raise HTTPException(404) for not-found cases
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 3.3 Create FastAPI application entry point with CORS and startup
    - Create `backend/app/main.py` with FastAPI app instance
    - Add CORS middleware allowing frontend origin
    - Include campaign router
    - Add startup event to create database tables
    - _Requirements: 8.4, 9.3_

  - [ ]* 3.4 Write property tests for campaign CRUD
    - Create `backend/tests/conftest.py` with test database fixtures (SQLite in-memory), TestClient fixture
    - Create `backend/tests/test_properties.py`
    - **Property 1: Campaign creation round-trip** - For any valid campaign input, POST then GET returns matching data
    - **Validates: Requirements 1.1**
    - **Property 2: Invalid campaign input rejection** - For any invalid input (empty name, negative budget, bad dates, invalid status), POST returns 422
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5**
    - **Property 5: Campaign update round-trip** - For any existing campaign and valid update, PUT then GET returns updated data
    - **Validates: Requirements 3.1**
    - **Property 7: Campaign deletion removes record** - For any existing campaign, DELETE then GET returns 404
    - **Validates: Requirements 4.1**

  - [ ]* 3.5 Write property tests for filtering, sorting, and 404 handling
    - **Property 3: Campaign filtering correctness** - For any set of campaigns and filter value, all returned campaigns match the filter
    - **Validates: Requirements 2.2, 2.3**
    - **Property 4: Campaign sorting correctness** - For any set of campaigns and sort field/direction, returned list is correctly ordered
    - **Validates: Requirements 2.4, 2.5**
    - **Property 6: Non-existent campaign returns 404** - For any non-existent ID, GET/PUT/DELETE return 404
    - **Validates: Requirements 3.2, 4.2**

- [x] 4. Implement backend dashboard service and router
  - [x] 4.1 Implement dashboard service with aggregation queries
    - Create `backend/app/services/dashboard_service.py`
    - Implement `get_summary(db)` - returns total_campaigns, total_budget, active_campaigns, average_budget
    - Implement `get_status_distribution(db)` - returns list of {status, count} using GROUP BY
    - Implement `get_budget_by_category(db)` - returns list of {category, total_budget} using GROUP BY
    - Implement `get_campaigns_over_time(db)` - returns list of {date, count} grouped by created_at date
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 4.2 Implement dashboard router with endpoints
    - Create `backend/app/routers/dashboard.py`
    - GET `/api/dashboard/summary`
    - GET `/api/dashboard/status-distribution`
    - GET `/api/dashboard/budget-by-category`
    - GET `/api/dashboard/campaigns-over-time`
    - Include router in main.py
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 4.3 Write property tests for dashboard aggregation
    - **Property 8: Dashboard aggregation consistency** - For any set of campaigns, status counts sum to total, budget sums match, time series counts sum to total, summary metrics are correct
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [x] 5. Implement backend news service and router
  - [x] 5.1 Implement news service with NewsAPI integration
    - Create `backend/app/services/news_service.py`
    - Implement `fetch_news(keyword)` using httpx to call NewsAPI `/v2/everything` or `/v2/top-headlines`
    - Handle API errors: return structured error for unavailable API (502), rate limit (429)
    - Read NEWS_API_KEY from environment variables
    - _Requirements: 6.1, 6.3, 6.4, 6.5_

  - [x] 5.2 Implement news router with endpoint
    - Create `backend/app/routers/news.py`
    - GET `/api/news?keyword=` - fetch news articles
    - Include router in main.py
    - _Requirements: 6.1, 6.3_

  - [ ]* 5.3 Write unit tests for news service error handling
    - Test that missing API key returns appropriate error
    - Test that mocked API failure returns 502 with fallback message
    - Test that mocked rate limit response returns 429
    - _Requirements: 6.4, 6.5_

- [x] 6. Checkpoint - Backend complete
  - Ensure all backend tests pass with `pytest backend/tests/`
  - Verify all API endpoints work by running the server manually
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement frontend API client and TypeScript types
  - [x] 7.1 Create TypeScript interfaces and API client
    - Create `frontend/src/lib/types.ts` with Campaign, CampaignFormData, DashboardSummary, StatusCount, CategoryBudget, TimeSeriesPoint, NewsArticle interfaces
    - Create `frontend/src/lib/api.ts` with fetch wrapper functions for all backend endpoints
    - Use `NEXT_PUBLIC_API_URL` environment variable for base URL
    - _Requirements: 8.1_

- [x] 8. Implement landing page with animations
  - [x] 8.1 Build landing page with hero section and gradient effects
    - Create `frontend/src/app/page.tsx` with hero section
    - Implement animated gradient background using Tailwind CSS gradient classes and Framer Motion
    - Add animated heading and subheading text with Framer Motion fade-in/slide-up
    - Add CTA button linking to `/campaigns`
    - _Requirements: 7.1, 7.4_

  - [x] 8.2 Add feature sections with scroll-triggered animations
    - Add feature cards section highlighting CRUD, Dashboard, and Trends features
    - Implement scroll-triggered Framer Motion animations (whileInView) for each card
    - Add smooth scroll behavior for navigation anchor links
    - Ensure responsive layout across desktop, tablet, and mobile
    - _Requirements: 7.2, 7.3, 7.5_

- [x] 9. Implement frontend navigation and layout
  - [x] 9.1 Create root layout with navigation bar
    - Update `frontend/src/app/layout.tsx` with Inter font, global styles
    - Create `frontend/src/components/Navbar.tsx` with links: Home, Campaigns, Dashboard, Trends
    - Style with Tailwind CSS, responsive hamburger menu for mobile
    - _Requirements: 7.3_

- [x] 10. Implement campaign CRUD UI
  - [x] 10.1 Build campaign list page with filtering and sorting
    - Create `frontend/src/app/campaigns/page.tsx`
    - Display campaigns in a table/card layout showing name, status, budget, platform, dates
    - Add filter dropdowns for status and category
    - Add sort controls for budget and start_date (asc/desc)
    - Add "Create Campaign" button
    - Show empty state when no campaigns exist
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_

  - [x] 10.2 Build campaign form component for create and edit
    - Create `frontend/src/components/CampaignForm.tsx` as a reusable modal/form
    - Fields: name (text), description (textarea), status (select), budget (number), start_date (date), end_date (date), platform (select), category (select)
    - Client-side validation: required name, non-negative budget, end_date >= start_date
    - Handle both create (POST) and edit (PUT) modes
    - On success, refresh campaign list without full page reload
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 3.1, 3.3, 3.4_

  - [x] 10.3 Build campaign detail page with edit and delete actions
    - Create `frontend/src/app/campaigns/[id]/page.tsx`
    - Display all campaign attributes
    - Add Edit button that opens CampaignForm in edit mode
    - Add Delete button with confirmation dialog
    - On delete success, navigate back to campaign list
    - _Requirements: 2.6, 3.1, 3.4, 4.1, 4.3, 4.4_

- [x] 11. Implement dashboard page with data visualizations
  - [x] 11.1 Build dashboard page with summary metrics and charts
    - Create `frontend/src/app/dashboard/page.tsx`
    - Add summary metric cards: total campaigns, total budget, active campaigns, average budget
    - Add status distribution pie/donut chart using Recharts PieChart
    - Add budget by category bar chart using Recharts BarChart
    - Add campaigns over time line chart using Recharts LineChart
    - Show empty states when no data exists
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 12. Implement trends page with news API integration
  - [x] 12.1 Build trends page with news articles display
    - Create `frontend/src/app/trends/page.tsx`
    - Add search input for keyword filtering
    - Display news article cards with title, description, source, published date, and link
    - Show loading state while fetching
    - Show user-friendly error/fallback message when API is unavailable
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 13. Checkpoint - Full application integration
  - Verify all frontend pages render correctly and communicate with backend
  - Verify CRUD operations work end-to-end (create, read, update, delete)
  - Verify dashboard charts update when campaign data changes
  - Verify trends page displays news articles and handles errors
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 14. Write API response structure and validation property tests
  - **Property 9: API response structure consistency** - For any successful campaign API response, verify JSON structure; for any error response, verify `detail` field exists
  - **Validates: Requirements 8.2**
  - **Property 10: Invalid JSON body returns 422** - For any malformed request body to POST/PUT endpoints, verify 422 status with error details
  - **Validates: Requirements 8.3**

- [x] 15. Final checkpoint - All tests pass and application is complete
  - Run all backend tests: `cd backend && pytest tests/ -v`
  - Verify the application runs correctly with both servers
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests use the `hypothesis` library and validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The backend uses SQLite in-memory for tests to avoid requiring a running PostgreSQL instance during testing
