import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class TelemetryRecord(Base):
    __tablename__ = "telemetry_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id: Mapped[str] = mapped_column(String(64), ForeignKey("devices.device_id"), index=True, nullable=False)
    storage_unit_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("storage_units.id", ondelete="SET NULL"), index=True, nullable=True)
    
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    
    # Environmental metrics
    temperature_c: Mapped[float] = mapped_column(Float, nullable=False)
    humidity_percent: Mapped[float] = mapped_column(Float, nullable=False)
    gas_ppm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Power & Cooling status
    solar_voltage: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    battery_voltage: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    battery_percent: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    cooling_active: Mapped[bool] = mapped_column(Boolean, default=False)
    door_open: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Composite index for efficient time-series queries per device
    __table_args__ = (
        Index("ix_telemetry_device_time", "device_id", "timestamp"),
    )

    # Relationships
    device: Mapped["Device"] = relationship("Device", back_populates="telemetry_records")
    storage_unit: Mapped[Optional["StorageUnit"]] = relationship("StorageUnit", back_populates="telemetry_records")
