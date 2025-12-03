from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, Field

from app.api.dependencies.auth import get_current_user_id
from app.core.database import get_session
from app.schemas.attachment import AttachmentMeta
from app.schemas.chat import ChatCreate, ChatRead, MessageCreate, MessageRead
from app.services.chat_service import ChatService

router = APIRouter(prefix="/api/chats", tags=["chats"])


class SendMessageRequest(BaseModel):
    text: str = Field(min_length=1)
    attachments: list[AttachmentMeta] = []


@router.post("", response_model=ChatRead, status_code=status.HTTP_201_CREATED)
def create_chat(payload: ChatCreate, session=Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return ChatService(session).create_chat(user_id, payload)


@router.get("", response_model=list[ChatRead])
def list_chats(session=Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return ChatService(session).list_chats_for_user(user_id)


@router.get("/{chat_id}/messages", response_model=list[MessageRead])
def list_messages(
    chat_id: int,
    limit: int = Query(default=50, ge=1, le=100),
    before_id: Optional[int] = Query(default=None),
    session=Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    return ChatService(session).list_messages(chat_id=chat_id, user_id=user_id, limit=limit, before_id=before_id)


@router.post("/{chat_id}/messages", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
def send_message(
    chat_id: int,
    payload: SendMessageRequest,
    session=Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    msg_create = MessageCreate(text=payload.text, attachments=payload.attachments)
    return ChatService(session).send_message(chat_id=chat_id, user_id=user_id, data=msg_create)
