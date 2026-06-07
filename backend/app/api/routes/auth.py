from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, update_password
from app.core.security import create_access_token, hash_password
from app.database import get_db
from app.models.domain import PasswordResetToken, User
from app.schemas.schemas import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    ProfileUpdateRequest,
    RegisterRequest,
    ResetPasswordRequest,
)
from app.services.authentication_service import AuthenticationService

router = APIRouter(prefix="/auth", tags=["auth"])
auth_service = AuthenticationService()


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register(db, payload)


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(db, payload)


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}


@router.post("/refresh")
def refresh(current_user: User = Depends(get_current_user)):
    """Refresh the access token for current user"""
    return {
        "access_token": create_access_token(str(current_user.id), current_user.role),
        "token_type": "bearer",
        "role": current_user.role,
        "user_id": current_user.id,
    }


@router.post("/guest")
def guest_access(db: Session = Depends(get_db)):
    """Create temporary guest session"""
    from app.models.domain import Student
    timestamp = datetime.now(timezone.utc).timestamp()
    guest = Student(
        name="Guest User",
        email=f"guest_{timestamp}@demo.local",
        password_hash=hash_password("guest123"),
        role="student",
        id_number=f"GUEST-{int(timestamp)}"
    )
    db.add(guest)
    db.commit()
    db.refresh(guest)
    return {
        "access_token": create_access_token(str(guest.id), "student"),
        "token_type": "bearer",
        "role": "student",
        "user_id": guest.id,
        "message": "Guest access granted - view sample data"
    }


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request a password reset token"""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Don't reveal if email exists (security best practice)
        return {"message": "If an account exists, a password reset link has been sent."}

    # Generate secure token
    token = secrets.token_urlsafe(32)
    
    # Delete any existing reset tokens for this email
    db.query(PasswordResetToken).filter(PasswordResetToken.email == payload.email).delete()
    
    # Create new reset token (valid for 1 hour)
    reset_token = PasswordResetToken(
        email=payload.email,
        token=token,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
    )
    db.add(reset_token)
    db.commit()
    
    return {
        "message": f"Password reset link sent to {payload.email}",
        "token": token  # In production, send via email instead
    }


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using token"""
    # Find valid reset token
    reset_token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == payload.token,
        PasswordResetToken.expires_at > datetime.now(timezone.utc)
    ).first()
    
    if not reset_token_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    # Find user by email
    user = db.query(User).filter(User.email == reset_token_record.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    # Update password
    user.password_hash = hash_password(payload.password)
    
    # Delete used token
    db.delete(reset_token_record)
    
    db.commit()
    return {"message": "Password has been reset successfully"}


@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "id_number": current_user.id_number,
        "created_at": current_user.created_at,
    }


@router.put("/profile")
def update_profile(
    payload: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user profile"""
    if payload.name is not None:
        current_user.name = payload.name
    if payload.id_number is not None:
        current_user.id_number = payload.id_number
    
    db.commit()
    db.refresh(current_user)
    return {
        "message": "Profile updated successfully",
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "id_number": current_user.id_number,
    }


@router.put("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change user password"""
    update_password(current_user, payload.current_password, payload.new_password)
    db.commit()
    return {"message": "Password changed successfully"}
