"""Runtime configuration helpers.

This module centralizes environment-driven settings so deployment changes
can be made without modifying business logic files.
"""

from dataclasses import dataclass
import os


@dataclass
class Settings:
    """Container for runtime settings used across the app."""

    app_name: str = os.getenv("APP_NAME", "Assignment++")
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql://localhost:5432/assignmentpp"
    )
    secret_key: str = os.getenv("SECRET_KEY", "change-me")


settings = Settings()
