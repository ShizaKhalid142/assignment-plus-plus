from __future__ import annotations

from fastapi import APIRouter

from app.schemas.schemas import HintRequest
from app.services.hint_generator import generate_hint

router = APIRouter(prefix="/hints", tags=["hints"])


@router.post("")
def create_hint(payload: HintRequest):
    return generate_hint(payload.question, payload.student_context)
