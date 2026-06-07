from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.database import get_db
from app.models.domain import Assignment, Enrollment, Grade, Submission, User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/teacher")
def teacher_dashboard(db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    total_assignments = db.query(func.count(Assignment.id)).join(Assignment.course).filter_by(teacher_id=teacher.id).scalar() or 0

    total_submissions = (
        db.query(func.count(Submission.id))
        .join(Assignment, Assignment.id == Submission.assignment_id)
        .join(Assignment.course)
        .filter_by(teacher_id=teacher.id)
        .scalar()
        or 0
    )

    graded_submissions = (
        db.query(func.count(Grade.id))
        .join(Submission, Submission.id == Grade.submission_id)
        .join(Assignment, Assignment.id == Submission.assignment_id)
        .join(Assignment.course)
        .filter_by(teacher_id=teacher.id)
        .scalar()
        or 0
    )

    return {
        "total_assignments": total_assignments,
        "total_submissions": total_submissions,
        "pending_reviews": max(total_submissions - graded_submissions, 0),
    }


@router.get("/student")
def student_dashboard(db: Session = Depends(get_db), student: User = Depends(require_role("student"))):
    active_assignments = (
        db.query(Assignment)
        .join(Enrollment, Enrollment.course_id == Assignment.course_id)
        .filter(Enrollment.student_id == student.id)
        .order_by(Assignment.id.desc())
        .limit(5)
        .all()
    )
    return {
        "active_assignments": [
            {"id": a.id, "title": a.title, "due_date": a.due_date, "description": a.description}
            for a in active_assignments
        ]
    }
