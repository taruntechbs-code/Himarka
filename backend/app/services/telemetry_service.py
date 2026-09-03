from datetime import datetime
from typing import List, Optional
from app.core.exceptions import DeviceNotFoundException
from app.db.repositories.device_repository import DeviceRepository
from app.db.repositories.telemetry_repository import TelemetryRepository
from app.schemas.telemetry import TelemetryRecordOut, TelemetrySummary


class TelemetryService:
    def __init__(self, telemetry_repo: TelemetryRepository, device_repo: DeviceRepository):
        self.telemetry_repo = telemetry_repo
        self.device_repo = device_repo

    async def get_latest_telemetry(self, device_id: str) -> Optional[TelemetryRecordOut]:
        record = await self.telemetry_repo.get_latest_by_device(device_id)
        if not record:
            return None
        return TelemetryRecordOut.model_validate(record)

    async def get_telemetry_history(
        self,
        device_id: Optional[str] = None,
        storage_unit_id: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[TelemetryRecordOut]:
        records = await self.telemetry_repo.get_history(
            device_id=device_id,
            storage_unit_id=storage_unit_id,
            start_time=start_time,
            end_time=end_time,
            limit=limit,
        )
        return [TelemetryRecordOut.model_validate(r) for r in records]
