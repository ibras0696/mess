from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field
from app.schemas.attachment import AttachmentMeta, AttachmentRead


ChatType = Literal["dialog", "group"]


class ChatCreate(BaseModel):
    type: ChatType
    title: Optional[str] = Field(default=None, max_length=255)
    members: list[int] = Field(default_factory=list, min_items=1)


class ChatRead(BaseModel):
    id: int
    type: ChatType
    title: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class MessageRead(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    text: str
    attachments: list[AttachmentRead] = Field(default_factory=list)
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    text: str
    attachments: list[AttachmentMeta] = Field(default_factory=list)
