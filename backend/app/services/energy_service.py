from typing import Optional
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.energy import EnergyRecord
from app.schemas.energy import EnergyRecordIn, EnergyRecordOut


class EnergyService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def record_energy(self, payload: EnergyRecordIn) -> EnergyRecordOut:
        record = EnergyRecord(
            storage_unit_id=payload.storage_unit_id,
            timestamp=payload.timestamp,
            solar_power_w=payload.solar_power_w,
            solar_voltage_v=payload.solar_voltage_v,
            solar_current_a=payload.solar_current_a,
            battery_voltage_v=payload.battery_voltage_v,
            battery_soc_percent=payload.battery_soc_percent,
            cooling_power_w=payload.cooling_power_w,
            auxiliary_power_w=payload.auxiliary_power_w,
            grid_fallback_w=payload.grid_fallback_w,
        )
        self.session.add(record)
        await self.session.flush()
        return EnergyRecordOut.model_validate(record)

    async def get_latest_energy_status(self, storage_unit_id: str) -> Optional[EnergyRecordOut]:
        stmt = (
            select(EnergyRecord)
            .where(EnergyRecord.storage_unit_id == storage_unit_id)
            .order_by(desc(EnergyRecord.timestamp))
            .limit(1)
        )
        result = await self.session.execute(stmt)
        record = result.scalars().first()
        if not record:
            return None
        return EnergyRecordOut.model_validate(record)
