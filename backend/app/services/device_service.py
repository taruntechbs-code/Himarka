from datetime import datetime, timezone
from typing import List, Optional
from app.core.exceptions import DeviceNotFoundException, HimarkaException, ErrorCode
from app.db.models.device import Device
from app.db.repositories.device_repository import DeviceRepository
from app.schemas.device import DeviceCreate, DeviceHeartbeat, DeviceOut, DeviceUpdate


class DeviceService:
    def __init__(self, device_repo: DeviceRepository):
        self.device_repo = device_repo

    async def register_device(self, payload: DeviceCreate) -> DeviceOut:
        existing = await self.device_repo.get_by_device_id(payload.device_id)
        if existing:
            raise HimarkaException(
                code=ErrorCode.VALIDATION_ERROR,
                message=f"Device with ID '{payload.device_id}' is already registered",
                status_code=409,
            )

        device = Device(
            device_id=payload.device_id,
            storage_unit_id=payload.storage_unit_id,
            hardware_type=payload.hardware_type,
            firmware_version=payload.firmware_version,
            status="REGISTERED",
        )
        created = await self.device_repo.create(device)
        return DeviceOut.model_validate(created)

    async def get_device(self, device_id: str) -> DeviceOut:
        device = await self.device_repo.get_by_device_id(device_id)
        if not device:
            raise DeviceNotFoundException(device_id)
        return DeviceOut.model_validate(device)

    async def list_devices(self, limit: int = 100, offset: int = 0) -> List[DeviceOut]:
        devices = await self.device_repo.get_all(limit=limit, offset=offset)
        return [DeviceOut.model_validate(d) for d in devices]

    async def record_heartbeat(self, heartbeat: DeviceHeartbeat) -> DeviceOut:
        device = await self.device_repo.get_by_device_id(heartbeat.device_id)
        if not device:
            raise DeviceNotFoundException(heartbeat.device_id)
        device.last_seen_at = datetime.now(timezone.utc)
        device.status = "ONLINE"
        if heartbeat.firmware_version:
            device.firmware_version = heartbeat.firmware_version
        if heartbeat.ip_address:
            device.ip_address = heartbeat.ip_address
        return DeviceOut.model_validate(device)
