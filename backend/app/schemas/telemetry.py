from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TelemetryIngestPayload(BaseModel):
    """Raw telemetry payload sent by ESP32 edge device."""
    device_id: str = Field(..., min_length=3, max_length=64, description="Unique hardware device identifier")
    timestamp: datetime = Field(..., description="Timestamp recorded by device RTC or NTP")
    temperature_c: float = Field(..., ge=-20.0, le=60.0, description="Ambient storage temperature in Celsius")
    humidity_percent: float = Field(..., ge=0.0, le=100.0, description="Relative humidity percentage")
    gas_ppm: Optional[float] = Field(None, ge=0.0, le=10000.0, description="Air quality / gas reading in ppm")
    solar_voltage: Optional[float] = Field(None, ge=0.0, le=100.0, description="Solar panel voltage")
    battery_voltage: Optional[float] = Field(None, ge=0.0, le=60.0, description="Storage battery voltage")
    battery_percent: Optional[float] = Field(None, ge=0.0, le=100.0, description="Estimated battery state-of-charge")
    cooling_active: bool = Field(False, description="Cooling system relay / compressor state")
    door_open: bool = Field(False, description="Storage chamber magnetic door sensor state")


class TelemetryRecordOut(BaseModel):
    id: str
    device_id: str
    storage_unit_id: Optional[str] = None
    timestamp: datetime
    received_at: datetime
    temperature_c: float
    humidity_percent: float
    gas_ppm: Optional[float] = None
    solar_voltage: Optional[float] = None
    battery_voltage: Optional[float] = None
    battery_percent: Optional[float] = None
    cooling_active: bool
    door_open: bool

    model_config = {"from_attributes": True}


class TelemetrySummary(BaseModel):
    device_id: str
    latest_record: Optional[TelemetryRecordOut] = None
    average_temp_24h: Optional[float] = None
    average_humidity_24h: Optional[float] = None
    cooling_duty_cycle_percent: Optional[float] = None
