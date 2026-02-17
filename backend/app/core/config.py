from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "mdevia-tfm API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "mdevia_tfm"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: Optional[str] = None

    # Security
    SECRET_KEY: str = "changeme"  # Should be changed in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Storage Settings
    STORAGE_TYPE: str = "local" # local | cloudinary
    STORAGE_LOCAL_PATH: str = "storage"
    STORAGE_BASE_URL: str = "http://localhost:8000/static"
    
    # Cloudinary (Optional, used if STORAGE_TYPE=cloudinary)
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    CLOUDINARY_FOLDER: str = "mdevia_tfm"
    CLOUDINARY_WATERMARK_ID: Optional[str] = "My Brand/logoFR_wxpppf"

    @model_validator(mode="after")
    def assemble_db_connection(self) -> "Settings":
        if self.DATABASE_URL:
            # Render/Heroku sometimes provide postgres:// which SQLAlchemy/psycopg2 doesn't like
            if self.DATABASE_URL.startswith("postgres://"):
                self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        else:
            self.DATABASE_URL = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        return self

    model_config = SettingsConfigDict(
        case_sensitive=True, 
        env_file=(".env", "../.env"), 
        extra="ignore"
    )

settings = Settings()
