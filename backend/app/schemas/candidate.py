from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

from app.schemas.candidate_match import CandidateMatchResponse


class CandidateAIResult(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: str | None = None
    experience: str | None = None
    education: str | None = None


class CandidateReviewRequest(BaseModel):
    review_status: Literal[
        "UNDER_REVIEW",
        "SHORTLISTED",
        "REJECTED",
    ]


class CandidateResponse(BaseModel):
    id: int
    resume_id: int
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: str | None = None
    experience: str | None = None
    education: str | None = None
    review_status: Literal[
        "UNDER_REVIEW",
        "SHORTLISTED",
        "REJECTED",
    ]
    created_at: datetime
    match_score: float | None = None
    model_config = ConfigDict(from_attributes=True)


class CandidateDetailResponse(BaseModel):
    id: int
    resume_id: int
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: str | None = None
    experience: str | None = None
    education: str | None = None
    review_status: Literal[
        "UNDER_REVIEW",
        "SHORTLISTED",
        "REJECTED",
    ]
    created_at: datetime
    matches: list[CandidateMatchResponse] = []

    model_config = ConfigDict(from_attributes=True)
