from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.domain import Assignment, Submission
from app.schemas.schemas import SubmissionCreate

router = APIRouter(prefix="/submissions", tags=["submissions"])


@router.get("")
def list_submissions(db: Session = Depends(get_db)):
    rows = db.query(Submission).order_by(Submission.created_at.desc()).all()
    return rows


@router.post("")
def create_submission(payload: SubmissionCreate, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == payload.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    row = Submission(
        assignment_id=payload.assignment_id,
        student_name=payload.student_name,
        content=payload.content,
        file_name=payload.file_name,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id, "message": "Submission saved"}
