from collections import defaultdict
from typing import DefaultDict, Set

from fastapi import WebSocket


class ConnectionManager:
    """Tracks user websocket connections for broadcasting."""

    def __init__(self) -> None:
        self.active_connections: DefaultDict[int, Set[WebSocket]] = defaultdict(set)

    async def connect(self, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[user_id].add(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket) -> None:
        conns = self.active_connections.get(user_id)
        if conns and websocket in conns:
            conns.remove(websocket)
            if not conns:
                self.active_connections.pop(user_id, None)

    async def send_personal(self, user_id: int, message: dict) -> None:
        for ws in list(self.active_connections.get(user_id, [])):
            await ws.send_json(message)

    async def broadcast_users(self, user_ids: set[int], message: dict) -> None:
        for uid in user_ids:
            await self.send_personal(uid, message)
