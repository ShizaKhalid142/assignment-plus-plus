from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.domain import Assignment, Submission
from app.schemas.schemas import GradeRequest
from app.services.grading_engine import grade_submission_with_ai

router = APIRouter(prefix="/grades", tags=["grades"])


@router.post("/ai")
def grade_submission(payload: GradeRequest, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == payload.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    rubric = json.loads(assignment.rubric) if assignment else []
    result = grade_submission_with_ai(submission.content, rubric)

    submission.grade = float(result.get("total_score", 0))
    submission.feedback = result.get("overall_feedback", "")
    db.commit()

    return result
