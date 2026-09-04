import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.db.models.sensor import Sensor
    from app.db.models.storage_unit import StorageUnit
    from app.db.models.telemetry import TelemetryRecord


class Device(Base, TimestampMixin):
    __tablename__ = "devices"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    storage_unit_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("storage_units.id", ondelete="SET NULL"), nullable=True)
    hardware_type: Mapped[str] = mapped_column(String(64), default="ESP32-WROOM-32")
    firmware_version: Mapped[str] = mapped_column(String(32), default="0.1.0")
    status: Mapped[str] = mapped_column(String(32), default="ONLINE")  # ONLINE, OFFLINE, MAINTENANCE, DEGRADED
    last_seen_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    storage_unit: Mapped[Optional["StorageUnit"]] = relationship("StorageUnit", back_populates="devices")
    sensors: Mapped[List["Sensor"]] = relationship("Sensor", back_populates="device", cascade="all, delete-orphan")
    telemetry_records: Mapped[List["TelemetryRecord"]] = relationship("TelemetryRecord", back_populates="device")
