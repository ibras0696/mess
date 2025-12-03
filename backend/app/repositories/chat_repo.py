from typing import Iterable, List, Optional, Sequence

from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.models.chat import Chat, ChatMember, Message


class ChatRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_chat(self, type_: str, title: str | None) -> Chat:
        chat = Chat(type=type_, title=title)
        self.session.add(chat)
        return chat

    def add_members(self, chat_id: int, member_ids: Iterable[int]) -> None:
        for uid in set(member_ids):
            self.session.add(ChatMember(chat_id=chat_id, user_id=uid))

    def get_user_chat_ids(self, user_id: int) -> List[int]:
        stmt = select(ChatMember.chat_id).where(ChatMember.user_id == user_id)
        return [row[0] for row in self.session.execute(stmt).all()]

    def list_chats_for_user(self, user_id: int) -> Sequence[Chat]:
        chat_ids = self.get_user_chat_ids(user_id)
        if not chat_ids:
            return []
        stmt = select(Chat).where(Chat.id.in_(chat_ids)).order_by(Chat.created_at.desc())
        return list(self.session.scalars(stmt).all())

    def is_member(self, chat_id: int, user_id: int) -> bool:
        stmt = select(ChatMember).where(and_(ChatMember.chat_id == chat_id, ChatMember.user_id == user_id))
        return self.session.scalar(stmt) is not None

    def get_chat(self, chat_id: int) -> Optional[Chat]:
        return self.session.get(Chat, chat_id)


class MessageRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_message(self, chat_id: int, sender_id: int, text: str) -> Message:
        message = Message(chat_id=chat_id, sender_id=sender_id, text=text)
        self.session.add(message)
        return message

    def list_messages(self, chat_id: int, limit: int = 50, before_id: int | None = None) -> Sequence[Message]:
        stmt = select(Message).where(Message.chat_id == chat_id)
        if before_id:
            stmt = stmt.where(Message.id < before_id)
        stmt = stmt.order_by(Message.id.desc()).limit(limit)
        return list(self.session.scalars(stmt).all())
