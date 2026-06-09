from __future__ import annotations

import json
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import jwt

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class ConnectionManager:
    """Manages WebSocket connections grouped by user role and user ID."""

    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str, role: str):
        await websocket.accept()
        key = f"{role}:{user_id}"
        self.active_connections.setdefault(key, []).append(websocket)
        logger.info("WebSocket connected: %s", key)

    def disconnect(self, websocket: WebSocket, user_id: str, role: str):
        key = f"{role}:{user_id}"
        conns = self.active_connections.get(key, [])
        if websocket in conns:
            conns.remove(websocket)
        if not conns:
            self.active_connections.pop(key, None)
        logger.info("WebSocket disconnected: %s", key)

    async def send_to_user(self, user_id: str, role: str, data: dict):
        key = f"{role}:{user_id}"
        for ws in self.active_connections.get(key, []):
            try:
                await ws.send_json(data)
            except Exception:
                pass

    async def broadcast_to_role(self, role: str, data: dict):
        for key, conns in self.active_connections.items():
            if key.startswith(f"{role}:"):
                for ws in conns:
                    try:
                        await ws.send_json(data)
                    except Exception:
                        pass


manager = ConnectionManager()

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    """WebSocket endpoint for real-time notifications and updates.
    Connect from frontend: new WebSocket(`ws://localhost:8000/api/ws/${token}`)
    Falls back gracefully to polling if WebSocket fails."""
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = str(payload.get("sub", "0"))
        role = str(payload.get("role", "unknown"))
    except Exception:
        await websocket.close(code=4001, reason="Invalid token")
        return

    await manager.connect(websocket, user_id, role)

    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                msg_type = message.get("type", "ping")

                if msg_type == "ping":
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    })
                elif msg_type == "notification":
                    # Broadcast to target user
                    target_id = message.get("target_user_id")
                    target_role = message.get("target_role", "student")
                    if target_id:
                        await manager.send_to_user(str(target_id), target_role, {
                            "type": "notification",
                            "title": message.get("title", "Update"),
                            "body": message.get("body", ""),
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        })
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "detail": "Invalid JSON"})

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id, role)
