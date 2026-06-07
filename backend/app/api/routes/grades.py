"""Grading endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.state import store
from app.models.domain import Feedback
from app.schemas.schemas import GradeRequest, GradeResponse
from app.services.grading_engine import GradingEngine

router = APIRouter()
engine = GradingEngine()


@router.post("/grade", response_model=GradeResponse)
def grade_submission(payload: GradeRequest) -> GradeResponse:
    submission = store.submissions.get(payload.submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    assignment = store.assignments.get(submission.assignment_id)
    if not assignment or not assignment.rubric_id:
        raise HTTPException(status_code=400, detail="Assignment rubric not configured")

    rubric = store.rubrics.get(assignment.rubric_id)
    if not rubric:
        raise HTTPException(status_code=404, detail="Rubric not found")

    grade, rubric_scores, comments = engine.grade_submission(submission, rubric)
    submission.grade = grade

    feedback = Feedback(
        feedback_id=store.feedback_seq,
        submission_id=submission.submission_id,
        rubric_scores=rubric_scores,
        comments=comments,
    )
    store.feedback[feedback.feedback_id] = feedback
    store.feedback_seq += 1

    return GradeResponse(
        submission_id=submission.submission_id,
        grade=grade,
        rubric_scores=rubric_scores,
        comments=comments,
    )
