from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AssignmentCreate(BaseModel):
    title: str
    description: str
    rubric: list[dict[str, Any]] = Field(default_factory=list)
    due_date: str | None = None


class AssignmentOut(BaseModel):
    id: int
    title: str
    description: str
    rubric: list[dict[str, Any]]
    due_date: str | None = None


class SubmissionCreate(BaseModel):
    assignment_id: int
    student_name: str
    content: str
    file_name: str | None = None


class SubmissionOut(BaseModel):
    id: int
    assignment_id: int
    student_name: str
    content: str
    file_name: str | None = None
    grade: float | None = None
    feedback: str | None = None
    created_at: datetime


class GradeRequest(BaseModel):
    submission_id: int


class PlagiarismRequest(BaseModel):
    submission_text: str
    reference_texts: list[str] = Field(default_factory=list)


class HintRequest(BaseModel):
    question: str
    student_context: str | None = None
