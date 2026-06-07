"""Database connection and session management.

This file demonstrates where PostgreSQL connectivity should live.
"""

from __future__ import annotations

from contextlib import contextmanager

from app.core.config import settings


class DatabaseSessionManager:
    """Placeholder manager for database sessions.

    TODO: Implement SQLAlchemy engine/sessionmaker with connection pooling.
    """

    def __init__(self, database_url: str) -> None:
        self.database_url = database_url

    @contextmanager
    def session(self):
        """Yield a placeholder session object for future DB operations."""

        fake_session = {"database_url": self.database_url}
        try:
            yield fake_session
        finally:
            # TODO: close real session when SQLAlchemy integration is added.
            pass


session_manager = DatabaseSessionManager(settings.database_url)
