# AGENTS.md — Assignment++

## Project Overview

Full-stack **AI-assisted assignment management & grading platform**. Backend: **FastAPI + SQLAlchemy + SQLite**. Frontend: **Next.js 16 (Pages Router) + TypeScript + Tailwind CSS**. JWT/Argon2 auth, role-based access (admin/teacher/student), AI grading (OpenAI GPT), hint generation (Google Gemini), plagiarism detection.

---

## Architecture

```
┌─ Frontend (Next.js / React 18) ─────────────────────────────────┐
│  apiFetch() ──► /api/* ──► FastAPI ──► Services ──► SQLAlchemy  │
│  lib/session.ts (localStorage JWT)           │                  │
│  Layout → Sidebar or Navigation              ▼                  │
└─────────────────────────────────  SQLite / PostgreSQL (planned) ─┘
```

- **Backend**: layered — `routes` (API) → `services` (business logic) → `models` (SQLAlchemy), with Pydantic `schemas` for validation and `deps.py` for auth dependency injection.
- **Frontend**: Pages Router (not App Router), Tailwind with custom navy palette (`navy-900: #001F54` … `navy-100: #e8f1ff`). `Layout` auto-detects role from pathname and renders `Sidebar` (teacher/student) or `Navigation` (public).

---

## Common Commands

```bash
# Backend
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
python backend/main.py                  # starts on :8000

# Frontend
npm --prefix frontend install
npm --prefix frontend run dev           # starts on :3000
npm --prefix frontend run build
npm --prefix frontend run lint          # next lint (no ESLint config exists)

# Docker
docker-compose up                       # both services
```

**Troubleshooting**: delete `assignment_plus_plus.db` to reset the database. If AI keys are missing, fallback logic activates automatically.

---

## Directory Structure

```
backend/
  main.py                   # FastAPI app, CORS, router mounting, /health
  run.py                    # Uvicorn runner (alt entry point)
  database/init_db.py       # create_all + seed demo data
  app/
    database.py             # SQLAlchemy engine + get_db dependency
    api/
      deps.py               # get_current_user, require_role, update_password
      routes/               # 12 route modules (auth, courses, assignments, etc.)
    core/
      config.py             # Settings dataclass (env vars) + get_settings()
      security.py           # Argon2 hashing + JWT create/decode
    models/domain.py        # 13 SQLAlchemy models (polymorphic User base)
    schemas/schemas.py      # Pydantic request/response models
    services/
      platform_services.py  # CourseService, AssignmentService, SubmissionService, etc.
      grading_engine.py     # OpenAI GPT grading + heuristic fallback
      hint_generator.py     # Gemini hints + template fallback
      plagiarism_checker.py # difflib + conceptual overlap detection

frontend/
  .env.local                # NEXT_PUBLIC_API_BASE_URL (overrides default)
  lib/
    api.ts                  # apiFetch<T>() + typed API modules (authApi, coursesApi, …)
    session.ts              # localStorage auth (setAuth, getToken, getUser, getRole, …)
  components/               # Layout, Navigation, Sidebar, Cards, Forms, Spinner, etc.
  pages/
    index.tsx               # Landing page
    _app.tsx                # Wraps all pages in Layout + globals.css
    auth/                   # login, signup, forgot-password
    admin/dashboard.tsx
    teacher/                # dashboard, courses, assignments, grading, analytics, settings, …
    student/                # dashboard, courses, assignments, submit, feedback, settings, …
```

---

## Backend Conventions

- **Every file** starts with `from __future__ import annotations`.
- **Config**: pure-dataclass `Settings` in `core/config.py`, accessed via `@lru_cache`'d `get_settings()`. CORS origins auto-detect hostname/IP in dev.
- **Routes**: each domain has an `APIRouter(prefix="/...")` in `routes/`, mounted in `main.py` under `/api`.
- **Auth**: inject via `Depends(get_current_user)` or `Depends(require_role("teacher"))`. Token decoding done in `deps.py`.
- **Services**: instantiated at module level (`auth_service = AuthenticationService()`), methods take `db: Session` as first arg, raise `HTTPException` for errors.
- **Models** use SQLAlchemy 2.0 `Mapped`/`mapped_column` style with polymorphic User inheritance (`User → Student, Teacher`). Timestamps use `datetime.now(timezone.utc)`.
- **Schemas** use Pydantic v2 with `field_validator` for password strength (uppercase + lowercase + digit required, min 8 chars).
- **Naming**: `snake_case` throughout. Tables plural (`users`, `courses`, `submissions`).

---

## Frontend Conventions

