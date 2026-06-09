from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Feedback, Submission, User
from app.schemas.schemas import FeedbackCreate
from app.services.platform_services import FeedbackService

router = APIRouter(prefix="/feedback", tags=["feedback"])
feedback_service = FeedbackService()


@router.post("")
def add_feedback(payload: FeedbackCreate, db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    row = feedback_service.add_feedback(db, payload.submission_id, teacher.id, payload.comments, payload.plagiarism_report)
    return {"id": row.id, "message": "Feedback saved"}


@router.get("")
def list_my_feedback(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all feedback for the current user's submissions."""
    if current_user.role == "student":
        submissions = db.query(Submission).filter(Submission.student_id == current_user.id).all()
        submission_ids = [s.id for s in submissions]
        if not submission_ids:
            return []
        feedbacks = db.query(Feedback).filter(Feedback.submission_id.in_(submission_ids)).all()
        return [
            {
                "id": f.id,
                "submission_id": f.submission_id,
                "comments": f.comments,
                "plagiarism_report": f.plagiarism_report,
                "created_at": f.created_at,
            }
            for f in feedbacks
        ]
    elif current_user.role == "teacher":
        # Teachers see feedback they've given across all their courses
        feedbacks = db.query(Feedback).filter(Feedback.teacher_id == current_user.id).all()
        return [
            {
                "id": f.id,
                "submission_id": f.submission_id,
                "comments": f.comments,
                "plagiarism_report": f.plagiarism_report,
                "created_at": f.created_at,
            }
            for f in feedbacks
        ]
    return []


@router.get("/{submission_id}")
def get_feedback(submission_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    row = db.query(Feedback).filter(Feedback.submission_id == submission_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return {
        "id": row.id,
        "submission_id": row.submission_id,
        "comments": row.comments,
        "plagiarism_report": row.plagiarism_report,
    }
