# QUICK START

1. Install backend deps: `pip install -r backend/requirements.txt`
2. Copy env: `cp backend/.env.example backend/.env`
3. Start backend: `python backend/main.py`
4. Install frontend deps: `npm --prefix frontend install`
5. Start frontend: `npm --prefix frontend run dev`

## Troubleshooting
- If AI keys are missing, fallback logic is used automatically.
- If port 8000/3000 is busy, stop existing process and retry.
- Reset local DB by deleting `assignment_plus_plus.db` and restarting backend.
