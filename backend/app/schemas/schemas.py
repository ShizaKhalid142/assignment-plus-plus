from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int | None = None


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = Field(pattern="^(student|teacher)$")
    id_number: str | None = None

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password has uppercase, lowercase, and digits"""
        import re
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'[0-9]', v):
            raise ValueError("Password must contain at least one digit")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password has uppercase, lowercase, and digits"""
        import re
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'[0-9]', v):
            raise ValueError("Password must contain at least one digit")
        return v


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    id_number: str | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password has uppercase, lowercase, and digits"""
        import re
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'[0-9]', v):
            raise ValueError("Password must contain at least one digit")
        return v


class CourseCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    code: str = Field(..., min_length=1, max_length=80)


class CourseUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class AssignmentCreate(BaseModel):
    course_id: int
    title: str = Field(..., min_length=1, max_length=255)
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


class RegisterStudentRequest(BaseModel):
    id_number: str


class AIFeedbackRequest(BaseModel):
    content: str


class SubmissionOut(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    content: str
    file_name: str | None
    draft_feedback: str | None
    plagiarism_score: float | None
    created_at: datetime
