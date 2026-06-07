from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    id_number: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False
    )

    notifications: Mapped[list[Notification]] = relationship(back_populates="user", cascade="all,delete")

    __mapper_args__ = {"polymorphic_on": role, "polymorphic_identity": "user"}


class Student(User):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)

    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="student", cascade="all,delete")

    __mapper_args__ = {"polymorphic_identity": "student"}


class Teacher(User):
    __tablename__ = "teachers"

    id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)

    courses: Mapped[list[Course]] = relationship(back_populates="teacher", cascade="all,delete")

    __mapper_args__ = {"polymorphic_identity": "teacher"}


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    code: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("teachers.id"), nullable=False)

    teacher: Mapped[Teacher] = relationship(back_populates="courses")
    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="course", cascade="all,delete")
    assignments: Mapped[list[Assignment]] = relationship(back_populates="course", cascade="all,delete")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False)

    course: Mapped[Course] = relationship(back_populates="enrollments")
    student: Mapped[Student] = relationship(back_populates="enrollments")


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    due_date: Mapped[str | None] = mapped_column(String(40), nullable=True)
    resources: Mapped[str | None] = mapped_column(Text, nullable=True)

    course: Mapped[Course] = relationship(back_populates="assignments")
    rubric: Mapped[Rubric | None] = relationship(back_populates="assignment", uselist=False, cascade="all,delete")
    policy: Mapped[SubmissionPolicy | None] = relationship(back_populates="assignment", uselist=False, cascade="all,delete")
    submissions: Mapped[list[Submission]] = relationship(back_populates="assignment", cascade="all,delete")


class Rubric(Base):
    __tablename__ = "rubrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    assignment_id: Mapped[int] = mapped_column(ForeignKey("assignments.id"), nullable=False, unique=True)
    title: Mapped[str] = mapped_column(String(255), default="Default Rubric", nullable=False)

    assignment: Mapped[Assignment] = relationship(back_populates="rubric")
    criteria: Mapped[list[RubricCriteria]] = relationship(back_populates="rubric", cascade="all,delete")


class RubricCriteria(Base):
    __tablename__ = "rubric_criteria"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    rubric_id: Mapped[int] = mapped_column(ForeignKey("rubrics.id"), nullable=False)
    criterion: Mapped[str] = mapped_column(String(255), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    rubric: Mapped[Rubric] = relationship(back_populates="criteria")


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    assignment_id: Mapped[int] = mapped_column(ForeignKey("assignments.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    file_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    draft_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    plagiarism_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False
    )

    assignment: Mapped[Assignment] = relationship(back_populates="submissions")
    grade: Mapped[Grade | None] = relationship(back_populates="submission", uselist=False, cascade="all,delete")
    feedback: Mapped[Feedback | None] = relationship(back_populates="submission", uselist=False, cascade="all,delete")


class Grade(Base):
    __tablename__ = "grades"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    submission_id: Mapped[int] = mapped_column(ForeignKey("submissions.id"), unique=True, nullable=False)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("teachers.id"), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="draft", nullable=False)

    submission: Mapped[Submission] = relationship(back_populates="grade")


class Feedback(Base):
    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    submission_id: Mapped[int] = mapped_column(ForeignKey("submissions.id"), unique=True, nullable=False)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("teachers.id"), nullable=False)
    comments: Mapped[str] = mapped_column(Text, default="", nullable=False)
    plagiarism_report: Mapped[str | None] = mapped_column(Text, nullable=True)

    submission: Mapped[Submission] = relationship(back_populates="feedback")


class SubmissionPolicy(Base):
    __tablename__ = "submission_policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    assignment_id: Mapped[int] = mapped_column(ForeignKey("assignments.id"), unique=True, nullable=False)
    allowed_resources: Mapped[str] = mapped_column(Text, default="Course notes", nullable=False)
    hint_only_mode: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    citation_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    assignment: Mapped[Assignment] = relationship(back_populates="policy")


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user: Mapped[User] = relationship(back_populates="notifications")


class GradingPolicy(Base):
    __tablename__ = "grading_policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("teachers.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    feedback_template: Mapped[str] = mapped_column(Text, default="", nullable=False)
    late_penalty_percent: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
