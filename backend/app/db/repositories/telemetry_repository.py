from datetime import datetime
from typing import List, Optional
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.telemetry import TelemetryRecord
from app.db.repositories.base_repository import BaseRepository


class TelemetryRepository(BaseRepository[TelemetryRecord]):
    def __init__(self, session: AsyncSession):
        super().__init__(TelemetryRecord, session)

    async def get_latest_by_device(self, device_id: str) -> Optional[TelemetryRecord]:
        stmt = (
            select(TelemetryRecord)
            .where(TelemetryRecord.device_id == device_id)
            .order_by(desc(TelemetryRecord.timestamp))
            .limit(1)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_history(
        self,
        device_id: Optional[str] = None,
        storage_unit_id: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[TelemetryRecord]:
        stmt = select(TelemetryRecord).order_by(desc(TelemetryRecord.timestamp))
        if device_id:
            stmt = stmt.where(TelemetryRecord.device_id == device_id)
        if storage_unit_id:
            stmt = stmt.where(TelemetryRecord.storage_unit_id == storage_unit_id)
        if start_time:
            stmt = stmt.where(TelemetryRecord.timestamp >= start_time)
        if end_time:
            stmt = stmt.where(TelemetryRecord.timestamp <= end_time)

        stmt = stmt.limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
