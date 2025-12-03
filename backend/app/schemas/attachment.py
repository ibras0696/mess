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


class AttachmentMeta(BaseModel):
    object_key: str
    file_name: str
    content_type: str
    size_bytes: int | None = None
    url: str | None = None


class AttachmentRead(BaseModel):
    id: int
    object_key: str
    file_name: str
    content_type: str
    size_bytes: int | None = None
    url: str | None = None
    created_at: str

    class Config:
        from_attributes = True
