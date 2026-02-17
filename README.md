# Campaign Tracker

A full-stack web application for creating, managing, and analyzing marketing campaigns. Built with **Next.js 14** (frontend) and **FastAPI** (backend), using **PostgreSQL via Supabase** for persistence.

Features:
- Full CRUD interface for marketing campaigns
- Interactive data visualization dashboard (Recharts)
- Trending news integration via NewsAPI
- Animated landing page with Framer Motion

<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/64456aec-5dea-4870-8289-64b5240a290d" />
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/99deffdc-65b5-46ee-b493-0db871fdd82f" />
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/736851e1-4d1a-4902-94e7-7b9035fe65d9" />
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/900f6361-1be4-4ab6-9ea9-449a42d9fb23" />



## Project Structure

```
├── backend/          # FastAPI + SQLAlchemy + Pydantic
│   ├── app/
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── routers/      # API route handlers
│   │   ├── services/     # Business logic layer
│   │   ├── database.py   # DB engine and session config
│   │   └── main.py       # FastAPI app entry point
│   └── tests/            # pytest + hypothesis tests
├── frontend/         # Next.js 14 + Tailwind CSS
│   └── src/
│       ├── app/          # App Router pages
│       ├── components/   # Reusable UI components
│       └── lib/          # API client, types, utilities
└── README.md
```

## Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL** database (recommended: [Supabase](https://supabase.com/) free tier)

## Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com/)
2. Go to **Project Settings → Database** and copy the connection string (URI format)
3. The connection string looks like:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
4. Tables are created automatically when the backend starts for the first time

## Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your values:
#   DATABASE_URL=postgresql://user:password@host:port/dbname
#   NEWS_API_KEY=your_newsapi_key_here
#   FRONTEND_URL=http://localhost:3000

# Run the development server
uvicorn app.main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.
API docs (Swagger UI) at **http://localhost:8000/docs**.

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Or create .env.local manually with:
#   NEXT_PUBLIC_API_URL=http://localhost:8000

# Run the development server
npm run dev
```

The frontend will be available at **http://localhost:3000**.

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                              | Example                                              |
|-----------------|------------------------------------------|------------------------------------------------------|
| `DATABASE_URL`  | PostgreSQL / Supabase connection string  | `postgresql://user:pass@host:6543/postgres`          |
| `NEWS_API_KEY`  | API key from [newsapi.org](https://newsapi.org/) | `abc123...`                                  |
| `FRONTEND_URL`  | Frontend origin for CORS                 | `http://localhost:3000`                              |

### Frontend (`frontend/.env.local`)

| Variable              | Description                  | Example                    |
|-----------------------|------------------------------|----------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL         | `http://localhost:8000`    |

## How to Test

### Running Backend Tests

```bash
cd backend
pytest tests/ -v
```

Tests use an in-memory SQLite database, so no running PostgreSQL instance is required.

### UI Flow — Campaign CRUD

1. Open **http://localhost:3000** and click the CTA to go to the Campaigns page
2. Click **Create Campaign** and fill in the form (name, budget, dates, status, platform, category)
3. Verify the new campaign appears in the list
4. Click a campaign to view its details
5. Edit the campaign and confirm changes are reflected
6. Delete the campaign and confirm it is removed from the list

### Reports & Visualization

1. Navigate to **http://localhost:3000/dashboard**
2. View summary metric cards (total campaigns, total budget, active count, average budget)
3. Review the status distribution pie chart, budget-by-category bar chart, and campaigns-over-time line chart
4. Add or modify campaigns and revisit the dashboard to see updated charts

### Third-Party API — Trending News

1. Navigate to **http://localhost:3000/trends**
2. Browse trending news articles displayed as cards
3. Use the search input to filter articles by keyword
4. If the NewsAPI key is missing or the API is unavailable, a user-friendly fallback message is shown

## Deployment Notes

- Set all environment variables in your hosting provider's configuration
- Build the frontend for production: `cd frontend && npm run build && npm start`
- Run the backend with a production ASGI server: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Ensure the `FRONTEND_URL` in the backend matches your deployed frontend origin for CORS
- Use a managed PostgreSQL instance (Supabase, AWS RDS, etc.) for production data

## License

This project is for educational and demonstration purposes.
