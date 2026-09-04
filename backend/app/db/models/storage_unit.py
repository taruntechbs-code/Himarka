import uuid
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, Float, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.db.models.alert import Alert
    from app.db.models.device import Device
    from app.db.models.energy import EnergyRecord
    from app.db.models.produce import ProduceBatch
    from app.db.models.telemetry import TelemetryRecord


class StorageUnit(Base, TimestampMixin):
    __tablename__ = "storage_units"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    location_village: Mapped[str] = mapped_column(String(120), nullable=False)
    location_state: Mapped[str] = mapped_column(String(120), default="Assam")
    capacity_kg: Mapped[float] = mapped_column(Float, default=1000.0)
    target_temp_min: Mapped[float] = mapped_column(Float, default=2.0)
    target_temp_max: Mapped[float] = mapped_column(Float, default=8.0)
    target_humidity_min: Mapped[float] = mapped_column(Float, default=85.0)
    target_humidity_max: Mapped[float] = mapped_column(Float, default=95.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    devices: Mapped[List["Device"]] = relationship("Device", back_populates="storage_unit", cascade="all, delete-orphan")
    telemetry_records: Mapped[List["TelemetryRecord"]] = relationship("TelemetryRecord", back_populates="storage_unit")
    produce_batches: Mapped[List["ProduceBatch"]] = relationship("ProduceBatch", back_populates="storage_unit")
    alerts: Mapped[List["Alert"]] = relationship("Alert", back_populates="storage_unit")
    energy_records: Mapped[List["EnergyRecord"]] = relationship("EnergyRecord", back_populates="storage_unit")
