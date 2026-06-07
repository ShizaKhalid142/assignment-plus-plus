"""Submission endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.state import store
from app.models.domain import Submission
from app.schemas.schemas import SubmissionCreateRequest, SubmissionResponse

router = APIRouter()


@router.post("/submissions", response_model=SubmissionResponse)
def create_submission(payload: SubmissionCreateRequest) -> Submission:
    if payload.assignment_id not in store.assignments:
        raise HTTPException(status_code=404, detail="Assignment not found")

    submission = Submission(
        submission_id=store.submission_seq,
        assignment_id=payload.assignment_id,
        student_id=payload.student_id,
        file_path=payload.file_path,
        content=payload.content,
    )
    store.submissions[submission.submission_id] = submission
    store.submission_seq += 1
    return submission


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
def get_submission(submission_id: int) -> Submission:
    if submission_id not in store.submissions:
        raise HTTPException(status_code=404, detail="Submission not found")
    return store.submissions[submission_id]
