from pydantic import BaseModel, Field


class PresignRequest(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    content_type: str = Field(min_length=1, max_length=255)
    size_bytes: int | None = None


class PresignResponse(BaseModel):
    url: str
    method: str = "PUT"
    expires_in: int
    object_key: str
