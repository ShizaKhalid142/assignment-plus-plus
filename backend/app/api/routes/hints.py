"""Hint endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.state import store
from app.schemas.schemas import HintRequest, HintResponse
from app.services.hint_generator import HintGeneratorBot

router = APIRouter()
bot = HintGeneratorBot()


@router.post("/hints", response_model=HintResponse)
def get_hint(payload: HintRequest) -> HintResponse:
    assignment = store.assignments.get(payload.assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    hint = bot.generate_hint(assignment.title, payload.student_draft)
    return HintResponse(assignment_id=payload.assignment_id, hint=hint)
