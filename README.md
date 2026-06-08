# Assignment++

**AI-Assisted Assignment Management & Grading Platform**

A full-stack platform that streamlines the assignment lifecycle — from creation and submission to AI-powered grading, feedback, and plagiarism detection. Built for educators and students who want a faster, smarter grading workflow.

---

## Features

### For Teachers
- Create and manage courses with unique course codes
- Build assignments with custom rubrics (multi-criterion grading)
- Register students by ID number into courses
- AI-powered grading (OpenAI GPT) with rubric-aware scoring
- Plagiarism detection across submissions (text similarity + conceptual overlap)
- Grade and feedback management per submission
- Dashboard analytics: submission stats, pending reviews, grade distributions

### For Students
- Browse and enroll in courses
- Submit assignments with file upload support
- Get AI-generated hints on assignment questions (Google Gemini)
- View grades, rubric breakdowns, and teacher feedback
- Submission history and draft feedback requests
- Personal dashboard with active assignments and deadlines

### For Admins
- System-wide statistics: total users, courses, submissions
- User listing and course summary views
- Role-protected admin panel

### Platform
- Role-based access control (admin / teacher / student)
- Guest access for preview without commitment
- Secure authentication (Argon2 password hashing + JWT tokens)
- Password reset flow with DB-backed tokens
- Responsive navy blue theme — works on mobile and desktop
- Docker-ready deployment

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **Database** | SQLite (dev), SQLAlchemy 2.0 ORM |
| **Auth** | JWT (python-jose) + Argon2 (passlib) |
| **AI Grading** | OpenAI GPT-4o-mini (+ heuristic fallback) |
| **AI Hints** | Google Gemini 1.5 Flash (+ template fallback) |
| **Plagiarism** | difflib SequenceMatcher + Jaccard token overlap |
| **Frontend** | React 18, Next.js 16 (Pages Router), TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 (custom navy palette) |
| **Deployment** | Docker, Docker Compose |

---

## Quick Start

### Prerequisites
- Python 3.10+ and Node.js 18+
- (Optional) Docker for containerized setup

### 1. Backend Setup

```bash
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
python backend/main.py
```

Backend starts at **http://localhost:8000** — API docs at **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

Frontend starts at **http://localhost:3000**

### 3. Docker (Alternative)

```bash
docker-compose up
```

Both services start; backend on `:8000`, frontend on `:3000`.

### 4. Multi-Device Access

From another device on your network, replace `localhost` with your computer's IP address. CORS origins auto-detect hostname/IP in development mode — no manual configuration needed.

---

## Architecture

```
┌─ Frontend (Next.js / React 18) ─────────────────────────────────┐
│  apiFetch() ──► /api/* ──► FastAPI ──► Services ──► SQLAlchemy  │
│  lib/session.ts (localStorage JWT)           │                  │
│  Layout → Sidebar or Navigation              ▼                  │
└─────────────────────────────────  SQLite / PostgreSQL (planned) ─┘
```

### Backend Layers
- **Routes** (`backend/app/api/routes/`) — 12 route modules, each an `APIRouter` with domain-specific prefix
- **Services** (`backend/app/services/`) — business logic, AI grading engine, plagiarism checker, hint generator
- **Models** (`backend/app/models/domain.py`) — 13 SQLAlchemy models with polymorphic User inheritance
- **Schemas** (`backend/app/schemas/schemas.py`) — Pydantic v2 request/response validation
- **Auth** (`backend/app/api/deps.py`) — dependency injection for `get_current_user` and `require_role()`

### Frontend Flow
- `pages/_app.tsx` wraps all pages in `<Layout>`
- `Layout.tsx` auto-detects role from pathname (`/teacher/*`, `/student/*`) and renders `Sidebar` + `NotificationBar`
- All API calls go through `lib/api.ts`'s `apiFetch<T>()` — token auto-attached from localStorage
- Auth state managed via `lib/session.ts`

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@assignmentpp.com | Admin123 |
| **Teacher** | teacher@assignmentpp.com | Teacher123 |
| **Student** | student@assignmentpp.com | Student123 |
| **Guest** | Click "Guest" on login page | None |

Database is auto-seeded with demo data on first startup. Delete `assignment_plus_plus.db` and restart to reset.

---

## API Endpoints

All endpoints prefixed with `/api`. Full interactive docs at `http://localhost:8000/docs`.

| Module | Prefix | Key Endpoints |
|--------|--------|---------------|
| Auth | `/api/auth` | register, login, logout, guest, forgot-password, reset-password, profile, change-password |
| Courses | `/api/courses` | CRUD, enroll, register-student, students list, analytics |
| Assignments | `/api/assignments` | CRUD with rubric management |
| Submissions | `/api/submissions` | CRUD, plagiarism check, draft feedback |
| Grades | `/api/grades` | Create/update grades, AI grading |
| Feedback | `/api/feedback` | Create/get feedback per submission |
| Notifications | `/api/notifications` | List, mark-read, delete |
| Dashboard | `/api/dashboard` | Teacher and student stats |
| AI | `/api/ai` | Hints, grade-draft, feedback generation |
| Plagiarism | `/api/plagiarism` | Check submission similarity |
| Hints | `/api/hints` | Standalone hint generation |
| Admin | `/api/admin` | Stats, user listing, course summary |

