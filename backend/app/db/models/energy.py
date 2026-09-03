import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Float, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class EnergyRecord(Base):
    __tablename__ = "energy_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    storage_unit_id: Mapped[str] = mapped_column(String(36), ForeignKey("storage_units.id", ondelete="CASCADE"), index=True, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    
    solar_power_w: Mapped[float] = mapped_column(Float, default=0.0)
    solar_voltage_v: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    solar_current_a: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    battery_voltage_v: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    battery_soc_percent: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    cooling_power_w: Mapped[float] = mapped_column(Float, default=0.0)
    auxiliary_power_w: Mapped[float] = mapped_column(Float, default=0.0)
    grid_fallback_w: Mapped[float] = mapped_column(Float, default=0.0)

    # Relationships
    storage_unit: Mapped["StorageUnit"] = relationship("StorageUnit", back_populates="energy_records")
