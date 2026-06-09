from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import PeerReview, Submission, User
from app.schemas.schemas import PeerReviewCreate, PeerReviewOut

router = APIRouter(prefix="/peer-reviews", tags=["peer-reviews"])


@router.post("", response_model=PeerReviewOut)
def create_peer_review(
    payload: PeerReviewCreate,
    db: Session = Depends(get_db),
    reviewer: User = Depends(require_role("student")),
):
    """Submit a peer review for another student's submission."""
    submission = db.query(Submission).filter(Submission.id == payload.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    if submission.student_id == reviewer.id:
        raise HTTPException(status_code=400, detail="You cannot review your own submission")

    # Prevent duplicate reviews
    existing = db.query(PeerReview).filter(
        PeerReview.submission_id == payload.submission_id,
        PeerReview.reviewer_id == reviewer.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this submission")

    review = PeerReview(
        submission_id=payload.submission_id,
        reviewer_id=reviewer.id,
        score=payload.score,
        comments=payload.comments,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/{submission_id}", response_model=list[PeerReviewOut])
def list_peer_reviews(
    submission_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Get all peer reviews for a submission."""
    reviews = db.query(PeerReview).filter(PeerReview.submission_id == submission_id).all()
    return reviews


@router.get("/{submission_id}/stats")
def get_peer_review_stats(
    submission_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Get aggregate peer review statistics."""
    reviews = db.query(PeerReview).filter(PeerReview.submission_id == submission_id).all()
    if not reviews:
        return {"submission_id": submission_id, "review_count": 0, "average_score": None}

    scores = [r.score for r in reviews]
    return {
        "submission_id": submission_id,
        "review_count": len(reviews),
        "average_score": round(sum(scores) / len(scores), 2),
        "min_score": min(scores),
        "max_score": max(scores),
        "reviews": [
            {"reviewer_id": r.reviewer_id, "score": r.score, "comments": r.comments}
            for r in reviews
        ],
    }
