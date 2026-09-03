from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class EnergyRecordIn(BaseModel):
    storage_unit_id: str
    timestamp: datetime
    solar_power_w: float = Field(default=0.0, ge=0.0)
    solar_voltage_v: Optional[float] = Field(None, ge=0.0)
    solar_current_a: Optional[float] = Field(None, ge=0.0)
    battery_voltage_v: Optional[float] = Field(None, ge=0.0)
    battery_soc_percent: Optional[float] = Field(None, ge=0.0, le=100.0)
    cooling_power_w: float = Field(default=0.0, ge=0.0)
    auxiliary_power_w: float = Field(default=0.0, ge=0.0)
    grid_fallback_w: float = Field(default=0.0, ge=0.0)


class EnergyRecordOut(EnergyRecordIn):
    id: str

    model_config = {"from_attributes": True}


class EnergySummaryOut(BaseModel):
    storage_unit_id: str
    solar_energy_generated_kwh_today: float
    total_energy_consumed_kwh_today: float
    solar_fraction_percent: float
    battery_soc_latest_percent: Optional[float] = None
    estimated_autonomy_hours: Optional[float] = None
