from typing import Any, Dict
from app.integrations.firebase.client import FirebaseClient


class FirebaseRealtimeService:
    def __init__(self, client: FirebaseClient):
        self.client = client

    async def broadcast_telemetry(self, device_id: str, telemetry_data: Dict[str, Any]) -> bool:
        return await self.client.sync_telemetry_record(device_id, telemetry_data)

    def is_available(self) -> bool:
        return self.client.is_connected
