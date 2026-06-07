from __future__ import annotations

import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.domain import Assignment
from app.schemas.schemas import AssignmentCreate

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("")
def list_assignments(db: Session = Depends(get_db)):
    rows = db.query(Assignment).order_by(Assignment.id.desc()).all()
    return [
        {
            "id": row.id,
            "title": row.title,
            "description": row.description,
            "rubric": json.loads(row.rubric),
            "due_date": row.due_date,
        }
        for row in rows
    ]


@router.post("")
def create_assignment(payload: AssignmentCreate, db: Session = Depends(get_db)):
    row = Assignment(
        title=payload.title,
        description=payload.description,
        rubric=json.dumps(payload.rubric),
        due_date=payload.due_date,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id, "message": "Assignment created"}
