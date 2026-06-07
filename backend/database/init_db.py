from __future__ import annotations

import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import Base, SessionLocal, engine
from app.models.domain import Assignment, Submission, User


def seed_sample_data() -> None:
    db = SessionLocal()
    try:
        if db.query(Assignment).count() > 0:
            return

        db.add_all(
            [
                User(name="Prof. Ada", email="ada@demo.edu", role="teacher"),
                User(name="Ali Student", email="ali@demo.edu", role="student"),
            ]
        )
        assignment = Assignment(
            title="Build REST API",
            description="Create endpoints for CRUD operations with validation.",
            rubric=json.dumps(
                [
                    {"criterion": "Correctness", "points": 40},
                    {"criterion": "Code Quality", "points": 35},
                    {"criterion": "Documentation", "points": 25},
                ]
            ),
            due_date="2026-06-20",
        )
        db.add(assignment)
        db.flush()

        db.add(
            Submission(
                assignment_id=assignment.id,
                student_name="Ali Student",
                content="Implemented FastAPI CRUD endpoints with pydantic validation and tests.",
                file_name="solution.py",
            )
        )
        db.commit()
    finally:
        db.close()


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    seed_sample_data()


if __name__ == "__main__":
    init_db()
    print("Database initialized with sample data.")
