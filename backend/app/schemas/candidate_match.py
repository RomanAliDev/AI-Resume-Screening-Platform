from datetime import datetime

from pydantic import BaseModel


class CandidateMatchAIResult(BaseModel):
    match_score: float
    matched_skills: str | None = None
    missing_skills: str | None = None
    explanation: str


class CandidateMatchResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    match_score: float
    matched_skills: str | None = None
    missing_skills: str | None = None
    explanation: str | None = None
    created_at: datetime

