from __future__ import annotations

import logging
from contextlib import asynccontextmanager

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from pathlib import Path

load_dotenv(Path(__file__).parent / ".env")

from app.api.routes import ai, assignments, auth, courses, dashboard, feedback, grades, hints, notifications, plagiarism, submissions, admin
from app.core.config import get_settings
from database.init_db import init_db

settings = get_settings()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("assignment-plus-plus")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    logger.info("Database initialized")
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(_: Request, exc: Exception):
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})


@app.get("/health")
def health():
    return {"status": "ok", "service": settings.app_name}


app.include_router(auth.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
app.include_router(assignments.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")
app.include_router(grades.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(plagiarism.router, prefix="/api")
app.include_router(hints.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
