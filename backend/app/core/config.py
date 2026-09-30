from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Resume Screening Platform"
    app_version: str = "1.0.0"
    environment: str = "development"

    database_url: str

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    google_api_key: str = ""

    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"

    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()