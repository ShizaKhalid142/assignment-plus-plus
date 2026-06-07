from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.domain import Student, Teacher, User
from app.schemas.schemas import LoginRequest, RegisterRequest


class AuthenticationService:
    def register(self, db: Session, payload: RegisterRequest) -> dict:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

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
        }

    def login(self, db: Session, payload: LoginRequest) -> dict:
        user = db.query(User).filter(User.email == payload.email).first()
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        return {
            "access_token": create_access_token(str(user.id), user.role),
            "token_type": "bearer",
            "role": user.role,
        }
