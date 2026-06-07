from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import User, Course, Submission, Student, Teacher

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin: User = Depends(require_role("admin"))):
    """Get platform statistics (admin only)"""
    teachers = db.query(Teacher).count()
    students = db.query(Student).count()
    courses = db.query(Course).count()
    submissions = db.query(Submission).count()
    
    return {
        "teachers": teachers,
        "students": students,
        "courses": courses,
        "submissions": submissions,
        "total_users": teachers + students,
    }


@router.get("/users")
def get_all_users(
    role: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin"))
):
    """Get all users (admin only)"""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "id_number": u.id_number, "created_at": u.created_at} for u in query.all()]


@router.get("/courses/summary")
def get_course_summary(db: Session = Depends(get_db), admin: User = Depends(require_role("admin"))):
    """Get all courses with stats (admin only)"""
    courses = db.query(Course).all()
    result = []
    for course in courses:
        enrollments = db.query(Submission).filter(Submission.id == course.id).count()
        result.append({
            "id": course.id,
            "name": course.name,
            "code": course.code,
            "students": enrollments,
        })
    return result
