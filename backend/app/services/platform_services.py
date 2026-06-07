from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.domain import (
    Assignment,
    Course,
    Enrollment,
    Feedback,
    Grade,
    Notification,
    Rubric,
    RubricCriteria,
    Student,
    Submission,
    Teacher,
)


class CourseService:
    def create_course(self, db: Session, teacher_id: int, name: str, description: str, code: str) -> Course:
        row = Course(name=name, description=description, code=code, teacher_id=teacher_id)
        db.add(row)
        db.commit()
        db.refresh(row)
        return row


class AssignmentService:
    def create_assignment(
        self,
        db: Session,
        course_id: int,
        title: str,
        description: str,
        rubric: list[dict],
        due_date: str | None,
        resources: str | None,
    ) -> Assignment:
        assignment = Assignment(
            course_id=course_id,
            title=title,
            description=description,
            due_date=due_date,
            resources=resources,
        )
        db.add(assignment)
        db.flush()

        rubric_row = Rubric(assignment_id=assignment.id, title="Assignment Rubric")
        db.add(rubric_row)
        db.flush()
        for item in rubric:
            db.add(
                RubricCriteria(
                    rubric_id=rubric_row.id,
                    criterion=str(item.get("criterion", "Criterion")),
                    points=int(item.get("points", 0)),
                    notes=item.get("notes"),
                )
            )

        db.commit()
        db.refresh(assignment)
        return assignment


class SubmissionService:
    def submit(self, db: Session, student_id: int, assignment_id: int, content: str, file_name: str | None) -> Submission:
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found")

        row = Submission(assignment_id=assignment_id, student_id=student_id, content=content, file_name=file_name)
        db.add(row)
        db.commit()
        db.refresh(row)
        return row


class GradingService:
    def grade(self, db: Session, submission_id: int, teacher_id: int, score: float, status_value: str) -> Grade:
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")

        grade = db.query(Grade).filter(Grade.submission_id == submission_id).first()
        if not grade:
            grade = Grade(submission_id=submission_id, teacher_id=teacher_id, score=score, status=status_value)
            db.add(grade)
        else:
            grade.score = score
            grade.status = status_value
            grade.teacher_id = teacher_id

        db.commit()
        db.refresh(grade)
        return grade


class NotificationService:
    def create(self, db: Session, user_id: int, title: str, message: str) -> Notification:
        row = Notification(user_id=user_id, title=title, message=message)
        db.add(row)
        db.commit()
        db.refresh(row)
        return row


class AnalyticsService:
    def course_analytics(self, db: Session, course_id: int) -> dict:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

        submissions = (
            db.query(Submission)
            .join(Assignment, Assignment.id == Submission.assignment_id)
            .filter(Assignment.course_id == course_id)
            .all()
        )
        graded_scores = [s.grade.score for s in submissions if s.grade]
        return {
            "course_id": course.id,
            "course_name": course.name,
            "students": len(course.enrollments),
            "assignments": len(course.assignments),
            "submission_count": len(submissions),
            "average_grade": round(sum(graded_scores) / len(graded_scores), 2) if graded_scores else 0,
        }


class FeedbackService:
    def add_feedback(self, db: Session, submission_id: int, teacher_id: int, comments: str, plagiarism_report: str | None) -> Feedback:
        feedback = db.query(Feedback).filter(Feedback.submission_id == submission_id).first()
        if not feedback:
            feedback = Feedback(
                submission_id=submission_id,
                teacher_id=teacher_id,
                comments=comments,
                plagiarism_report=plagiarism_report,
            )
            db.add(feedback)
        else:
            feedback.teacher_id = teacher_id
            feedback.comments = comments
            feedback.plagiarism_report = plagiarism_report

        db.commit()
        db.refresh(feedback)
        return feedback


class EnrollmentService:
    def enroll_student(self, db: Session, course_id: int, student_id: int) -> Enrollment:
        existing = db.query(Enrollment).filter(Enrollment.course_id == course_id, Enrollment.student_id == student_id).first()
        if existing:
            return existing

        enrollment = Enrollment(course_id=course_id, student_id=student_id)
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)
        return enrollment

    def register_by_id_number(self, db: Session, course_id: int, student_id_number: str) -> Enrollment:
        student = db.query(Student).filter(Student.id_number == student_id_number).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student with this ID number not found")
        return self.enroll_student(db, course_id, student.id)