- **API calls**: all go through `lib/api.ts`'s `apiFetch<T>(path, options)`. Token is auto-attached from localStorage key `assignmentpp_token`. Each API domain has a named export (`authApi`, `coursesApi`, `assignmentsApi`, `submissionsApi`, `gradesApi`, `feedbackApi`, `notificationsApi`, `aiApi`, `dashboardApi`). **Add new endpoints here**, not inline fetch calls.
- **Auth state**: via `lib/session.ts` — stores `assignmentpp_token`, `assignmentpp_user`, `assignmentpp_role` in localStorage.
- **Layout**: `pages/_app.tsx` wraps everything in `<Layout>`. Layout auto-detects role from pathname (`/teacher/*`, `/student/*`) and renders `Sidebar` + `NotificationBar`; otherwise renders `Navigation`.
- **Pages**: default-export the page component. Each page file lives in `pages/<role>/<name>.tsx`. Use `useState` + `useEffect` for data fetching (no data-fetching library).
- **Styling**: Tailwind utility classes only. Custom navy palette in `tailwind.config.js`. No CSS modules or styled-components.
- **Components**: React functional components with default exports, no barrel file — import directly from `../components/ComponentName`.
- **Environment**: `process.env.NEXT_PUBLIC_API_BASE_URL` for the backend URL. TypeScript strict mode enabled.

---

## Database

- **Engine**: SQLite (`assignment_plus_plus.db`) with `check_same_thread=False`; PostgreSQL planned.
- **Models** (13 tables): `users` (polymorphic base), `students`, `teachers`, `courses`, `enrollments`, `assignments`, `rubrics`, `rubric_criteria`, `submissions`, `grades`, `feedback`, `submission_policies`, `grading_policies`, `notifications`, `password_reset_tokens`.
- **Seeding**: `database/init_db.py` runs on startup, creates demo data if DB is empty.
- **No migrations yet** — Alembic planned. Currently `create_all()` on startup.

---

## AI Services

| Service | File | Provider | Fallback |
|---------|------|----------|----------|
| Grading | `grading_engine.py` | OpenAI GPT-4o-mini | Length-based heuristic |
| Hints | `hint_generator.py` | Google Gemini | Hardcoded templates |
| Plagiarism | `plagiarism_checker.py` | difflib + Jaccard overlap | N/A (external API optional) |

All services tolerate missing API keys and degrade gracefully.

---

## Authentication

- **Hash**: Argon2 via `passlib[bcrypt]`.
- **JWT**: `python-jose` HS256, 120-min expiry, payload = `{sub: user_id, role: ..., exp: ...}`.
- **Flow**: `POST /api/auth/login` → returns `{access_token, token_type, user, role}`. Frontend stores token in localStorage. All subsequent requests include `Authorization: Bearer <token>` automatically via `apiFetch`.
- **Guards**: `get_current_user` (401 if no/invalid token), `require_role("teacher")` (403 if wrong role).
- **Guest**: `POST /api/auth/guest` creates a temporary student session.

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@assignmentpp.com | Admin123 |
| Teacher | teacher@assignmentpp.com | Teacher123 |
| Student | student@assignmentpp.com | Student123 |
| Guest | N/A (use Guest button) | None |

---

## Current Project State

- **~35% complete**. Foundation is solid — auth, DB, AI services, API routes (40+ endpoints), basic UI shell all work.
- **Ready**: auth flow, landing page, admin dashboard, API docs at `/docs`.
- **In progress**: teacher/student page enhancements, pagination, file upload integration.
- **Missing**: tests (none exist — no pytest/jest config), CI/CD, Alembic migrations, production PostgreSQL, rate limiting, search.

---

## Key Files Reference

| What | Where |
|------|-------|
| App entry | `backend/main.py` |
| DB models | `backend/app/models/domain.py` |
| Auth deps | `backend/app/api/deps.py` |
| Config/env | `backend/app/core/config.py` |
| JWT + hashing | `backend/app/core/security.py` |
| API schemas | `backend/app/schemas/schemas.py` |
| Route registry | `backend/app/api/routes/__init__.py` |
| Seed data | `backend/database/init_db.py` |
| Frontend API lib | `frontend/lib/api.ts` |
| Frontend session | `frontend/lib/session.ts` (imported as `../lib/auth` in some files) |
| Layout logic | `frontend/components/Layout.tsx` |
| Tailwind theme | `frontend/tailwind.config.js` |
| Docker orchestration | `docker-compose.yml` |

---

## Important Patterns

- **Add a new API endpoint**: create/update route in `backend/app/api/routes/`, add Pydantic schema if needed, call service method, register router in `main.py`, and add the typed wrapper to `frontend/lib/api.ts`.
- **Add a new page**: create `pages/<role>/<name>.tsx`, default-export the component, use `apiFetch`/API module functions for data, Tailwind for styling. Layout/role routing is automatic.
- **Auth check in pages**: use `lib/session.ts` functions (`isAuthenticated`, `getRole`, etc.) client-side; use `Deps(get_current_user)` server-side.
- **No `.github/`, no test framework, no lint/format config** — don't expect these to exist; add them if needed but follow Python/TS community standards.
