from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.models.job import Job
from app.schemas.job import JobCreate, JobResponse


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