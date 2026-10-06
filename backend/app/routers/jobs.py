from fastapi import APIRouter, Depends, status ,HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.models.job import Job
from app.schemas.job import JobCreate, JobResponse
from app.models.resume import Resume
from app.models.candidate import Candidate

router = APIRouter(
    prefix="/api/v1/jobs",
    tags=["Jobs"],
)


@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    job = Job(
        title=job_data.title,
        description=job_data.description,
        created_by=current_user.id,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job

@router.get(
    "",
    response_model=list[JobResponse],
)
def get_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    jobs = (
        db.query(Job)
        .order_by(Job.created_at.desc())
        .all()
    )

    return jobs


@router.get("/stats")
def get_job_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_jobs = db.query(Job).count()

    total_resumes = db.query(Resume).count()

    total_candidates = db.query(Candidate).count()

    shortlisted = (
        db.query(Candidate)
        .filter(Candidate.review_status == "SHORTLISTED")
        .count()
    )

    return {
        "total_jobs": total_jobs,
        "total_resumes": total_resumes,
        "total_candidates": total_candidates,
        "shortlisted": shortlisted,
    }


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

    return job