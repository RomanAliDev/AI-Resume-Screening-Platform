import os
import shutil
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_current_user
from app.database.database import get_db

from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User
from app.models.candidate import Candidate
from app.models.candidate_match import CandidateMatch

from app.schemas.resume import ResumeResponse

from app.services.ai_service import analyze_resume
from app.services.resume_parser import extract_text
from app.services.matching_service import match_candidate


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
    job_id: int = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check job
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    # Allowed file types
    allowed_types = {
        "application/pdf": "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are allowed",
        )

    # Create upload directory
    os.makedirs(
        settings.upload_dir,
        exist_ok=True,
    )

    original_filename = file.filename

    file_extension = allowed_types[file.content_type]

    unique_filename = (
        f"{uuid4()}.{file_extension}"
    )

    file_path = os.path.join(
        settings.upload_dir,
        unique_filename,
    )

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # Extract resume text
    resume_text = extract_text(
        file_path=file_path,
        file_type=file_extension,
    )

    # AI resume analysis
    ai_result = analyze_resume(
        resume_text
    )

    # Create resume
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

    # Create candidate
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


    # AI candidate-job matching
    ai_match_result = match_candidate(
        job_description=job.description,
        candidate_name=candidate.name,
        candidate_skills=candidate.skills,
        candidate_experience=candidate.experience,
        candidate_education=candidate.education,
    )

    # Save AI match result
    candidate_match = CandidateMatch(
        candidate_id=candidate.id,
        job_id=job.id,
        match_score=ai_match_result.match_score,
        matched_skills=ai_match_result.matched_skills,
        missing_skills=ai_match_result.missing_skills,
        explanation=ai_match_result.explanation,
    )

    db.add(candidate_match)
    db.commit()
    db.refresh(candidate_match)

    return resume


@router.get(
    "/job/{job_id}",
    response_model=list[ResumeResponse],
)
def get_job_resumes(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check job
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    # Get resumes
    resumes = (
        db.query(Resume)
        .filter(Resume.job_id == job_id)
        .order_by(Resume.uploaded_at.desc())
        .all()
    )

    result = []

    for resume in resumes:
        candidate = (
            db.query(Candidate)
            .filter(
                Candidate.resume_id == resume.id
            )
            .first()
        )

        result.append(
            {
                "id": resume.id,
                "job_id": resume.job_id,
                "filename": resume.filename,
                "file_path": resume.file_path,
                "file_type": resume.file_type,
                "status": resume.status,
                "uploaded_by": resume.uploaded_by,
                "uploaded_at": resume.uploaded_at,
                "candidate_id": (
                    candidate.id
                    if candidate
                    else None
                ),
            }
        )

    return result