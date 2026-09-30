from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CandidateAIResult(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: str | None = None
    experience: str | None = None
    education: str | None = None


class CandidateResponse(BaseModel):
    id: int
    resume_id: int
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: str | None = None
    experience: str | None = None
    education: str | None = None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )