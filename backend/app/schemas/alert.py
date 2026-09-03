from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AlertCreate(BaseModel):
    storage_unit_id: str
    device_id: Optional[str] = None
    severity: str = Field(default="WARNING", description="INFO, WARNING, CRITICAL, EMERGENCY")
    alert_type: str = Field(..., description="TEMP_HIGH, HUMIDITY_LOW, GAS_ALERT, POWER_FAIL, DEVICE_OFFLINE")
    title: str = Field(..., max_length=150)
    message: str


class AlertResolution(BaseModel):
    resolved_by: str = Field(..., min_length=2)


class AlertOut(BaseModel):
    id: str
    storage_unit_id: str
    device_id: Optional[str] = None
    severity: str
    alert_type: str
    title: str
    message: str
    is_resolved: bool
    created_at: datetime
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[str] = None

    model_config = {"from_attributes": True}
