from datetime import timedelta
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized application settings loaded from environment."""

    env: str = Field(default="local", alias="ENV")
    app_name: str = Field(default="web-messenger", alias="APP_NAME")

    database_url: str = Field(
        default="postgresql+psycopg2://messenger:messenger@db:5432/messenger",
        alias="DATABASE_URL",
    )
    redis_url: str = Field(default="redis://redis:6379/0", alias="REDIS_URL")

    minio_endpoint: str = Field(default="http://minio:9000", alias="MINIO_ENDPOINT")
    minio_access_key: str = Field(default="minio", alias="MINIO_ACCESS_KEY")
    minio_secret_key: str = Field(default="miniosecret", alias="MINIO_SECRET_KEY")
    minio_bucket: str = Field(default="attachments", alias="MINIO_BUCKET")
    presign_expire_seconds: int = Field(default=600, alias="PRESIGN_EXPIRE_SECONDS")

    mailhog_host: str = Field(default="mailhog", alias="MAILHOG_HOST")
    mailhog_port: int = Field(default=1025, alias="MAILHOG_PORT")
    mail_from: str = Field(default="noreply@example.com", alias="MAIL_FROM")

    secret_key: str = Field(default="dev-secret-key", alias="SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_minutes: int = Field(default=30, alias="ACCESS_TOKEN_MINUTES")
    refresh_token_minutes: int = Field(default=60 * 24 * 7, alias="REFRESH_TOKEN_MINUTES")  # 7 days
    rate_limit_messages_per_minute: int = Field(default=60, alias="RATE_LIMIT_MESSAGES_PER_MINUTE")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    @property
    def access_token_ttl(self) -> timedelta:
        return timedelta(minutes=self.access_token_minutes)

    @property
    def refresh_token_ttl(self) -> timedelta:
        return timedelta(minutes=self.refresh_token_minutes)

    @field_validator("secret_key")
    @classmethod
    def validate_secret(cls, v: str) -> str:
        if not v:
            raise ValueError("SECRET_KEY must not be empty")
        return v


settings = Settings()
