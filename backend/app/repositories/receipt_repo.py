from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.receipt import MessageReceipt


class ReceiptRepository:
    def __init__(self, session: Session):
        self.session = session

    def _get(self, message_id: int, user_id: int) -> MessageReceipt | None:
        stmt = select(MessageReceipt).where(
            MessageReceipt.message_id == message_id,
            MessageReceipt.user_id == user_id,
        )
        return self.session.scalar(stmt)

    def mark_delivered(self, message_id: int, user_id: int) -> MessageReceipt:
        rec = self._get(message_id, user_id)
        now = datetime.now(timezone.utc)
        if rec:
            rec.delivered_at = rec.delivered_at or now
        else:
            rec = MessageReceipt(message_id=message_id, user_id=user_id, delivered_at=now)
            self.session.add(rec)
        return rec

    def mark_read(self, message_id: int, user_id: int) -> MessageReceipt:
        rec = self._get(message_id, user_id)
        now = datetime.now(timezone.utc)
        if rec:
            rec.read_at = now
            rec.delivered_at = rec.delivered_at or now
        else:
            rec = MessageReceipt(message_id=message_id, user_id=user_id, delivered_at=now, read_at=now)
            self.session.add(rec)
        return rec
