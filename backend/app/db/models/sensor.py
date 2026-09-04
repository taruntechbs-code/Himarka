import uuid
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Boolean, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.db.models.device import Device


class Sensor(Base, TimestampMixin):
    __tablename__ = "sensors"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id: Mapped[str] = mapped_column(String(36), ForeignKey("devices.id", ondelete="CASCADE"), nullable=False)
    sensor_type: Mapped[str] = mapped_column(String(64), nullable=False)  # TEMPERATURE, HUMIDITY, AIR_QUALITY, VOLTAGE
    pin_or_bus: Mapped[str] = mapped_column(String(32), default="I2C")
    model: Mapped[str] = mapped_column(String(64), default="DHT22")
    calibration_offset: Mapped[float] = mapped_column(Float, default=0.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    device: Mapped["Device"] = relationship("Device", back_populates="sensors")
