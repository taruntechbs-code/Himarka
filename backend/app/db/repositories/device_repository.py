from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.device import Device
from app.db.repositories.base_repository import BaseRepository


class DeviceRepository(BaseRepository[Device]):
    def __init__(self, session: AsyncSession):
        super().__init__(Device, session)

    async def get_by_device_id(self, device_id: str) -> Optional[Device]:
        stmt = select(Device).where(Device.device_id == device_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_storage_unit(self, storage_unit_id: str) -> List[Device]:
        stmt = select(Device).where(Device.storage_unit_id == storage_unit_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
