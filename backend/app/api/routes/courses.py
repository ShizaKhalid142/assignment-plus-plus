from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Course, Enrollment, Student, User
from app.schemas.schemas import CourseCreate, CourseUpdate, RegisterStudentRequest
from app.services.platform_services import AnalyticsService, CourseService, EnrollmentService

router = APIRouter(prefix="/courses", tags=["courses"])
course_service = CourseService()
analytics_service = AnalyticsService()
enrollment_service = EnrollmentService()


@router.post("")
def create_course(payload: CourseCreate, db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    row = course_service.create_course(db, teacher.id, payload.name, payload.description, payload.code)
    return {"id": row.id, "message": "Course created"}


@router.get("")
def list_courses(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role == "teacher":
        courses = db.query(Course).filter(Course.teacher_id == user.id).all()
    else:
        courses = db.query(Course).join(Enrollment, Enrollment.course_id == Course.id).filter(Enrollment.student_id == user.id).all()

    return [{"id": c.id, "name": c.name, "description": c.description, "code": c.code} for c in courses]


@router.get("/{id}")
def get_course(id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"id": course.id, "name": course.name, "description": course.description, "code": course.code, "teacher_id": course.teacher_id}


@router.put("/{id}")
def update_course(id: int, payload: CourseUpdate, db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    course = db.query(Course).filter(Course.id == id, Course.teacher_id == teacher.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if payload.name is not None:
        course.name = payload.name
    if payload.description is not None:
        course.description = payload.description
    db.commit()
    return {"message": "Course updated"}


@router.delete("/{id}")
def delete_course(id: int, db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    course = db.query(Course).filter(Course.id == id, Course.teacher_id == teacher.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}


@router.post("/{id}/enroll")
def enroll_in_course(id: int, db: Session = Depends(get_db), student: User = Depends(require_role("student"))):
    row = enrollment_service.enroll_student(db, id, student.id)
    return {"id": row.id, "message": "Enrolled successfully"}


@router.post("/{id}/register-student")
def register_student(id: int, payload: RegisterStudentRequest, db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    course = db.query(Course).filter(Course.id == id, Course.teacher_id == teacher.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    id_number = payload.id_number.strip()
    if not id_number:
        raise HTTPException(status_code=400, detail="id_number is required")

    row = enrollment_service.register_by_id_number(db, id, id_number)
    return {"id": row.id, "message": "Student registered"}


@router.get("/{id}/students")
def get_course_students(id: int, db: Session = Depends(get_db), teacher: User = Depends(require_role("teacher"))):
    course = db.query(Course).filter(Course.id == id, Course.teacher_id == teacher.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    students = db.query(Student).join(Enrollment, Enrollment.student_id == Student.id).filter(Enrollment.course_id == id).all()
    return [{"id": s.id, "name": s.name, "email": s.email, "id_number": s.id_number} for s in students]


@router.get("/{id}/analytics")
def get_course_analytics(id: int, db: Session = Depends(get_db), _: User = Depends(require_role("teacher"))):
    return analytics_service.course_analytics(db, id)
