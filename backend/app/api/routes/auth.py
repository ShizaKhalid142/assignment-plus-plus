from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, update_password
from app.core.security import create_access_token
from app.database import get_db
from app.models.domain import User
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
    return {"message": "Logged out"}


@router.post("/refresh")
def refresh(current_user: User = Depends(get_current_user)):
    return {"access_token": create_access_token(str(current_user.id), current_user.role), "token_type": "bearer", "role": current_user.role}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    return {"message": f"Password reset link sent to {payload.email}", "token": "demo-reset-token"}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest):
    return {"message": "Password has been reset", "used_token": payload.token}


@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "id_number": current_user.id_number,
    }


@router.put("/profile")
def update_profile(payload: ProfileUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.name is not None:
        current_user.name = payload.name
    if payload.id_number is not None:
        current_user.id_number = payload.id_number
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated"}


@router.put("/change-password")
def change_password(payload: ChangePasswordRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    update_password(current_user, payload.current_password, payload.new_password)
    db.commit()
    return {"message": "Password changed"}
