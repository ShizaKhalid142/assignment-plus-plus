"""Pydantic request and response schemas.

These schemas validate API payloads and define response contracts.
"""

from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    user_id: int
    email: EmailStr
    name: str
    role: str
    created_at: datetime


class CourseCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    teacher_id: int = Field(gt=0)


class CourseResponse(BaseModel):
    course_id: int
    title: str
    teacher_id: int
    created_at: datetime


class RubricCriterionRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    max_points: float = Field(gt=0)
    description: str = Field(default="", max_length=500)


class RubricRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    total_points: float = Field(gt=0)
    criteria: list[RubricCriterionRequest] = Field(default_factory=list)


class RubricResponse(BaseModel):
    rubric_id: int
    assignment_id: int
    title: str
    total_points: float
    criteria: list[RubricCriterionRequest]


class AssignmentCreateRequest(BaseModel):
    course_id: int = Field(gt=0)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    due_date: datetime
    rubric: RubricRequest | None = None


class AssignmentResponse(BaseModel):
    assignment_id: int
    course_id: int
    title: str
    description: str
    due_date: datetime
    rubric_id: int | None
    created_at: datetime


class SubmissionCreateRequest(BaseModel):
    assignment_id: int = Field(gt=0)
    student_id: int = Field(gt=0)
    content: str = Field(min_length=1)
    file_path: str | None = None


class SubmissionResponse(BaseModel):
    submission_id: int
    assignment_id: int
    student_id: int
    file_path: str | None
    content: str
    submitted_at: datetime
    grade: float | None
    plagiarism_score: float | None


class GradeRequest(BaseModel):
    submission_id: int = Field(gt=0)


class GradeResponse(BaseModel):
    submission_id: int
    grade: float
    rubric_scores: dict[str, float]
    comments: str


class PlagiarismCheckRequest(BaseModel):
    submission_id: int = Field(gt=0)


class PlagiarismCheckResponse(BaseModel):
    submission_id: int
    plagiarism_score: float
    matching_submission_ids: list[int]


class HintRequest(BaseModel):
    assignment_id: int = Field(gt=0)
    student_draft: str = Field(min_length=1)


class HintResponse(BaseModel):
    assignment_id: int
    hint: str


class ErrorResponse(BaseModel):
    detail: str
