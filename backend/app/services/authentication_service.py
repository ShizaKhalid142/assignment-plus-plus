from __future__ import annotations

import re
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.domain import Student, Teacher, User
from app.schemas.schemas import LoginRequest, RegisterRequest


def _validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength requirements
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit"
    return True, ""


class AuthenticationService:
    def register(self, db: Session, payload: RegisterRequest) -> dict:
        # Validate password strength
        is_valid, error_msg = _validate_password_strength(payload.password)
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)

        # Check if email already exists
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        # Check if ID number already exists (if provided)
        if payload.id_number:
            existing_id = db.query(User).filter(User.id_number == payload.id_number).first()
            if existing_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="ID number already in use"
                )

        kwargs = {
            "name": payload.name,
            "email": payload.email,
            "password_hash": hash_password(payload.password),
            "role": payload.role,
            "id_number": payload.id_number,
        }
        user: User = Student(**kwargs) if payload.role == "student" else Teacher(**kwargs)
        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "access_token": create_access_token(str(user.id), user.role),
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
        }

    def login(self, db: Session, payload: LoginRequest) -> dict:
        user = db.query(User).filter(User.email == payload.email).first()
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        return {
            "access_token": create_access_token(str(user.id), user.role),
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
        }
