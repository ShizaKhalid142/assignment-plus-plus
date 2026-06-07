from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.domain import Notification, User

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [{"id": n.id, "title": n.title, "message": n.message, "is_read": n.is_read, "created_at": n.created_at} for n in rows]


@router.put("/{id}/read")
def mark_read(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    row = db.query(Notification).filter(Notification.id == id, Notification.user_id == current_user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Notification not found")
    row.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}


@router.delete("/{id}")
def delete_notification(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    row = db.query(Notification).filter(Notification.id == id, Notification.user_id == current_user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(row)
    db.commit()
    return {"message": "Notification deleted"}
