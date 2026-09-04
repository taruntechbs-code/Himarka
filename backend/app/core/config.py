from functools import lru_cache
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # General
    APP_NAME: str = "HIMARKA"
    APP_ENV: str = "development"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # Server
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_V1_PREFIX: str = "/api/v1"

    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./himarka_dev.db"

    # Security
    SECRET_KEY: str = "himarka-insecure-development-secret-key-change-in-production-12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Firebase Integration
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_DATABASE_URL: str = ""
    FIREBASE_CREDENTIALS_PATH: str = ""

    # IoT Security
    IOT_DEVICE_SHARED_SECRET: str = "himarka-iot-secret-key"
    IOT_MAX_CLOCK_SKEW_SECONDS: int = 300

    # AI Subsystem
    GEMINI_API_KEY: str = ""
    AI_MODEL_REGISTRY_DIR: str = "./ai/models/registry"
    AI_CHECKPOINTS_DIR: str = "./ai/models/checkpoints"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
