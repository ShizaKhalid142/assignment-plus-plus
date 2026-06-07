# Architecture

## Backend

- `app/models/domain.py`: domain entities (User, Teacher, Student, Course, Assignment, Submission, Rubric, Feedback)
- `app/schemas/schemas.py`: API contracts via Pydantic models
- `app/services/`: business logic layer
  - `grading_engine.py`
  - `plagiarism_checker.py`
  - `hint_generator.py`
  - `auth_service.py`
  - `analytics_engine.py`
- `app/api/routes/`: endpoint modules grouped by concern
- `app/database/connection.py`: database session placeholder

## Frontend

- `pages/teacher/*`: teacher flows (dashboard, assignments, builder, grading)
- `pages/student/*`: student flows (dashboard, assignments, submission, feedback)
- `components/*`: reusable UI pieces

## TODOs for AI/ML integration

- Replace heuristic grading with LLM-assisted rubric scoring
- Replace difflib plagiarism checks with ML/vector + web checks
- Replace static hints with adaptive tutoring prompts
- Add secure authentication (JWT/OAuth2)
- Add persistent analytics with trend reporting
