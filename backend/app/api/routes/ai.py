from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.domain import Submission
from app.services.grading_engine import grade_submission_with_ai
from app.services.hint_generator import generate_hint

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/hints")
def ai_hints(payload: dict, _: dict = Depends(get_current_user)):
    question = str(payload.get("question", ""))
    context = payload.get("student_context")
    return generate_hint(question, context)


@router.post("/grade-draft")
def ai_grade_draft(payload: dict, db: Session = Depends(get_db), _: dict = Depends(get_current_user)):
    submission_id = int(payload.get("submission_id", 0))
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    rubric = []
    if submission.assignment and submission.assignment.rubric:
        rubric = [{"criterion": item.criterion, "points": item.points} for item in submission.assignment.rubric.criteria]
    return grade_submission_with_ai(submission.content, rubric)


@router.post("/feedback")
def ai_feedback(payload: dict, _: dict = Depends(get_current_user)):
    content = str(payload.get("content", ""))
    return {
        "feedback": "AI feedback draft generated.",
        "summary": "Work demonstrates progress. Clarify reasoning and add citations where needed.",
        "action_items": [
            "Map each solution section to a rubric criterion.",
            "Add one real-world example to strengthen argument.",
            "Proofread for concise technical writing.",
        ],
        "source_length": len(content),
    }
