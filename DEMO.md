# DEMO

## Run Backend
1. `python -m venv .venv && source .venv/bin/activate` (Windows: `.venv\\Scripts\\activate`)
2. `pip install -r backend/requirements.txt`
3. `cp backend/.env.example backend/.env`
4. `python backend/main.py`
5. Open `http://localhost:8000/docs`

## Run Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

## API Examples
- `GET /health`
- `GET /api/assignments`
- `POST /api/submissions`
- `POST /api/grades/ai`
- `POST /api/plagiarism/check`
- `POST /api/hints`

## Demo Flow
1. Open teacher assignment builder and create an assignment.
2. Submit work from student submission page.
3. Trigger AI grading in teacher grading page.
4. View grade and feedback on student feedback page.
