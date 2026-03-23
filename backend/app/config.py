import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "GradeAI"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    API_V1_STR: str = "/api/v1"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "gradeai_db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretkey")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")

settings = Settings()

if settings.ENVIRONMENT == "production" and settings.JWT_SECRET == "supersecretkey":
    raise ValueError("You must set a secure JWT_SECRET in production!")
