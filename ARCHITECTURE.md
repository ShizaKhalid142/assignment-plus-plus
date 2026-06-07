# ARCHITECTURE

## Backend
- FastAPI app in `backend/main.py` with CORS, logging, and global error handler.
- SQLAlchemy SQLite database via `backend/app/database.py`.
- Domain models in `backend/app/models/domain.py`.
- AI services:
  - `grading_engine.py`: OpenAI GPT grading with fallback heuristic.
  - `plagiarism_checker.py`: difflib + conceptual token overlap + optional external API.
  - `hint_generator.py`: Gemini hint generation with fallback template.
- Seed data initialized by `backend/database/init_db.py`.

## Frontend
- Next.js + Tailwind app in `frontend`.
- Shared components under `frontend/components`.
- Teacher and student pages under `frontend/pages/teacher` and `frontend/pages/student`.
- UI consumes backend endpoints on `http://localhost:8000/api`.

## Data Flow
1. Frontend submits JSON requests.
2. FastAPI routes validate payloads with Pydantic schemas.
3. Services execute AI/fallback logic.
4. SQLAlchemy persists assignment/submission data.
5. API returns structured JSON for dashboards and grading.
