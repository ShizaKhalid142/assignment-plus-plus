from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Grade, Submission, User
from app.schemas.schemas import GradeCreate
from app.services.grading_engine import grade_submission_with_ai
from app.services.platform_services import GradingService

router = APIRouter(prefix="/grades", tags=["grades"])
grading_service = GradingService()


@router.post("")
def create_or_update_grade(payload: GradeCreate, db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    row = grading_service.grade(db, payload.submission_id, teacher.id, payload.score, payload.status)
    return {"id": row.id, "message": "Grade saved"}


@router.get("/{submission_id}")
def get_grade(submission_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    row = db.query(Grade).filter(Grade.submission_id == submission_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Grade not found")
    return {"id": row.id, "submission_id": row.submission_id, "score": row.score, "status": row.status}


@router.post("/ai")
def grade_submission_ai(payload: dict, db: Session = Depends(get_db), _: User = Depends(require_role("teacher"))):
    submission_id = int(payload.get("submission_id", 0))
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    rubric = []
    if submission.assignment and submission.assignment.rubric:
        rubric = [{"criterion": item.criterion, "points": item.points} for item in submission.assignment.rubric.criteria]

    return grade_submission_with_ai(submission.content, rubric)
