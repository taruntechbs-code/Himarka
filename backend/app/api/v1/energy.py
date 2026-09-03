from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.db.database import get_db
from app.schemas.common import APIResponse
from app.schemas.energy import EnergyRecordIn, EnergyRecordOut
from app.services.energy_service import EnergyService

router = APIRouter(prefix="/energy", tags=["Solar & Energy"])


@router.post("", response_model=APIResponse[EnergyRecordOut], status_code=status.HTTP_201_CREATED)
async def record_energy_telemetry(payload: EnergyRecordIn, db: AsyncSession = Depends(get_db)):
    service = EnergyService(db)
    record = await service.record_energy(payload)
    return APIResponse(success=True, data=record, message="Energy record captured")


@router.get("/latest", response_model=APIResponse[EnergyRecordOut])
async def get_latest_energy_status(
    storage_unit_id: str = Query(..., description="Storage unit identifier"),
    db: AsyncSession = Depends(get_db),
):
    service = EnergyService(db)
    record = await service.get_latest_energy_status(storage_unit_id)
    if not record:
        raise NotFoundException(f"No energy records found for storage unit '{storage_unit_id}'")
    return APIResponse(success=True, data=record)
