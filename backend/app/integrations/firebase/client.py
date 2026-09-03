from typing import Any, Dict, Optional
from app.core.config import get_settings
from app.core.logging import logger

settings = get_settings()


class FirebaseClient:
    """Encapsulated Firebase Client abstraction.
    Guarantees no raw Firebase dependencies bleed into API routes or business logic.
    """

    def __init__(self):
        self.project_id = settings.FIREBASE_PROJECT_ID
        self.database_url = settings.FIREBASE_DATABASE_URL
        self._initialized = False
        self._check_initialization()

    def _check_initialization(self) -> None:
        if self.project_id and self.database_url:
            self._initialized = True
            logger.info("Firebase integration initialized with project: %s", self.project_id)
        else:
            logger.info("Firebase integration running in stub / inactive mode (credentials not provided)")

    @property
    def is_connected(self) -> bool:
        return self._initialized

    async def sync_telemetry_record(self, device_id: str, record: Dict[str, Any]) -> bool:
        if not self._initialized:
            logger.debug(f"Firebase inactive: skipping telemetry sync for {device_id}")
            return False
        # Future Firebase RTDB / Firestore REST/SDK push
        logger.info(f"Syncing telemetry for device {device_id} to Firebase RTDB path /telemetry/{device_id}")
        return True

    async def get_device_shadow(self, device_id: str) -> Optional[Dict[str, Any]]:
        if not self._initialized:
            return None
        return None
