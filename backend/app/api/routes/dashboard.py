from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.domain import Assignment, Submission

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/teacher")
def teacher_dashboard(db: Session = Depends(get_db)):
    total_assignments = db.query(func.count(Assignment.id)).scalar() or 0
    total_submissions = db.query(func.count(Submission.id)).scalar() or 0
    pending = db.query(func.count(Submission.id)).filter(Submission.grade.is_(None)).scalar() or 0
    return {
        "total_assignments": total_assignments,
        "total_submissions": total_submissions,
        "pending_reviews": pending,
    }


@router.get("/student")
def student_dashboard(db: Session = Depends(get_db)):
    assignments = db.query(Assignment).order_by(Assignment.id.desc()).limit(5).all()
    return {
        "active_assignments": [
            {"id": a.id, "title": a.title, "due_date": a.due_date, "description": a.description}
            for a in assignments
        ]
    }
