from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class StorageUnitBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    location_village: str = Field(..., min_length=2, max_length=120)
    location_state: str = Field(default="Assam", max_length=120)
    capacity_kg: float = Field(default=1000.0, gt=0.0)
    target_temp_min: float = Field(default=2.0, ge=-10.0, le=25.0)
    target_temp_max: float = Field(default=8.0, ge=-10.0, le=25.0)
    target_humidity_min: float = Field(default=85.0, ge=0.0, le=100.0)
    target_humidity_max: float = Field(default=95.0, ge=0.0, le=100.0)


class StorageUnitCreate(StorageUnitBase):
    pass


class StorageUnitUpdate(BaseModel):
    name: Optional[str] = None
    location_village: Optional[str] = None
    location_state: Optional[str] = None
    capacity_kg: Optional[float] = None
    target_temp_min: Optional[float] = None
    target_temp_max: Optional[float] = None
    target_humidity_min: Optional[float] = None
    target_humidity_max: Optional[float] = None
    is_active: Optional[bool] = None


class StorageUnitOut(StorageUnitBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
