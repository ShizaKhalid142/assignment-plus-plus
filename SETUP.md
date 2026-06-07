# Setup Guide

## Prerequisites
- Python 3.11+
- Node.js 20+
- Docker (optional)

## Local backend setup
1. `cd backend`
2. `python -m venv .venv`
3. Activate virtual environment.
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`

## Local frontend setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Docker setup
Run from repository root:

```bash
docker-compose up --build
```

Services:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379
