from __future__ import annotations

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.database import get_db
from app.models.domain import Assignment, Submission, User

router = APIRouter(prefix="/files", tags=["files"])

UPLOAD_DIR = Path(__file__).parents[4] / "uploads"
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".zip", ".py", ".js", ".ts", ".tsx", ".ipynb", ".md", ".json", ".xml", ".csv", ".xlsx"}


def _ensure_upload_dir():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload/{assignment_id}")
async def upload_submission_file(
    assignment_id: int,
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    student: User = Depends(require_role("student")),
):
    """Upload a file as part of a submission."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    ext = Path(file.filename or "unknown").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

    _ensure_upload_dir()
    unique_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = UPLOAD_DIR / unique_name

    content = await file.read()
    file_path.write_bytes(content)

    # Create a submission record for the uploaded file
    submission = Submission(
        assignment_id=assignment_id,
        student_id=student.id,
        content=f"[Uploaded file: {file.filename}]",
        file_name=file.filename,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "id": submission.id,
        "message": "File uploaded and submission created",
        "file_name": file.filename,
        "file_size": len(content),
        "file_path": str(file_path.relative_to(Path(__file__).parents[4])),
        "submission_id": submission.id,
    }


@router.get("/download/{submission_id}")
def download_submission_file(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download a submitted file."""
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Permission check
    if current_user.role == "student" and submission.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only download your own submissions")

    if not submission.file_name:
        raise HTTPException(status_code=404, detail="No file attached to this submission")

    # Find the file in uploads directory
    _ensure_upload_dir()
    for f in UPLOAD_DIR.iterdir():
        if f.name.endswith(f"_{submission.file_name}"):
            return FileResponse(f, filename=submission.file_name, media_type="application/octet-stream")

    raise HTTPException(status_code=404, detail="File not found on disk — may have been deleted")


@router.get("/uploads")
def list_uploaded_files(
    db: Session = Depends(get_db),
    teacher: User = Depends(require_role("teacher")),
):
    """List all uploaded files (teacher only)."""
    submissions_with_files = db.query(Submission).filter(Submission.file_name.isnot(None)).all()
    return [
        {
            "submission_id": s.id,
            "assignment_id": s.assignment_id,
            "student_id": s.student_id,
            "file_name": s.file_name,
            "created_at": s.created_at,
        }
        for s in submissions_with_files
    ]
