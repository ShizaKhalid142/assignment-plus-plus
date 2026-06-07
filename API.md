# API Documentation

## Health
- `GET /` → basic health check
- `GET /api/health` → API status

## Courses
- `POST /api/courses`
- `GET /api/courses`
- `GET /api/courses/{course_id}`

## Assignments
- `POST /api/assignments`
- `GET /api/assignments`

## Submissions
- `POST /api/submissions`
- `GET /api/submissions/{submission_id}`

## Grading
- `POST /api/grade`

## Plagiarism
- `POST /api/plagiarism/check`

## Hints
- `POST /api/hints`

See `/backend/app/schemas/schemas.py` for request and response payload structures.