---

## Project Structure

```
backend/
  main.py                         FastAPI app entry, CORS, router mounting, /health
  run.py                          Uvicorn runner
  requirements.txt                Python dependencies
  .env.example                    Environment template
  database/init_db.py             DB creation + demo data seeding
  app/
    database.py                   Engine + get_db dependency
    api/
      deps.py                     get_current_user, require_role, update_password
      routes/                     12 route modules (auth, courses, assignments, …)
    core/
      config.py                   Settings dataclass + device-aware CORS
      security.py                 Argon2 hashing + JWT create/decode
    models/domain.py              13 SQLAlchemy models
    schemas/schemas.py            Pydantic request/response models
    services/
      authentication_service.py   Registration + login logic
      grading_engine.py           OpenAI GPT grading + heuristic fallback
      hint_generator.py           Gemini hints + template fallback
      plagiarism_checker.py       difflib + conceptual overlap detection
      platform_services.py        Course, Assignment, Submission, Grade, etc. services

frontend/
  .env.local                      Client-side API base URL
  styles/globals.css              Tailwind base + shared utility classes
  lib/
    api.ts                        Centralized fetch wrapper + typed API modules
    session.ts                    localStorage-based auth state management
  components/
    Layout.tsx                    Adaptive layout (Sidebar for roles, Navigation for public)
    Navigation.tsx                Sticky navbar with auth-aware links
    Sidebar.tsx                   Role-specific sidebar navigation
    NotificationBar.tsx           Notification drop-down
    AssignmentCard.tsx            Assignment display card
    CourseCard.tsx                Course display card
    SubmissionCard.tsx            Submission display card
    FeedbackCard.tsx              Feedback display card
    DashboardStats.tsx            Stats cards
    GradeDisplay.tsx              Grade/rubric breakdown
    RubricDisplay.tsx             Rubric criteria display
    FileUpload.tsx                File upload component
    SubmissionForm.tsx            Assignment submission form
    LoadingSpinner.tsx            Loading indicator
  pages/
    _app.tsx                      App wrapper
    index.tsx                     Landing page
    auth/                         login, signup, forgot-password
    admin/dashboard.tsx           Admin statistics
    teacher/                      dashboard, courses, assignments, grading, analytics, settings, …
    student/                      dashboard, courses, assignments, submit, feedback, settings, …
```

---

## AI Services

All AI services degrade gracefully when API keys are missing — no crashes, no broken workflows.

| Service | Provider | File | Fallback Behavior |
|---------|----------|------|-------------------|
| **Grading** | OpenAI GPT-4o-mini | `grading_engine.py` | Length-based heuristic scoring |
| **Hints** | Google Gemini 1.5 Flash | `hint_generator.py` | Pre-written templates per question type |
| **Plagiarism** | difflib + Jaccard overlap | `plagiarism_checker.py` | Built-in; optional external API |

---

## Authentication Flow

1. `POST /api/auth/login` with email + password
2. Backend verifies Argon2 hash, creates JWT (`HS256`, 120-min expiry)
3. Response: `{access_token, token_type, user, role}`
4. Frontend stores token in localStorage (`assignmentpp_token`)
5. All subsequent requests include `Authorization: Bearer <token>` automatically via `apiFetch()`
6. Refresh, logout, profile update, and password change supported

**Password requirements**: 8+ characters, 1 uppercase, 1 lowercase, 1 digit.

---

## Running Commands

```bash
# Backend
pip install -r backend/requirements.txt     # Install Python deps
cp backend/.env.example backend/.env         # Create env file
python backend/main.py                       # Start backend (:8000)
python backend/run.py                        # Start backend (alt with auto-reload)

# Frontend
npm --prefix frontend install                # Install Node deps
npm --prefix frontend run dev                # Start dev server (:3000)
npm --prefix frontend run build              # Production build
npm --prefix frontend run lint               # Lint check

# Docker
docker-compose up                            # Start both services
docker-compose down                          # Stop both services

# Troubleshooting
rm assignment_plus_plus.db                   # Reset database (re-seeds on restart)
```

---

## Current State

**~35% complete** — foundation is solid and production-ready in core areas.

**Working fully**: auth (register/login/JWT/Argon2/password-reset), 12 API route modules (40+ endpoints), AI grading/hints/plagiarism, role-based access control, admin dashboard, landing page, Docker deployment, multi-device CORS.

**In progress**: teacher/student page enhancements, pagination on list endpoints, file upload integration, real-time notifications.

**Planned**: test suite (pytest + Jest), Alembic database migrations, PostgreSQL support, CI/CD pipeline, rate limiting, search, linting/formatting config.

---

## License

MIT — see [LICENSE](LICENSE) for details.

**Author**: Shiza Khalid Khalid (2026)
