from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Feedback, User
from app.schemas.schemas import FeedbackCreate
from app.services.platform_services import FeedbackService

router = APIRouter(prefix="/feedback", tags=["feedback"])
feedback_service = FeedbackService()


@router.post("")
def add_feedback(payload: FeedbackCreate, db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    row = feedback_service.add_feedback(db, payload.submission_id, teacher.id, payload.comments, payload.plagiarism_report)
    return {"id": row.id, "message": "Feedback saved"}


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
