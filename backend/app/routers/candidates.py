from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.database import get_db

from app.models.candidate import Candidate
from app.models.candidate_match import CandidateMatch
from app.models.job import Job
from app.models.user import User

from app.schemas.candidate import (
    CandidateResponse,
    CandidateDetailResponse,
    CandidateReviewRequest,
)
from app.schemas.candidate_match import CandidateMatchResponse

from app.services.matching_service import match_candidate


router = APIRouter(
    prefix="/api/v1/candidates",
    tags=["Candidates"],
)

@router.get("/",
    response_model=list[CandidateResponse],
)
def get_candidates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    candidates = (
        db.query(Candidate)
        .order_by(Candidate.created_at.desc())
        .all()
    )

    result = []

    for candidate in candidates:
        match = (
            db.query(CandidateMatch)
            .filter(
                CandidateMatch.candidate_id == candidate.id
            )
            .order_by(CandidateMatch.created_at.desc())
            .first()
        )

        result.append(
            {
                "id": candidate.id,
                "resume_id": candidate.resume_id,
                "name": candidate.name,
                "email": candidate.email,
                "phone": candidate.phone,
                "skills": candidate.skills,
                "experience": candidate.experience,
                "education": candidate.education,
                "review_status": candidate.review_status,
                "created_at": candidate.created_at,
                "match_score": (
                    match.match_score
                    if match
                    else None
                ),
            }
        )

    return result


@router.get(
    "/{candidate_id}",
    response_model=CandidateDetailResponse,
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

    matches = db.query(CandidateMatch).filter(
        CandidateMatch.candidate_id == candidate_id
    ).all()

    return {
        "id": candidate.id,
        "resume_id": candidate.resume_id,
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "skills": candidate.skills,
        "experience": candidate.experience,
        "education": candidate.education,
        "review_status": candidate.review_status,
        "created_at": candidate.created_at,
        "matches": matches,
    }


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


@router.get(
    "/{candidate_id}/matches",
    response_model=list[CandidateMatchResponse],
)
def get_candidate_matches(
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

    matches = db.query(CandidateMatch).filter(
        CandidateMatch.candidate_id == candidate_id
    ).all()

    return matches


@router.patch(
    "/{candidate_id}/review",
    response_model=CandidateResponse,
)
def update_candidate_review(
    candidate_id: int,
    request: CandidateReviewRequest,
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

    candidate.review_status = request.review_status

    db.commit()
    db.refresh(candidate)

    return candidate

