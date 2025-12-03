from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.chat_repo import ChatRepository, MessageRepository
from app.schemas.chat import ChatCreate, ChatRead, MessageRead


class ChatService:
    def __init__(self, session: Session):
        self.session = session
        self.chat_repo = ChatRepository(session)
        self.message_repo = MessageRepository(session)

    def create_chat(self, current_user_id: int, payload: ChatCreate) -> ChatRead:
        members = set(payload.members)
        members.add(current_user_id)

        chat = self.chat_repo.create_chat(type_=payload.type, title=payload.title)
        self.session.flush()
        self.chat_repo.add_members(chat.id, members)
        self.session.commit()
        self.session.refresh(chat)
        return ChatRead.model_validate(chat)

    def list_chats_for_user(self, user_id: int) -> list[ChatRead]:
        chats = self.chat_repo.list_chats_for_user(user_id)
        return [ChatRead.model_validate(c) for c in chats]

    def list_messages(self, chat_id: int, user_id: int, limit: int, before_id: int | None) -> list[MessageRead]:
        if not self.chat_repo.is_member(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of this chat")
        messages = self.message_repo.list_messages(chat_id=chat_id, limit=limit, before_id=before_id)
        return [MessageRead.model_validate(m) for m in messages]

    def send_message(self, chat_id: int, user_id: int, text: str) -> MessageRead:
        if not self.chat_repo.is_member(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of this chat")
        msg = self.message_repo.create_message(chat_id=chat_id, sender_id=user_id, text=text)
        self.session.commit()
        self.session.refresh(msg)
        return MessageRead.model_validate(msg)
