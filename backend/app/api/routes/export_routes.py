from __future__ import annotations

import csv
import io
import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import (
    Assignment,
    Course,
    Enrollment,
    Feedback,
    Grade,
    Student,
    Submission,
    User,
)
from app.schemas.schemas import ExportRequest

router = APIRouter(prefix="/export", tags=["export"])


@router.post("")
def export_course_data(
    payload: ExportRequest,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Export all grades, submissions, and feedback for a course as CSV/JSON/Excel."""
    course = db.query(Course).filter(Course.id == payload.course_id, Course.teacher_id == teacher.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not yours")

    # Gather data
    assignments = db.query(Assignment).filter(Assignment.course_id == payload.course_id).all()
    assignment_map = {a.id: a for a in assignments}

    enrollments = db.query(Enrollment).filter(Enrollment.course_id == payload.course_id).all()
    student_ids = [e.student_id for e in enrollments]
    students = {s.id: s for s in db.query(Student).filter(Student.id.in_(student_ids)).all()} if student_ids else {}

    submissions = (
        db.query(Submission)
        .filter(Submission.assignment_id.in_(assignment_map.keys()))
        .all()
    ) if assignment_map else []

    grades = {
        s.id: db.query(Grade).filter(Grade.submission_id == s.id).first()
        for s in submissions
    }

    feedbacks = {
        s.id: db.query(Feedback).filter(Feedback.submission_id == s.id).first()
        for s in submissions
    }

    rows = []
    for sub in submissions:
        assignment = assignment_map.get(sub.assignment_id)
        student = students.get(sub.student_id)
        grade = grades.get(sub.id)
        feedback = feedbacks.get(sub.id)

        rows.append({
            "student_name": student.name if student else "Unknown",
            "student_id": student.id_number if student else "N/A",
            "assignment": assignment.title if assignment else "Unknown",
            "due_date": assignment.due_date if assignment else "N/A",
            "submission_date": sub.created_at.isoformat() if sub.created_at else "",
            "submission_content": sub.content[:200] if sub.content else "",
            "file_name": sub.file_name or "",
            "grade_score": grade.score if grade else "Not graded",
            "grade_status": grade.status if grade else "N/A",
            "feedback_comments": feedback.comments if feedback else "",
            "plagiarism_score": sub.plagiarism_score or 0,
        })

    format_lower = payload.format.lower()

    if format_lower == "csv":
        output = io.StringIO()
        if rows:
            writer = csv.DictWriter(output, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        else:
            output.write("No data available\n")
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={course.code}_export_{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"},
        )

    elif format_lower == "excel":
        try:
            import openpyxl
        except ImportError:
            raise HTTPException(status_code=500, detail="openpyxl not installed — run: pip install openpyxl")

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = course.code or "Export"

        if rows:
            ws.append(list(rows[0].keys()))
            for row in rows:
                ws.append([str(v) for v in row.values()])

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={course.code}_export_{datetime.now(timezone.utc).strftime('%Y%m%d')}.xlsx"},
        )

    else:  # JSON
        return {
            "course": {"id": course.id, "name": course.name, "code": course.code},
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "total_submissions": len(rows),
            "data": rows,
        }


@router.post("/submissions/{assignment_id}")
def export_assignment_submissions(
    assignment_id: int,
    payload: ExportRequest,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Export submissions for a specific assignment."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    course = db.query(Course).filter(Course.id == assignment.course_id, Course.teacher_id == teacher.id).first()
    if not course:
        raise HTTPException(status_code=403, detail="Not your assignment")

    # Override course_id for single-assignment export
    payload.course_id = assignment.course_id

    submissions = db.query(Submission).filter(Submission.assignment_id == assignment_id).all()
    enrollments = {e.student_id for e in db.query(Enrollment).filter(Enrollment.course_id == assignment.course_id).all()}
    students = {s.id: s for s in db.query(Student).filter(Student.id.in_(enrollments)).all()} if enrollments else {}

    rows = []
    for sub in submissions:
        student = students.get(sub.student_id)
        grade = db.query(Grade).filter(Grade.submission_id == sub.id).first()
        feedback = db.query(Feedback).filter(Feedback.submission_id == sub.id).first()
        rows.append({
            "student_name": student.name if student else "Unknown",
            "student_id": student.id_number if student else "N/A",
            "submission_date": sub.created_at.isoformat() if sub.created_at else "",
            "content": sub.content[:300] if sub.content else "",
            "file_name": sub.file_name or "",
            "grade_score": grade.score if grade else "Not graded",
            "grade_status": grade.status if grade else "N/A",
            "feedback": feedback.comments if feedback else "",
            "plagiarism_score": sub.plagiarism_score or 0,
        })

    format_lower = payload.format.lower()

    if format_lower == "csv":
        output = io.StringIO()
        if rows:
            writer = csv.DictWriter(output, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        else:
            output.write("No data\n")
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=assignment_{assignment_id}_export.csv"},
        )

    elif format_lower == "excel":
        try:
            import openpyxl
        except ImportError:
            raise HTTPException(status_code=500, detail="openpyxl not installed")
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = assignment.title[:31] if assignment.title else "Export"
        if rows:
            ws.append(list(rows[0].keys()))
            for row in rows:
                ws.append([str(v) for v in row.values()])
        output = io.BytesIO()
        wb.save(output)
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=assignment_{assignment_id}_export.xlsx"},
        )

    return {
        "assignment": {"id": assignment.id, "title": assignment.title},
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "total_submissions": len(rows),
        "data": rows,
    }
