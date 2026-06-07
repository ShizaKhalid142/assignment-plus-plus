from __future__ import annotations

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.security import hash_password
from app.core.config import get_settings
from app.database import Base, SessionLocal, engine
from app.models.domain import Assignment, Course, Enrollment, Notification, Rubric, RubricCriteria, Student, Submission, Teacher


def seed_sample_data() -> None:
    settings = get_settings()
    if settings.environment != "development":
        print("Skipping seed data because environment is not development.")
        return

    db = SessionLocal()
    try:
        if db.query(Course).count() > 0:
            return

        teacher = Teacher(
            name="Prof. Ada",
            email="teacher@assignmentpp.com",
            password_hash=hash_password("Teacher123"),
            role="teacher",
            id_number="T-9001",
        )
        student = Student(
            name="Ali Student",
            email="student@assignmentpp.com",
            password_hash=hash_password("Student123"),
            role="student",
            id_number="S-1001",
        )
        db.add_all([teacher, student])
        db.flush()

        course = Course(name="Software Engineering", description="Assignment++ demonstration course", code="SE-2026", teacher_id=teacher.id)
        db.add(course)
        db.flush()

        db.add(Enrollment(course_id=course.id, student_id=student.id))

        assignment = Assignment(
            course_id=course.id,
            title="Build Assignment++ API",
            description="Create secure auth and role-based endpoints for teacher and student workflows.",
            due_date="2026-07-01",
            resources="FastAPI docs, course slides",
        )
        db.add(assignment)
        db.flush()

        rubric = Rubric(assignment_id=assignment.id, title="Backend Rubric")
        db.add(rubric)
        db.flush()
        db.add_all(
            [
                RubricCriteria(rubric_id=rubric.id, criterion="Correctness", points=40, notes="Endpoints work as expected"),
                RubricCriteria(rubric_id=rubric.id, criterion="Security", points=30, notes="JWT + RBAC enabled"),
                RubricCriteria(rubric_id=rubric.id, criterion="Documentation", points=30, notes="Clear API usage"),
            ]
        )

        db.add(
            Submission(
                assignment_id=assignment.id,
                student_id=student.id,
                content="Implemented auth and protected APIs with proper validation.",
                file_name="solution.zip",
            )
        )

        db.add_all(
            [
                Notification(user_id=teacher.id, title="New Submission", message="A student submitted Assignment 1."),
                Notification(user_id=student.id, title="Welcome", message="You are enrolled in Software Engineering."),
            ]
        )

        db.commit()
    finally:
        db.close()


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    seed_sample_data()


if __name__ == "__main__":
    init_db()
    print("Database initialized with sample data.")
