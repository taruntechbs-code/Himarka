from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.repositories.device_repository import DeviceRepository
from app.schemas.common import APIResponse
from app.schemas.device import DeviceCreate, DeviceHeartbeat, DeviceOut
from app.services.device_service import DeviceService

router = APIRouter(prefix="/devices", tags=["Devices"])


@router.get("", response_model=APIResponse[List[DeviceOut]])
async def list_devices(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    service = DeviceService(DeviceRepository(db))
    devices = await service.list_devices(limit=limit, offset=offset)
    return APIResponse(success=True, data=devices, meta={"count": len(devices)})


@router.post("", response_model=APIResponse[DeviceOut], status_code=status.HTTP_201_CREATED)
async def register_device(payload: DeviceCreate, db: AsyncSession = Depends(get_db)):
    service = DeviceService(DeviceRepository(db))
    device = await service.register_device(payload)
    return APIResponse(success=True, data=device, message="Device registered successfully")


@router.get("/{device_id}", response_model=APIResponse[DeviceOut])
async def get_device(device_id: str, db: AsyncSession = Depends(get_db)):
    service = DeviceService(DeviceRepository(db))
    device = await service.get_device(device_id)
    return APIResponse(success=True, data=device)


@router.post("/heartbeat", response_model=APIResponse[DeviceOut])
async def device_heartbeat(heartbeat: DeviceHeartbeat, db: AsyncSession = Depends(get_db)):
    service = DeviceService(DeviceRepository(db))
    device = await service.record_heartbeat(heartbeat)
    return APIResponse(success=True, data=device, message="Heartbeat acknowledged")
