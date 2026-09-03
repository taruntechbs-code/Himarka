from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.db.models.produce import ProduceBatch
from app.schemas.produce import ProduceBatchCreate, ProduceBatchOut


class ProduceService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def register_batch(self, payload: ProduceBatchCreate) -> ProduceBatchOut:
        batch = ProduceBatch(
            storage_unit_id=payload.storage_unit_id,
            farmer_identifier=payload.farmer_identifier,
            produce_type=payload.produce_type,
            quantity_kg=payload.quantity_kg,
            harvested_at=payload.harvested_at,
            expected_shelf_life_days=payload.expected_shelf_life_days,
            notes=payload.notes,
        )
        self.session.add(batch)
        await self.session.flush()
        return ProduceBatchOut.model_validate(batch)

    async def list_batches_by_storage(self, storage_unit_id: str) -> List[ProduceBatchOut]:
        stmt = select(ProduceBatch).where(ProduceBatch.storage_unit_id == storage_unit_id)
        result = await self.session.execute(stmt)
        return [ProduceBatchOut.model_validate(b) for b in result.scalars().all()]
