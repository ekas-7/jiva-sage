import os
from pathlib import Path
from typing import Dict, Any, Optional, List
from pydantic import BaseSettings, validator, AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Base settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Lab Report OCR API"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # MongoDB Settings
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "Jiva_lab_reports"
    
    # Auth Settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Claude API Settings
    ANTHROPIC_API_KEY: str
    CLAUDE_MODEL: str = "claude-3-5-sonnet-20240229"  # Use latest available Claude model
    
    # Storage Settings
    TEMP_FILE_PATH: str = "/tmp/lab_reports"
    
    # Validation
    @field_validator("BACKEND_CORS_ORIGINS")
    def assemble_cors_origins(cls, v: List[str]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True)


settings = Settings()

# Ensure temporary directory exists
os.makedirs(settings.TEMP_FILE_PATH, exist_ok=True)