"""Core domain models for Assignment++.

These classes represent business entities and keep domain terms explicit and
beginner-friendly.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal


Role = Literal["teacher", "student", "admin"]


@dataclass
class User:
    """Base user entity shared by all roles in the platform."""

    user_id: int
    email: str
    name: str
    role: Role
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class Teacher(User):
    """Teacher user with optional teaching specialties."""

    specialties: list[str] = field(default_factory=list)


@dataclass
class Student(User):
    """Student user with optional enrollment metadata."""

    enrolled_course_ids: list[int] = field(default_factory=list)


@dataclass
class Course:
    """Course managed by a teacher."""

    course_id: int
    title: str
    teacher_id: int
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class RubricCriterion:
    """One scoring criterion inside a rubric."""

    criterion_id: int
    name: str
    max_points: float
    description: str


@dataclass
class Rubric:
    """Rubric used to grade an assignment."""

    rubric_id: int
    assignment_id: int
    title: str
    total_points: float
    criteria: list[RubricCriterion] = field(default_factory=list)


@dataclass
class Assignment:
    """Assignment linked to a course and optionally a rubric."""

    assignment_id: int
    course_id: int
    title: str
    description: str
    due_date: datetime
    rubric_id: int | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class Submission:
    """Student submission containing original content and grading metadata."""

    submission_id: int
    assignment_id: int
    student_id: int
    file_path: str | None
    content: str
    submitted_at: datetime = field(default_factory=datetime.utcnow)
    grade: float | None = None
    plagiarism_score: float | None = None


@dataclass
class Feedback:
    """Feedback generated after grading a submission."""

    feedback_id: int
    submission_id: int
    rubric_scores: dict[str, float]
    comments: str
    created_at: datetime = field(default_factory=datetime.utcnow)
