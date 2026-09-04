from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class AITaskType(str, Enum):
    DETECTION = "DETECTION"
    SPOILAGE_RISK = "SPOILAGE_RISK"
    SHELF_LIFE = "SHELF_LIFE"
    ANOMALY_DETECTION = "ANOMALY_DETECTION"
    ENERGY_FORECAST = "ENERGY_FORECAST"


class BoundingBox(BaseModel):
    x_min: float
    y_min: float
    x_max: float
    y_max: float
    confidence: float
    class_name: str


class DetectionRequest(BaseModel):
    storage_unit_id: str
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    confidence_threshold: float = Field(default=0.5, ge=0.1, le=1.0)


class DetectionResponse(BaseModel):
    storage_unit_id: str
    model_name: str
    model_version: str
    detections: List[BoundingBox]
    execution_time_ms: float
    timestamp: datetime


class SpoilagePredictionRequest(BaseModel):
    storage_unit_id: str
    produce_type: str
    storage_duration_hours: float
    mean_temperature_c: float
    mean_humidity_percent: float
    recent_gas_ppm: Optional[float] = None


class SpoilagePredictionResponse(BaseModel):
    storage_unit_id: str
    produce_type: str
    risk_score: float = Field(..., ge=0.0, le=1.0, description="0.0 (fresh) to 1.0 (imminent spoilage)")
    risk_category: str = Field(..., description="LOW, MODERATE, HIGH, CRITICAL")
    recommended_action: str
    confidence: float
    model_version: str
