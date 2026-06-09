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


class SelfCheckRequest(BaseModel):
    content: str
    assignment_id: int


# ── Submission Policy Schemas ──

class SubmissionPolicyCreate(BaseModel):
    assignment_id: int
    allowed_resources: str = "Course notes"
    hint_only_mode: bool = True
    citation_required: bool = True


class SubmissionPolicyUpdate(BaseModel):
    allowed_resources: str | None = None
    hint_only_mode: bool | None = None
    citation_required: bool | None = None


class SubmissionPolicyOut(BaseModel):
    id: int
    assignment_id: int
    allowed_resources: str
    hint_only_mode: bool
    citation_required: bool


# ── Grading Policy / Feedback Template Schemas ──

class GradingPolicyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    feedback_template: str = ""
    late_penalty_percent: int = 0


class GradingPolicyUpdate(BaseModel):
    name: str | None = None
    feedback_template: str | None = None
    late_penalty_percent: int | None = None


class GradingPolicyOut(BaseModel):
    id: int
    name: str
    feedback_template: str
    late_penalty_percent: int


class ApplyTemplateRequest(BaseModel):
    grading_policy_id: int
    submission_id: int


# ── Peer Review Schemas ──

class PeerReviewCreate(BaseModel):
    submission_id: int
    reviewer_id: int
    score: float
    comments: str = ""


class PeerReviewOut(BaseModel):
    id: int
    submission_id: int
    reviewer_id: int
    score: float
    comments: str
    created_at: datetime


# ── Bulk Export Schemas ──

class ExportRequest(BaseModel):
    course_id: int
    format: str = "csv"  # csv, excel, or json


class SubmissionOut(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    content: str
    file_name: str | None
    draft_feedback: str | None
    plagiarism_score: float | None
    created_at: datetime
