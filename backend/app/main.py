from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.database import engine
from app.database.base import Base

from app.routers import auth,jobs,resumes,candidates

from app.models import user, job,resume ,candidate,candidate_match

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered resume screening and candidate matching platform.",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {
        "message": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(resumes.router)
app.include_router(candidates.router)