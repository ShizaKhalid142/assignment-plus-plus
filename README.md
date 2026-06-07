# Assignment++

Assignment++ is an AI-assisted assignment management and grading platform with a FastAPI backend and Next.js frontend.

## What is included

- Backend service layer architecture under `/backend/app`
- FastAPI endpoints for courses, assignments, submissions, grading, plagiarism checks, and hints
- PostgreSQL schema in `/backend/database/schema.sql`
- Frontend teacher and student portal pages under `/frontend/pages`
- Docker and docker-compose for local setup
- Docs: `SETUP.md`, `API.md`, and `ARCHITECTURE.md`

## Quick start

1. Backend
   - `cd backend`
   - `python -m venv .venv`
   - `source .venv/bin/activate` (Linux/macOS) or `.venv\Scripts\activate` (Windows)
   - `pip install -r requirements.txt`
   - `uvicorn main:app --reload`
2. Frontend
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## API overview

- `GET /`
- `GET /api/health`
- `POST /api/courses`
- `GET /api/courses`
- `GET /api/courses/{course_id}`
- `POST /api/assignments`
- `GET /api/assignments`
- `POST /api/submissions`
- `GET /api/submissions/{submission_id}`
- `POST /api/grade`
- `POST /api/plagiarism/check`
- `POST /api/hints`
