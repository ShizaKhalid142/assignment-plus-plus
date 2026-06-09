from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import (
    Assignment,
    Course,
    GradingPolicy,
    Submission,
    SubmissionPolicy,
    User,
)
from app.schemas.schemas import (
    ApplyTemplateRequest,
    GradingPolicyCreate,
    GradingPolicyOut,
    GradingPolicyUpdate,
    SubmissionPolicyCreate,
    SubmissionPolicyOut,
    SubmissionPolicyUpdate,
)

router = APIRouter(prefix="/policies", tags=["policies"])


# ── Submission Policies (per-assignment) ──

@router.post("/submission", response_model=SubmissionPolicyOut)
def create_submission_policy(
    payload: SubmissionPolicyCreate,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Set allowed resources, hint mode, and citation requirements for an assignment."""
    assignment = db.query(Assignment).filter(Assignment.id == payload.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Check teacher owns the course
    course = db.query(Course).filter(Course.id == assignment.course_id, Course.teacher_id == teacher.id).first()
    if not course:
        raise HTTPException(status_code=403, detail="You do not own this assignment's course")

    existing = db.query(SubmissionPolicy).filter(SubmissionPolicy.assignment_id == payload.assignment_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Policy already exists for this assignment — use PUT to update")

    policy = SubmissionPolicy(
        assignment_id=payload.assignment_id,
        allowed_resources=payload.allowed_resources,
        hint_only_mode=payload.hint_only_mode,
        citation_required=payload.citation_required,
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


@router.get("/submission/{assignment_id}", response_model=SubmissionPolicyOut)
def get_submission_policy(
    assignment_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Get the submission policy for an assignment."""
    policy = db.query(SubmissionPolicy).filter(SubmissionPolicy.assignment_id == assignment_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="No submission policy set for this assignment")
    return policy


@router.put("/submission/{assignment_id}", response_model=SubmissionPolicyOut)
def update_submission_policy(
    assignment_id: int,
    payload: SubmissionPolicyUpdate,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Update the submission policy for an assignment."""
    policy = db.query(SubmissionPolicy).filter(SubmissionPolicy.assignment_id == assignment_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found — create one first")

    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    course = db.query(Course).filter(Course.id == assignment.course_id, Course.teacher_id == teacher.id).first()
    if not course:
        raise HTTPException(status_code=403, detail="You do not own this assignment")

    if payload.allowed_resources is not None:
        policy.allowed_resources = payload.allowed_resources
    if payload.hint_only_mode is not None:
        policy.hint_only_mode = payload.hint_only_mode
    if payload.citation_required is not None:
        policy.citation_required = payload.citation_required

    db.commit()
    db.refresh(policy)
    return policy


# ── Grading Policies / Feedback Templates ──

@router.post("/grading", response_model=GradingPolicyOut)
def create_grading_policy(
    payload: GradingPolicyCreate,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Create a reusable grading policy / feedback template."""
    policy = GradingPolicy(
        teacher_id=teacher.id,
        name=payload.name,
        feedback_template=payload.feedback_template,
        late_penalty_percent=payload.late_penalty_percent,
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


@router.get("/grading", response_model=list[GradingPolicyOut])
def list_grading_policies(
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """List all grading policies for the logged-in teacher."""
    policies = db.query(GradingPolicy).filter(GradingPolicy.teacher_id == teacher.id).all()
    return policies


@router.get("/grading/{policy_id}", response_model=GradingPolicyOut)
def get_grading_policy(
    policy_id: int,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Get a specific grading policy."""
    policy = db.query(GradingPolicy).filter(GradingPolicy.id == policy_id, GradingPolicy.teacher_id == teacher.id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Grading policy not found")
    return policy


@router.put("/grading/{policy_id}", response_model=GradingPolicyOut)
def update_grading_policy(
    policy_id: int,
    payload: GradingPolicyUpdate,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Update a grading policy."""
    policy = db.query(GradingPolicy).filter(GradingPolicy.id == policy_id, GradingPolicy.teacher_id == teacher.id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Grading policy not found")

    if payload.name is not None:
        policy.name = payload.name
    if payload.feedback_template is not None:
        policy.feedback_template = payload.feedback_template
    if payload.late_penalty_percent is not None:
        policy.late_penalty_percent = payload.late_penalty_percent

    db.commit()
    db.refresh(policy)
    return policy


@router.delete("/grading/{policy_id}")
def delete_grading_policy(
    policy_id: int,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Delete a grading policy."""
    policy = db.query(GradingPolicy).filter(GradingPolicy.id == policy_id, GradingPolicy.teacher_id == teacher.id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Grading policy not found")
    db.delete(policy)
    db.commit()
    return {"message": "Grading policy deleted"}


@router.post("/grading/apply-template")
def apply_template_to_submission(
    payload: ApplyTemplateRequest,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """Apply a feedback template to a submission's feedback."""
    policy = db.query(GradingPolicy).filter(
        GradingPolicy.id == payload.grading_policy_id,
        GradingPolicy.teacher_id == teacher.id,
    ).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Grading policy not found")

    submission = db.query(Submission).filter(Submission.id == payload.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Merge template into draft feedback
    template = policy.feedback_template
    if submission.draft_feedback:
        submission.draft_feedback = f"{template}\n\n---\n{submission.draft_feedback}"
    else:
        submission.draft_feedback = template

    db.commit()
    return {
        "message": "Feedback template applied",
        "template_name": policy.name,
        "submission_id": payload.submission_id,
    }


# ── Policy Enforcement Check ──

@router.get("/submission/{assignment_id}/check")
def check_policy_compliance(
    assignment_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Check what policies are enforced for an assignment (students see this)."""
    policy = db.query(SubmissionPolicy).filter(SubmissionPolicy.assignment_id == assignment_id).first()
    if not policy:
        return {
            "enforced": False,
            "message": "No submission policy configured — standard rules apply.",
            "policy": None,
        }
    return {
        "enforced": True,
        "message": "Submission policy is active.",
        "policy": {
            "allowed_resources": policy.allowed_resources,
            "hint_only_mode": policy.hint_only_mode,
            "citation_required": policy.citation_required,
        },
    }
