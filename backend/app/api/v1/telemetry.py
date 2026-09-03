from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.db.database import get_db
from app.db.repositories.device_repository import DeviceRepository
from app.db.repositories.telemetry_repository import TelemetryRepository
from app.integrations.iot.ingestion import IoTIngestionService
from app.schemas.common import APIResponse
from app.schemas.telemetry import TelemetryIngestPayload, TelemetryRecordOut
from app.services.telemetry_service import TelemetryService

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])


@router.post("/ingest", response_model=APIResponse[TelemetryRecordOut], status_code=status.HTTP_201_CREATED)
async def ingest_telemetry(payload: TelemetryIngestPayload, db: AsyncSession = Depends(get_db)):
    """IoT Ingestion Endpoint: receives and validates raw sensor telemetry from ESP32."""
    telemetry_repo = TelemetryRepository(db)
    device_repo = DeviceRepository(db)
    ingestion_service = IoTIngestionService(telemetry_repo, device_repo)

    record = await ingestion_service.ingest_telemetry(payload)
    return APIResponse(
        success=True,
        data=record,
        message="Telemetry ingested and validated successfully",
    )


@router.get("/latest", response_model=APIResponse[TelemetryRecordOut])
async def get_latest_telemetry(
    device_id: str = Query(..., description="ESP32 hardware device identifier"),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve the most recent telemetry sample for a specific device."""
    telemetry_repo = TelemetryRepository(db)
    device_repo = DeviceRepository(db)
    service = TelemetryService(telemetry_repo, device_repo)

    record = await service.get_latest_telemetry(device_id)
    if not record:
        raise NotFoundException(f"No telemetry records found for device '{device_id}'")

    return APIResponse(success=True, data=record)


@router.get("/history", response_model=APIResponse[List[TelemetryRecordOut]])
async def get_telemetry_history(
    device_id: Optional[str] = Query(None),
    storage_unit_id: Optional[str] = Query(None),
    start_time: Optional[datetime] = Query(None),
    end_time: Optional[datetime] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
):
    """Query historical telemetry for visualization and analysis."""
    telemetry_repo = TelemetryRepository(db)
    device_repo = DeviceRepository(db)
    service = TelemetryService(telemetry_repo, device_repo)

    records = await service.get_telemetry_history(
        device_id=device_id,
        storage_unit_id=storage_unit_id,
        start_time=start_time,
        end_time=end_time,
        limit=limit,
    )
    return APIResponse(success=True, data=records, meta={"count": len(records), "limit": limit})
