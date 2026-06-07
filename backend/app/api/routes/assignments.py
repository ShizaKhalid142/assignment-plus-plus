from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Assignment, Rubric, RubricCriteria, User
from app.schemas.schemas import AssignmentCreate, AssignmentUpdate
from app.services.platform_services import AssignmentService

router = APIRouter(prefix="/assignments", tags=["assignments"])
assignment_service = AssignmentService()


def assignment_payload(item: Assignment) -> dict:
    criteria = []
    if item.rubric:
        criteria = [{"criterion": c.criterion, "points": c.points, "notes": c.notes} for c in item.rubric.criteria]
    return {
        "id": item.id,
        "course_id": item.course_id,
        "title": item.title,
        "description": item.description,
        "due_date": item.due_date,
        "resources": item.resources,
        "rubric": criteria,
    }


@router.post("")
def create_assignment(payload: AssignmentCreate, db: Session = Depends(get_db), _: User = Depends(require_role("teacher"))):
    row = assignment_service.create_assignment(
        db,
        payload.course_id,
        payload.title,
        payload.description,
        payload.rubric,
        payload.due_date,
        payload.resources,
    )
    return {"id": row.id, "message": "Assignment created"}


@router.get("")
def list_assignments(course_id: int | None = None, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    query = db.query(Assignment).order_by(Assignment.id.desc())
    if course_id is not None:
        query = query.filter(Assignment.course_id == course_id)
    return [assignment_payload(a) for a in query.all()]


@router.get("/{id}")
def get_assignment(id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    row = db.query(Assignment).filter(Assignment.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment_payload(row)


@router.put("/{id}")
def update_assignment(id: int, payload: AssignmentUpdate, db: Session = Depends(get_db), _: User = Depends(require_role("teacher"))):
    row = db.query(Assignment).filter(Assignment.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if payload.title is not None:
        row.title = payload.title
    if payload.description is not None:
        row.description = payload.description
    if payload.due_date is not None:
        row.due_date = payload.due_date
    if payload.resources is not None:
        row.resources = payload.resources

    if payload.rubric is not None:
        rubric = row.rubric
        if not rubric:
            rubric = Rubric(assignment_id=row.id, title="Assignment Rubric")
            db.add(rubric)
            db.flush()
        for item in list(rubric.criteria):
            db.delete(item)
        db.flush()
        for criterion in payload.rubric:
            db.add(
                RubricCriteria(
                    rubric_id=rubric.id,
                    criterion=str(criterion.get("criterion", "Criterion")),
                    points=int(criterion.get("points", 0)),
                    notes=criterion.get("notes"),
                )
            )

    db.commit()
    return {"message": "Assignment updated"}


@router.delete("/{id}")
def delete_assignment(id: int, db: Session = Depends(get_db), _: User = Depends(require_role("teacher"))):
    row = db.query(Assignment).filter(Assignment.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(row)
    db.commit()
    return {"message": "Assignment deleted"}
