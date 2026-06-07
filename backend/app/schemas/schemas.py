from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: str = Field(pattern="^(student|teacher)$")
    id_number: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(min_length=6)


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    id_number: str | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)


class CourseCreate(BaseModel):
    name: str
    description: str = ""
    code: str


class CourseUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class AssignmentCreate(BaseModel):
    course_id: int
    title: str
    description: str
    rubric: list[dict[str, Any]] = Field(default_factory=list)
    due_date: str | None = None
    resources: str | None = None


class AssignmentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    rubric: list[dict[str, Any]] | None = None
    due_date: str | None = None
    resources: str | None = None


class SubmissionCreate(BaseModel):
    assignment_id: int
    content: str
    file_name: str | None = None


class SubmissionUpdate(BaseModel):
    content: str
    file_name: str | None = None


class GradeCreate(BaseModel):
    submission_id: int
    score: float
    status: str = "final"


class FeedbackCreate(BaseModel):
    submission_id: int
    comments: str
    plagiarism_report: str | None = None


class HintRequest(BaseModel):
    question: str
    student_context: str | None = None


class PlagiarismRequest(BaseModel):
    submission_text: str
    reference_texts: list[str] = Field(default_factory=list)


class AIDraftGradeRequest(BaseModel):
    submission_id: int


class NotificationRead(BaseModel):
    is_read: bool = True


class SubmissionOut(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    content: str
    file_name: str | None
    draft_feedback: str | None
    plagiarism_score: float | None
    created_at: datetime
