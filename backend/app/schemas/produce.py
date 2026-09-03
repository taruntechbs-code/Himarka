from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProduceBatchCreate(BaseModel):
    storage_unit_id: str
    farmer_identifier: Optional[str] = None
    produce_type: str = Field(..., min_length=2, max_length=80)
    quantity_kg: float = Field(..., gt=0.0)
    harvested_at: Optional[datetime] = None
    expected_shelf_life_days: Optional[float] = Field(None, gt=0.0)
    notes: Optional[str] = None


class ProduceBatchOut(BaseModel):
    id: str
    storage_unit_id: str
    farmer_identifier: Optional[str] = None
    produce_type: str
    quantity_kg: float
    harvested_at: Optional[datetime] = None
    stored_at: datetime
    expected_shelf_life_days: Optional[float] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ProduceDetectionOut(BaseModel):
    id: str
    batch_id: Optional[str] = None
    storage_unit_id: str
    detected_produce_type: str
    confidence_score: float
    spoilage_risk_score: Optional[float] = None
    bounding_box_json: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
