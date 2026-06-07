"""Plagiarism endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.state import store
from app.schemas.schemas import PlagiarismCheckRequest, PlagiarismCheckResponse
from app.services.plagiarism_checker import PlagiarismChecker

router = APIRouter()
checker = PlagiarismChecker()


@router.post("/plagiarism/check", response_model=PlagiarismCheckResponse)
def check_plagiarism(payload: PlagiarismCheckRequest) -> PlagiarismCheckResponse:
    target = store.submissions.get(payload.submission_id)
    if not target:
        raise HTTPException(status_code=404, detail="Submission not found")

    score, matching_ids = checker.check_submission(target, list(store.submissions.values()))
    target.plagiarism_score = score

    return PlagiarismCheckResponse(
        submission_id=target.submission_id,
        plagiarism_score=score,
        matching_submission_ids=matching_ids,
    )
