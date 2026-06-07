"""In-memory state for local development and demos.

TODO: Replace this module with real database-backed repositories.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime

from app.models.domain import Assignment, Course, Feedback, Rubric, Submission


@dataclass
class InMemoryStore:
    """Small in-memory store that mimics a persistence layer for MVP demos."""

    courses: dict[int, Course] = field(default_factory=dict)
    assignments: dict[int, Assignment] = field(default_factory=dict)
    rubrics: dict[int, Rubric] = field(default_factory=dict)
    submissions: dict[int, Submission] = field(default_factory=dict)
    feedback: dict[int, Feedback] = field(default_factory=dict)
    course_seq: int = 1
    assignment_seq: int = 1
    rubric_seq: int = 1
    submission_seq: int = 1
    feedback_seq: int = 1
    started_at: datetime = field(default_factory=datetime.utcnow)


store = InMemoryStore()
