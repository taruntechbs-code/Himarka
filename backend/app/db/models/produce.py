import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin


class ProduceBatch(Base, TimestampMixin):
    __tablename__ = "produce_batches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    storage_unit_id: Mapped[str] = mapped_column(String(36), ForeignKey("storage_units.id", ondelete="CASCADE"), index=True, nullable=False)
    farmer_identifier: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    produce_type: Mapped[str] = mapped_column(String(80), nullable=False)  # e.g., "Tomato", "King Chilli", "Ginger", "Cabbage"
    quantity_kg: Mapped[float] = mapped_column(Float, nullable=False)
    
    harvested_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    stored_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    expected_shelf_life_days: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="STORED")  # STORED, PARTIALLY_REMOVED, DISCHARGED, SPOILED
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    storage_unit: Mapped["StorageUnit"] = relationship("StorageUnit", back_populates="produce_batches")
    detections: Mapped[List["ProduceDetection"]] = relationship("ProduceDetection", back_populates="batch", cascade="all, delete-orphan")


class ProduceDetection(Base, TimestampMixin):
    __tablename__ = "produce_detections"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    batch_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("produce_batches.id", ondelete="SET NULL"), nullable=True)
    storage_unit_id: Mapped[str] = mapped_column(String(36), ForeignKey("storage_units.id", ondelete="CASCADE"), nullable=False)
    
    detected_produce_type: Mapped[str] = mapped_column(String(80), nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    bounding_box_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    spoilage_risk_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    image_reference_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    batch: Mapped[Optional["ProduceBatch"]] = relationship("ProduceBatch", back_populates="detections")
