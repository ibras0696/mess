from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.models.base import Base


class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True)
    message_id = Column(Integer, ForeignKey("messages.id", ondelete="CASCADE"), nullable=False, index=True)
    object_key = Column(String(512), nullable=False)
    file_name = Column(String(255), nullable=False)
    content_type = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    size_bytes = Column(Integer, nullable=True)
    url = Column(Text, nullable=True)

    message = relationship("Message", back_populates="attachments")
