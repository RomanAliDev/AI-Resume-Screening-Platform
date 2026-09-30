from langchain_google_genai import ChatGoogleGenerativeAI

from app.core.config import settings
from app.schemas.candidate_match import CandidateMatchAIResult


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.google_api_key,
    temperature=0,
)

structured_llm = llm.with_structured_output(
    CandidateMatchAIResult
)


def match_candidate(
    job_description: str,
    candidate_name: str | None,
    candidate_skills: str | None,
    candidate_experience: str | None,
    candidate_education: str | None,
) -> CandidateMatchAIResult:

    prompt = f"""
Compare the candidate with the job description.

Job Description:
{job_description}

Candidate:
Name: {candidate_name}
Skills: {candidate_skills}
Experience: {candidate_experience}
Education: {candidate_education}

Return:
- match_score: score from 0 to 100
- matched_skills: skills matching the job
- missing_skills: important skills missing
- explanation: short explanation of the match

Do not invent candidate information.
"""

    result = structured_llm.invoke(prompt)

    return result