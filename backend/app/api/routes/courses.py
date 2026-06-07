from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("")
def list_courses():
    return [
        {"id": 1, "name": "Intro to Python", "teacher": "Prof. Ada"},
        {"id": 2, "name": "Data Structures", "teacher": "Prof. Turing"},
    ]
