from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Rubric, RubricCriteria, User
from app.services.cache_service import invalidate_cache

router = APIRouter(prefix="/rubrics", tags=["rubrics"])


@router.post("")
def create_rubric_template(
    data: dict,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Create a standalone reusable rubric template."""
    if not data.get("title"):
        raise HTTPException(status_code=400, detail="title is required")
    if not data.get("criteria"):
        raise HTTPException(status_code=400, detail="criteria list is required")

    rubric = Rubric(assignment_id=None, title=data["title"])  # assignment_id=None = standalone template
    db.add(rubric)
    db.flush()

    for item in data["criteria"]:
        db.add(RubricCriteria(
            rubric_id=rubric.id,
            criterion=str(item.get("criterion", "Criterion")),
            points=int(item.get("points", 0)),
            notes=item.get("notes"),
        ))

    db.commit()
    invalidate_cache("cache:*rubric*")
    return {"id": rubric.id, "message": "Rubric template saved"}


@router.get("")
def list_rubric_templates(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """List all standalone rubric templates."""
    # rubrics with assignment_id=None are standalone templates
    rubrics = db.query(Rubric).filter(Rubric.assignment_id.is_(None)).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "criteria": [
                {"criterion": c.criterion, "points": c.points, "notes": c.notes}
                for c in r.criteria
            ],
        }
        for r in rubrics
    ]


@router.get("/{rubric_id}")
def get_rubric_template(
    rubric_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Get a specific rubric template."""
    rubric = db.query(Rubric).filter(Rubric.id == rubric_id).first()
    if not rubric:
        raise HTTPException(status_code=404, detail="Rubric not found")
    return {
        "id": rubric.id,
        "title": rubric.title,
        "criteria": [
            {"criterion": c.criterion, "points": c.points, "notes": c.notes}
            for c in rubric.criteria
        ],
    }


@router.delete("/{rubric_id}")
def delete_rubric_template(
    rubric_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("teacher")),
):
    """Delete a rubric template."""
    rubric = db.query(Rubric).filter(Rubric.id == rubric_id).first()
    if not rubric:
        raise HTTPException(status_code=404, detail="Rubric not found")
    db.delete(rubric)
    db.commit()
    invalidate_cache("cache:*rubric*")
    return {"message": "Rubric deleted"}
