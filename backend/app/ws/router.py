import json
from typing import Any

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, status
from starlette.concurrency import run_in_threadpool

from app.api.dependencies.auth import get_current_user_id
from app.core.database import SessionLocal
from app.services.chat_service import ChatService
from app.ws.connection_manager import ConnectionManager
from app.ws.events import ClientEventType, ServerEventType, TypingPayload
from app.schemas.attachment import AttachmentMeta
from app.schemas.chat import MessageCreate
from app.repositories.receipt_repo import ReceiptRepository
from app.core.redis import get_redis

router = APIRouter()
manager = ConnectionManager()


async def get_current_user_id_ws(websocket: WebSocket) -> int:
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise RuntimeError("Missing token")
    from app.core.security import decode_token

    data = decode_token(token)
    if not data or data.get("type") != "access" or "sub" not in data:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise RuntimeError("Invalid token")
    return int(data["sub"])


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, user_id: int = Depends(get_current_user_id_ws)):
    redis = get_redis()
    redis.sadd("online_users", user_id)
    await manager.connect(user_id, websocket)

    async def handle_send_message(chat_id: int, text: str, attachments: list[AttachmentMeta], temp_id: str | None):
        def _work():
            with SessionLocal() as session:
                service = ChatService(session)
                msg = service.send_message(
                    chat_id=chat_id,
                    user_id=user_id,
                    data=MessageCreate(text=text, attachments=attachments),
                )
                member_ids = service.get_member_ids(chat_id)
                payload = msg.model_dump(mode="json")
                return payload, member_ids

        payload, member_ids = await run_in_threadpool(_work)
        await manager.send_personal(
            user_id,
            {
                "type": ServerEventType.MESSAGE_SENT,
                "temp_id": temp_id,
                "message": payload,
            },
        )
        await manager.broadcast_users(
            member_ids,
            {
                "type": ServerEventType.NEW_MESSAGE,
                "conversation_id": chat_id,
                "message": payload,
            },
        )

    async def fetch_member_ids(chat_id: int) -> set[int]:
        def _work():
            with SessionLocal() as session:
                return ChatService(session).get_member_ids(chat_id)

        return await run_in_threadpool(_work)

    async def mark_delivered(message_id: int) -> set[int] | None:
        def _work():
            with SessionLocal() as session:
                service = ChatService(session)
                msg_obj = service.chat_repo.get_message(message_id)
                if not msg_obj or not service.chat_repo.is_member(msg_obj.chat_id, user_id):
                    return None
                receipt_repo = ReceiptRepository(session)
                receipt_repo.mark_delivered(message_id=message_id, user_id=user_id)
                session.commit()
                return service.get_member_ids(msg_obj.chat_id)

        return await run_in_threadpool(_work)

    async def mark_read(message_id: int) -> set[int] | None:
        def _work():
            with SessionLocal() as session:
                service = ChatService(session)
                msg_obj = service.chat_repo.get_message(message_id)
                if not msg_obj or not service.chat_repo.is_member(msg_obj.chat_id, user_id):
                    return None
                receipt_repo = ReceiptRepository(session)
                receipt_repo.mark_read(message_id=message_id, user_id=user_id)
                session.commit()
                return service.get_member_ids(msg_obj.chat_id)

        return await run_in_threadpool(_work)

    try:
        while True:
            message_text = await websocket.receive_text()
            try:
                data: dict[str, Any] = json.loads(message_text)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "detail": "invalid json"})
                continue

            event_type = data.get("type")
            if event_type == ClientEventType.SEND_MESSAGE:
                temp_id = data.get("temp_id")
                chat_id = data.get("conversation_id")
                text = data.get("text")
                attachments = data.get("attachments", [])
                if not chat_id or not text:
                    await websocket.send_json({"type": "error", "detail": "invalid payload"})
                    continue
                attach_objs = [AttachmentMeta(**a) for a in attachments]
                await handle_send_message(chat_id=chat_id, text=text, attachments=attach_objs, temp_id=temp_id)
            elif event_type in (ClientEventType.TYPING_START, ClientEventType.TYPING_STOP):
                payload: TypingPayload = data  # type: ignore
                chat_id = payload.get("conversation_id")
                if not chat_id:
                    continue
                member_ids = await fetch_member_ids(chat_id)
                await manager.broadcast_users(
                    member_ids,
                    {
                        "type": ServerEventType.TYPING,
                        "conversation_id": chat_id,
                        "user_id": user_id,
                        "is_typing": event_type == ClientEventType.TYPING_START,
                    },
                )
            elif event_type == ClientEventType.DELIVERED:
                message_id = data.get("message_id")
                if not message_id:
                    continue
                member_ids = await mark_delivered(message_id=message_id)
                if not member_ids:
                    continue
                await manager.broadcast_users(
                    member_ids,
                    {"type": ServerEventType.DELIVERED, "message_id": message_id, "user_id": user_id},
                )
            elif event_type == ClientEventType.READ:
                message_id = data.get("message_id")
                if not message_id:
                    continue
                member_ids = await mark_read(message_id=message_id)
                if not member_ids:
                    continue
                await manager.broadcast_users(
                    member_ids,
                    {"type": ServerEventType.READ, "message_id": message_id, "user_id": user_id},
                )
            else:
                await websocket.send_json({"type": "error", "detail": "unknown event"})
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
        redis.srem("online_users", user_id)
