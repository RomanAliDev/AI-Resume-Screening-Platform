from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.database import get_db
from app.models.candidate import Candidate
from app.models.user import User
from app.schemas.candidate import CandidateResponse
from app.models.job import Job
from app.models.candidate_match import CandidateMatch
from app.services.matching_service import match_candidate
from app.schemas.candidate_match import CandidateMatchResponse

router = APIRouter(
    prefix="/api/v1/candidates",
    tags=["Candidates"],
)


@router.get(
    "",
    response_model=list[CandidateResponse],
)
def get_candidates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    candidates = db.query(Candidate).all()

    return candidates


@router.get(
    "/{candidate_id}",
    response_model=CandidateResponse,
)
def get_candidate(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found",
        )

    return candidate

@router.post(
    "/{candidate_id}/match/{job_id}",
    response_model=CandidateMatchResponse,
)
def create_candidate_match(
    candidate_id: int,
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found",
        )

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    ai_result = match_candidate(
        job_description=job.description,
        candidate_name=candidate.name,
        candidate_skills=candidate.skills,
        candidate_experience=candidate.experience,
        candidate_education=candidate.education,
    )

    match = CandidateMatch(
        candidate_id=candidate.id,
        job_id=job.id,
        match_score=ai_result.match_score,
        matched_skills=ai_result.matched_skills,
        missing_skills=ai_result.missing_skills,
        explanation=ai_result.explanation,
    )

    db.add(match)
    db.commit()
    db.refresh(match)

    return match