from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Submission, User
from app.schemas.schemas import SelfCheckRequest, SubmissionCreate, SubmissionOut, SubmissionUpdate
from app.services.hint_generator import generate_hint
from app.services.plagiarism_checker import check_plagiarism
from app.services.platform_services import SubmissionService

router = APIRouter(prefix="/submissions", tags=["submissions"])
submission_service = SubmissionService()


@router.post("")
def create_submission(
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
    student: User = Depends(require_role("student"))
):
    """Create a new submission"""
    row = submission_service.submit(db, student.id, payload.assignment_id, payload.content, payload.file_name)
    return {"id": row.id, "message": "Submission saved successfully"}


@router.get("")
def list_submissions(
    assignment_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List submissions (filtered by role)"""
    query = db.query(Submission).order_by(Submission.created_at.desc())
    
    # Students can only see their own submissions
    if current_user.role == "student":
        query = query.filter(Submission.student_id == current_user.id)
    
    if assignment_id is not None:
        query = query.filter(Submission.assignment_id == assignment_id)
    
    return [SubmissionOut.model_validate(s, from_attributes=True).model_dump() for s in query.all()]


# ── MUST be before /{id} routes to avoid path collision ──

@router.post("/self-check")
def self_check_plagiarism(
    payload: SelfCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Check a draft/unsaved text for plagiarism before submitting."""
    references = [
        submission.content
        for submission in db.query(Submission)
        .filter(Submission.assignment_id == payload.assignment_id, Submission.student_id != current_user.id)
        .all()
    ]
    report = check_plagiarism(payload.content, references)
    return {
        "plagiarism_score": report.get("plagiarism_score", 0),
        "risk_level": report.get("risk_level", "low"),
        "summary": report.get("summary", ""),
        "message": "This is a self-check — the result is not stored. Submit with confidence!" if report.get("plagiarism_score", 0) < 40 else "Consider revising your work to reduce similarity before submitting.",
    }


@router.get("/{id}")
def get_submission(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific submission"""
    row = db.query(Submission).filter(Submission.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Check permissions: teacher of course or student who submitted
    if current_user.role == "student" and row.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot access this submission")
    
    return SubmissionOut.model_validate(row, from_attributes=True).model_dump()


@router.get("/{id}/plagiarism")
def get_plagiarism(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check plagiarism for a submission (teacher: full; student: self-check only)"""
    row = db.query(Submission).filter(Submission.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Students can only check their own work
    if current_user.role == "student":
        if row.student_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only check your own submissions")
        return _check_plagiarism_for_submission(row, db, store_result=False)
    
    # Teacher can check any
    return _check_plagiarism_for_submission(row, db, store_result=True)


def _check_plagiarism_for_submission(row: Submission, db: Session, store_result: bool = True) -> dict:
    """Internal helper for plagiarism checking."""
    references = [
        submission.content
        for submission in db.query(Submission)
        .filter(Submission.assignment_id == row.assignment_id, Submission.id != row.id)
        .all()
    ]
    
    report = check_plagiarism(row.content, references)
    if store_result:
        row.plagiarism_score = float(report.get("plagiarism_score", 0))
        db.commit()
    return report


@router.post("/{id}/draft-feedback")
def draft_feedback(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate AI draft feedback for a submission"""
    row = db.query(Submission).filter(Submission.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Students can generate feedback for their own submissions
    # Teachers can generate for any submission
    if current_user.role == "student" and row.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only generate feedback for your own submissions")

    hint = generate_hint("How can I improve this assignment?", row.content)
    row.draft_feedback = hint.get("hint")
    db.commit()
    return {"submission_id": id, "draft_feedback": row.draft_feedback}


@router.put("/{id}")
def resubmit(
    id: int,
    payload: SubmissionUpdate,
    db: Session = Depends(get_db),
    student: User = Depends(require_role("student"))
):
    """Update/resubmit a submission"""
    row = db.query(Submission).filter(Submission.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Ensure student can only update their own submissions
    if row.student_id != student.id:
        raise HTTPException(status_code=403, detail="You can only update your own submissions")

    row.content = payload.content
    row.file_name = payload.file_name
    db.commit()
    db.refresh(row)
    return {"message": "Submission updated successfully", "id": row.id}
