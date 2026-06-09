"""
Alembic environment configuration for Assignment++ database migrations.
Supports both SQLite (development) and PostgreSQL (production).
Usage:
  alembic revision --autogenerate -m "description"   # create migration
  alembic upgrade head                                 # apply all migrations
  alembic downgrade -1                                 # roll back one step
"""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context
from app.database import Base
from app.core.config import get_settings

# Import all models so Alembic can detect them
from app.models.domain import (  # noqa: F401
    User, Student, Teacher, Admin, Course, Enrollment,
    Assignment, Rubric, RubricCriteria, Submission, Grade,
    Feedback, SubmissionPolicy, GradingPolicy, Notification,
    PasswordResetToken, PeerReview,
)

config = context.config
settings = get_settings()

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode (without a DB connection)."""
    url = settings.database_url
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode (with a DB connection)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
