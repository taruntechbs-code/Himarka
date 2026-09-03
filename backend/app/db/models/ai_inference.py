import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, Float, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class AIInference(Base):
    __tablename__ = "ai_inferences"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    storage_unit_id: Mapped[str] = mapped_column(String(36), ForeignKey("storage_units.id", ondelete="CASCADE"), index=True, nullable=False)
    
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(32), nullable=False)
    task_type: Mapped[str] = mapped_column(String(50), nullable=False)  # DETECTION, SPOILAGE_PREDICTION, ANOMALY_DETECTION, ENERGY_FORECAST
    
    input_ref: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    output_payload_json: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    execution_time_ms: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
