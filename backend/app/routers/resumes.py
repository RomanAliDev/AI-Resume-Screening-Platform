import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_current_user
from app.database.database import get_db
from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.models.candidate import Candidate
from app.services.ai_service import analyze_resume
from app.services.resume_parser import extract_text


router = APIRouter(
    prefix="/api/v1/resumes",
    tags=["Resumes"],
)


@router.post(
    "/upload",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_resume(
    job_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    allowed_types = {
        "application/pdf": "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed",
        )

    os.makedirs(settings.upload_dir, exist_ok=True)
    original_filename = file.filename

    file_extension = allowed_types[file.content_type]
    unique_filename = f"{uuid4()}.{file_extension}"

    file_path = os.path.join(
        settings.upload_dir,
        unique_filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text(
        file_path=file_path,
        file_type=file_extension,
    )   

    ai_result = analyze_resume(resume_text)

    resume = Resume(
        job_id=job_id,
        filename=original_filename,
        file_path=file_path,
        file_type=file_extension,
        status="UPLOADED",
        extracted_text=resume_text,
        uploaded_by=current_user.id,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    candidate = Candidate(
        resume_id=resume.id,
        name=ai_result.name,
        email=ai_result.email,
        phone=ai_result.phone,
        skills=ai_result.skills,
        experience=ai_result.experience,
        education=ai_result.education,
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return resume