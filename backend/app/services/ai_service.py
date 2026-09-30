from langchain_google_genai import ChatGoogleGenerativeAI

from app.core.config import settings
from app.schemas.candidate import CandidateAIResult


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
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

    result = structured_llm.invoke(prompt)

    return result