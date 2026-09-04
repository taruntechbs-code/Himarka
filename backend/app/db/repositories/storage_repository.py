from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.storage_unit import StorageUnit
from app.db.repositories.base_repository import BaseRepository


class StorageRepository(BaseRepository[StorageUnit]):
    def __init__(self, session: AsyncSession):
        super().__init__(StorageUnit, session)

    async def get_active_units(self) -> List[StorageUnit]:
        stmt = select(StorageUnit).where(StorageUnit.is_active.is_(True))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
