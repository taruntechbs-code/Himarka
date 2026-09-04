import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    storage_unit_id: Mapped[str] = mapped_column(String(36), ForeignKey("storage_units.id", ondelete="CASCADE"), index=True, nullable=False)
    device_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    severity: Mapped[str] = mapped_column(String(20), default="WARNING")  # INFO, WARNING, CRITICAL, EMERGENCY
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False)  # TEMP_HIGH, HUMIDITY_LOW, GAS_ALERT, POWER_FAIL, DEVICE_OFFLINE
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_by: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)

    # Relationships
    storage_unit: Mapped["StorageUnit"] = relationship("StorageUnit", back_populates="alerts")
