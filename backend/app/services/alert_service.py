from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.db.models.alert import Alert
from app.schemas.alert import AlertCreate, AlertOut, AlertResolution


class AlertService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_alert(self, payload: AlertCreate) -> AlertOut:
        alert = Alert(
            storage_unit_id=payload.storage_unit_id,
            device_id=payload.device_id,
            severity=payload.severity,
            alert_type=payload.alert_type,
            title=payload.title,
            message=payload.message,
        )
        self.session.add(alert)
        await self.session.flush()
        return AlertOut.model_validate(alert)

    async def list_active_alerts(self, storage_unit_id: Optional[str] = None) -> List[AlertOut]:
        stmt = select(Alert).where(Alert.is_resolved.is_(False)).order_by(desc(Alert.created_at))
        if storage_unit_id:
            stmt = stmt.where(Alert.storage_unit_id == storage_unit_id)
        result = await self.session.execute(stmt)
        return [AlertOut.model_validate(a) for a in result.scalars().all()]

    async def resolve_alert(self, alert_id: str, resolution: AlertResolution) -> AlertOut:
        stmt = select(Alert).where(Alert.id == alert_id)
        result = await self.session.execute(stmt)
        alert = result.scalars().first()
        if not alert:
            raise NotFoundException(f"Alert '{alert_id}' not found")
        alert.is_resolved = True
        alert.resolved_at = datetime.now(timezone.utc)
        alert.resolved_by = resolution.resolved_by
        return AlertOut.model_validate(alert)
