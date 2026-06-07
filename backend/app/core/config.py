from __future__ import annotations

import os
from functools import lru_cache


class Settings:
    app_name: str = os.getenv("APP_NAME", "Assignment++ API")
    environment: str = os.getenv("ENVIRONMENT", "development")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./assignment_plus_plus.db")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    plagiarism_api_url: str = os.getenv("PLAGIARISM_API_URL", "")
    plagiarism_api_key: str = os.getenv("PLAGIARISM_API_KEY", "")
    cors_origins: list[str] = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "assignment-plus-plus-secret")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_access_token_expire_minutes: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "120"))


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
