from pydantic import Field
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

    mailhog_host: str = Field(default="mailhog", alias="MAILHOG_HOST")
    mailhog_port: int = Field(default=1025, alias="MAILHOG_PORT")

    secret_key: str = Field(default="dev-secret-key", alias="SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


settings = Settings()
