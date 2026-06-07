"""FastAPI entry point for Assignment++.

This file wires together all API routers and exposes top-level health endpoints.
"""

from fastapi import FastAPI

from app.api.routes.assignments import router as assignments_router
from app.api.routes.courses import router as courses_router
from app.api.routes.grades import router as grades_router
from app.api.routes.hints import router as hints_router
from app.api.routes.plagiarism import router as plagiarism_router
from app.api.routes.submissions import router as submissions_router

app = FastAPI(
    title="Assignment++ API",
    description="AI-Assisted Assignment Management & Grading Platform",
    version="0.1.0",
)


@app.get("/", tags=["health"])
def root() -> dict[str, str]:
    """Simple root health endpoint for quick uptime checks."""

    return {"message": "Assignment++ API is running"}


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str]:
    """Detailed API health endpoint used by clients and monitoring systems."""

    return {"status": "ok"}


app.include_router(courses_router, prefix="/api", tags=["courses"])
app.include_router(assignments_router, prefix="/api", tags=["assignments"])
app.include_router(submissions_router, prefix="/api", tags=["submissions"])
app.include_router(grades_router, prefix="/api", tags=["grades"])
app.include_router(plagiarism_router, prefix="/api", tags=["plagiarism"])
app.include_router(hints_router, prefix="/api", tags=["hints"])
