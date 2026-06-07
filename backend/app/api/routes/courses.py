"""Course endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.state import store
from app.models.domain import Course
from app.schemas.schemas import CourseCreateRequest, CourseResponse

router = APIRouter()


@router.post("/courses", response_model=CourseResponse)
def create_course(payload: CourseCreateRequest) -> Course:
    course = Course(course_id=store.course_seq, title=payload.title, teacher_id=payload.teacher_id)
    store.courses[course.course_id] = course
    store.course_seq += 1
    return course


@router.get("/courses", response_model=list[CourseResponse])
def list_courses() -> list[Course]:
    return list(store.courses.values())


@router.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: int) -> Course:
    if course_id not in store.courses:
        raise HTTPException(status_code=404, detail="Course not found")
    return store.courses[course_id]
