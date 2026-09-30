from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResumeResponse(BaseModel):
    id: int
    job_id: int
    filename: str
    file_path: str
    file_type: str
    status: str
    uploaded_by: int
    uploaded_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )