from typing import List, Optional
from app.core.exceptions import NotFoundException
from app.db.models.storage_unit import StorageUnit
from app.db.repositories.storage_repository import StorageRepository
from app.schemas.storage import StorageUnitCreate, StorageUnitOut, StorageUnitUpdate


class StorageService:
    def __init__(self, storage_repo: StorageRepository):
        self.storage_repo = storage_repo

    async def create_storage_unit(self, payload: StorageUnitCreate) -> StorageUnitOut:
        unit = StorageUnit(
            name=payload.name,
            location_village=payload.location_village,
            location_state=payload.location_state,
            capacity_kg=payload.capacity_kg,
            target_temp_min=payload.target_temp_min,
            target_temp_max=payload.target_temp_max,
            target_humidity_min=payload.target_humidity_min,
            target_humidity_max=payload.target_humidity_max,
        )
        created = await self.storage_repo.create(unit)
        return StorageUnitOut.model_validate(created)

    async def get_storage_unit(self, unit_id: str) -> StorageUnitOut:
        unit = await self.storage_repo.get(unit_id)
        if not unit:
            raise NotFoundException(f"Storage unit '{unit_id}' was not found")
        return StorageUnitOut.model_validate(unit)

    async def list_storage_units(self, limit: int = 100, offset: int = 0) -> List[StorageUnitOut]:
        units = await self.storage_repo.get_all(limit=limit, offset=offset)
        return [StorageUnitOut.model_validate(u) for u in units]
