from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class DeviceBase(BaseModel):
    device_id: str = Field(..., min_length=3, max_length=64)
    storage_unit_id: Optional[str] = None
    hardware_type: str = "ESP32-WROOM-32"
    firmware_version: str = "0.1.0"


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(BaseModel):
    storage_unit_id: Optional[str] = None
    hardware_type: Optional[str] = None
    firmware_version: Optional[str] = None
    is_active: Optional[bool] = None


class DeviceHeartbeat(BaseModel):
    device_id: str
    firmware_version: Optional[str] = None
    ip_address: Optional[str] = None


class DeviceOut(DeviceBase):
    id: str
    status: str
    last_seen_at: Optional[datetime] = None
    ip_address: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
