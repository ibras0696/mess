import json
from typing import Any

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, status

from app.api.dependencies.auth import get_current_user_id
from app.core.database import get_session
from app.services.chat_service import ChatService
from app.ws.connection_manager import ConnectionManager
from app.ws.events import ClientEventType, ServerEventType, TypingPayload

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
async def websocket_endpoint(
    websocket: WebSocket,
    session=Depends(get_session),
    user_id: int = Depends(get_current_user_id_ws),
):
    await manager.connect(user_id, websocket)
    service = ChatService(session)
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
                if not chat_id or not text:
                    await websocket.send_json({"type": "error", "detail": "invalid payload"})
                    continue
                msg = service.send_message(chat_id=chat_id, user_id=user_id, text=text)
                payload = msg.model_dump(mode="json")
                await manager.send_personal(
                    user_id,
                    {
                        "type": ServerEventType.MESSAGE_SENT,
                        "temp_id": temp_id,
                        "message": payload,
                    },
                )
                member_ids = service.get_member_ids(chat_id)
                await manager.broadcast_users(
                    member_ids,
                    {
                        "type": ServerEventType.NEW_MESSAGE,
                        "conversation_id": chat_id,
                        "message": payload,
                    },
                )
            elif event_type in (ClientEventType.TYPING_START, ClientEventType.TYPING_STOP):
                payload: TypingPayload = data  # type: ignore
                chat_id = payload.get("conversation_id")
                if not chat_id:
                    continue
                member_ids = service.get_member_ids(chat_id)
                await manager.broadcast_users(
                    member_ids,
                    {
                        "type": ServerEventType.TYPING,
                        "conversation_id": chat_id,
                        "user_id": user_id,
                        "is_typing": event_type == ClientEventType.TYPING_START,
                    },
                )
            else:
                await websocket.send_json({"type": "error", "detail": "unknown event"})
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
