from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi import HTTPException

from app.core.config import settings
from app.schemas.candidate import CandidateAIResult


llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    google_api_key=settings.google_api_key,
    temperature=0,
)

structured_llm = llm.with_structured_output(
    CandidateAIResult
)


def analyze_resume(resume_text: str) -> CandidateAIResult:

    prompt = f"""
Analyze the following resume and extract candidate information.

Extract:
- name
- email
- phone
- skills
- experience
- education

If any information is not available, return null.

Resume:
{resume_text}
"""

    try:
        result = structured_llm.invoke(prompt)
        return result

    except Exception as e:
        error_message = str(e).lower()

        if (
            "quota" in error_message
            or "rate limit" in error_message
            or "429" in error_message
            or "resource exhausted" in error_message
        ):
            raise HTTPException(
                status_code=429,
                detail="AI service limit reached. Please try again later.",
            )

        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable. Please try again.",
        )