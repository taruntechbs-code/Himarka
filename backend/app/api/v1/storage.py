from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.repositories.storage_repository import StorageRepository
from app.schemas.common import APIResponse
from app.schemas.storage import StorageUnitCreate, StorageUnitOut
from app.services.storage_service import StorageService

router = APIRouter(prefix="/storage", tags=["Storage Units"])


@router.get("", response_model=APIResponse[List[StorageUnitOut]])
async def list_storage_units(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    service = StorageService(StorageRepository(db))
    units = await service.list_storage_units(limit=limit, offset=offset)
    return APIResponse(success=True, data=units, meta={"count": len(units)})


@router.post("", response_model=APIResponse[StorageUnitOut], status_code=status.HTTP_201_CREATED)
async def create_storage_unit(payload: StorageUnitCreate, db: AsyncSession = Depends(get_db)):
    service = StorageService(StorageRepository(db))
    unit = await service.create_storage_unit(payload)
    return APIResponse(success=True, data=unit, message="Storage unit created successfully")


@router.get("/{unit_id}", response_model=APIResponse[StorageUnitOut])
async def get_storage_unit(unit_id: str, db: AsyncSession = Depends(get_db)):
    service = StorageService(StorageRepository(db))
    unit = await service.get_storage_unit(unit_id)
    return APIResponse(success=True, data=unit)
