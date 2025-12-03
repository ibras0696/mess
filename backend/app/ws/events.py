from enum import StrEnum
from typing import Any, TypedDict


class ClientEventType(StrEnum):
    SEND_MESSAGE = "send_message"
    TYPING_START = "typing_start"
    TYPING_STOP = "typing_stop"


class ServerEventType(StrEnum):
    MESSAGE_SENT = "message_sent"
    NEW_MESSAGE = "new_message"
    TYPING = "typing"


class SendMessagePayload(TypedDict):
    temp_id: str
    conversation_id: int
    text: str
    attachments: list[Any]


class TypingPayload(TypedDict):
    conversation_id: int
