import html

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.redis import get_redis
from app.core.rate_limit import check_rate_limit
from app.repositories.chat_repo import ChatRepository, MessageRepository
from app.repositories.user_repo import UserRepository
from app.schemas.attachment import AttachmentMeta
from app.schemas.chat import ChatCreate, ChatRead, MessageCreate, MessageRead
from app.workers.celery_app import celery_app


class ChatService:
    def __init__(self, session: Session):
        self.session = session
        self.chat_repo = ChatRepository(session)
        self.message_repo = MessageRepository(session)
        self.user_repo = UserRepository(session)
        self.redis = get_redis()

    def create_chat(self, current_user_id: int, payload: ChatCreate) -> ChatRead:
        members = set(payload.members)
        members.add(current_user_id)
        check_rate_limit(f"rate:chat_create:{current_user_id}", limit=20)

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

    def send_message(self, chat_id: int, user_id: int, data: MessageCreate) -> MessageRead:
        if not self.chat_repo.is_member(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of this chat")
        self._check_rate_limit(user_id)
        safe_text = html.escape(data.text).strip()
        if not safe_text:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty message")
        msg = self.message_repo.create_message(chat_id=chat_id, sender_id=user_id, text=safe_text)
        if data.attachments:
            attachment_repo = AttachmentRepository(self.session)
            items = [a.model_dump() for a in data.attachments]
            attachment_repo.bulk_create(message_id=msg.id, items=items)
        self.session.commit()
        self.session.refresh(msg)
        self._notify_email(chat_id=chat_id, sender_id=user_id, text=safe_text)
        return MessageRead.model_validate(msg)

    def get_member_ids(self, chat_id: int) -> set[int]:
        return set(self.chat_repo.get_member_ids(chat_id))

    def _notify_email(self, chat_id: int, sender_id: int, text: str) -> None:
        member_ids = self.get_member_ids(chat_id) - {sender_id}
        if not member_ids:
            return
        online_ids = {int(uid) for uid in self.redis.smembers("online_users")}
        offline_ids = member_ids - online_ids
        if not offline_ids:
            return
        users = self.user_repo.list_by_ids(list(member_ids))
        emails = [u.email for u in users if u.email]
        if not emails:
            return
        celery_app.send_task(
            "email.offline_notification",
            kwargs={
                "to_emails": emails,
                "subject": "New message",
                "body": f"New message in chat {chat_id}: {text}",
            },
        )

    def _check_rate_limit(self, user_id: int) -> None:
        check_rate_limit(f"rate:msg:{user_id}", settings.rate_limit_messages_per_minute)
