"""Assignment endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.state import store
from app.models.domain import Assignment, Rubric, RubricCriterion
from app.schemas.schemas import AssignmentCreateRequest, AssignmentResponse

router = APIRouter()


@router.post("/assignments", response_model=AssignmentResponse)
def create_assignment(payload: AssignmentCreateRequest) -> Assignment:
    if payload.course_id not in store.courses:
        raise HTTPException(status_code=404, detail="Course not found")

    rubric_id: int | None = None
    if payload.rubric:
        rubric_id = store.rubric_seq
        criteria = [
            RubricCriterion(
                criterion_id=index + 1,
                name=criterion.name,
                max_points=criterion.max_points,
                description=criterion.description,
            )
            for index, criterion in enumerate(payload.rubric.criteria)
        ]
        rubric = Rubric(
            rubric_id=rubric_id,
            assignment_id=store.assignment_seq,
            title=payload.rubric.title,
            total_points=payload.rubric.total_points,
            criteria=criteria,
        )
        store.rubrics[rubric.rubric_id] = rubric
        store.rubric_seq += 1

    assignment = Assignment(
        assignment_id=store.assignment_seq,
        course_id=payload.course_id,
        title=payload.title,
        description=payload.description,
        due_date=payload.due_date,
        rubric_id=rubric_id,
    )
    store.assignments[assignment.assignment_id] = assignment
    store.assignment_seq += 1
    return assignment


@router.get("/assignments", response_model=list[AssignmentResponse])
def list_assignments() -> list[Assignment]:
    return list(store.assignments.values())
