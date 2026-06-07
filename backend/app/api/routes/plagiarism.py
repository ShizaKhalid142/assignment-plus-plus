from __future__ import annotations

from fastapi import APIRouter

from app.schemas.schemas import PlagiarismRequest
from app.services.plagiarism_checker import check_plagiarism

router = APIRouter(prefix="/plagiarism", tags=["plagiarism"])


@router.post("/check")
def plagiarism_report(payload: PlagiarismRequest):
    return check_plagiarism(payload.submission_text, payload.reference_texts)
