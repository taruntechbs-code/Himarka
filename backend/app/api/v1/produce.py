from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.common import APIResponse
from app.schemas.produce import ProduceBatchCreate, ProduceBatchOut
from app.services.produce_service import ProduceService

router = APIRouter(prefix="/produce", tags=["Produce Management"])


@router.post("/batches", response_model=APIResponse[ProduceBatchOut], status_code=status.HTTP_201_CREATED)
async def register_produce_batch(payload: ProduceBatchCreate, db: AsyncSession = Depends(get_db)):
    service = ProduceService(db)
    batch = await service.register_batch(payload)
    return APIResponse(success=True, data=batch, message="Produce batch registered successfully")


@router.get("/batches/storage/{storage_unit_id}", response_model=APIResponse[List[ProduceBatchOut]])
async def list_batches(storage_unit_id: str, db: AsyncSession = Depends(get_db)):
    service = ProduceService(db)
    batches = await service.list_batches_by_storage(storage_unit_id)
    return APIResponse(success=True, data=batches, meta={"count": len(batches)})
