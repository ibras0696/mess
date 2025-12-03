from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.models.base import Base


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    type = Column(String(20), nullable=False)  # dialog | group
    title = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    members = relationship("ChatMember", back_populates="chat", cascade="all, delete")


class ChatMember(Base):
    __tablename__ = "chat_members"

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    chat = relationship("Chat", back_populates="members")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(Integer, nullable=False, index=True)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
