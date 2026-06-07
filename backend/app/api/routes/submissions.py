from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Submission, User
from app.schemas.schemas import SubmissionCreate, SubmissionOut, SubmissionUpdate
from app.services.hint_generator import generate_hint
from app.services.plagiarism_checker import check_plagiarism
from app.services.platform_services import SubmissionService

router = APIRouter(prefix="/submissions", tags=["submissions"])
submission_service = SubmissionService()


@router.post("")
def create_submission(payload: SubmissionCreate, db: Session = Depends(get_db), student: User = Depends(require_role("student"))):
    row = submission_service.submit(db, student.id, payload.assignment_id, payload.content, payload.file_name)
    return {"id": row.id, "message": "Submission saved"}


@router.get("")
def list_submissions(assignment_id: int | None = None, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    query = db.query(Submission).order_by(Submission.created_at.desc())
    if assignment_id is not None:
        query = query.filter(Submission.assignment_id == assignment_id)
    return query.all()


@router.get("/{id}")
def get_submission(id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    row = db.query(Submission).filter(Submission.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")
    return SubmissionOut.model_validate(row, from_attributes=True).model_dump()


@router.get("/{id}/plagiarism")
def get_plagiarism(id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    row = db.query(Submission).filter(Submission.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")
    references = [
        submission.content
        for submission in db.query(Submission)
        .filter(Submission.assignment_id == row.assignment_id, Submission.id != row.id)
        .all()
    ]
    report = check_plagiarism(row.content, references)
    row.plagiarism_score = float(report.get("similarity_score", 0))
    db.commit()
    return report


@router.post("/{id}/draft-feedback")
def draft_feedback(id: int, db: Session = Depends(get_db), _: User = Depends(require_role("student"))):
    row = db.query(Submission).filter(Submission.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")

    hint = generate_hint("How can I improve this assignment?", row.content)
    row.draft_feedback = hint.get("hint")
    db.commit()
    return {"submission_id": id, "draft_feedback": row.draft_feedback}


@router.put("/{id}")
def resubmit(id: int, payload: SubmissionUpdate, db: Session = Depends(get_db), _: User = Depends(require_role("student"))):
    row = db.query(Submission).filter(Submission.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")

    row.content = payload.content
    row.file_name = payload.file_name
    db.commit()
    db.refresh(row)
    return {"message": "Submission updated", "id": row.id}
