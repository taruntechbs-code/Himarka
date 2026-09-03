from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.alert import AlertCreate, AlertOut, AlertResolution
from app.schemas.common import APIResponse
from app.services.alert_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Alerts & Anomalies"])


@router.get("", response_model=APIResponse[List[AlertOut]])
async def list_active_alerts(
    storage_unit_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    service = AlertService(db)
    alerts = await service.list_active_alerts(storage_unit_id)
    return APIResponse(success=True, data=alerts, meta={"count": len(alerts)})


@router.post("", response_model=APIResponse[AlertOut], status_code=status.HTTP_201_CREATED)
async def create_alert(payload: AlertCreate, db: AsyncSession = Depends(get_db)):
    service = AlertService(db)
    alert = await service.create_alert(payload)
    return APIResponse(success=True, data=alert, message="Alert generated")


@router.post("/{alert_id}/resolve", response_model=APIResponse[AlertOut])
async def resolve_alert(alert_id: str, resolution: AlertResolution, db: AsyncSession = Depends(get_db)):
    service = AlertService(db)
    alert = await service.resolve_alert(alert_id, resolution)
    return APIResponse(success=True, data=alert, message="Alert marked as resolved")
