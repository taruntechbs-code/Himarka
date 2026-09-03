from datetime import datetime, timezone
from typing import Optional
from app.core.exceptions import DeviceNotFoundException, TelemetryInvalidException
from app.core.logging import logger
from app.db.models.telemetry import TelemetryRecord
from app.db.repositories.device_repository import DeviceRepository
from app.db.repositories.telemetry_repository import TelemetryRepository
from app.integrations.firebase.client import FirebaseClient
from app.integrations.iot.validator import IoTTelemetryValidator
from app.schemas.telemetry import TelemetryIngestPayload, TelemetryRecordOut


class IoTIngestionService:
    def __init__(
        self,
        telemetry_repo: TelemetryRepository,
        device_repo: DeviceRepository,
        firebase_client: Optional[FirebaseClient] = None,
    ):
        self.telemetry_repo = telemetry_repo
        self.device_repo = device_repo
        self.firebase_client = firebase_client or FirebaseClient()

    async def ingest_telemetry(self, payload: TelemetryIngestPayload) -> TelemetryRecordOut:
        # 1. Validate physical constraints
        is_valid, errors = IoTTelemetryValidator.validate_payload(payload)
        if not is_valid:
            raise TelemetryInvalidException(
                message=f"Telemetry validation failed for device {payload.device_id}: {'; '.join(errors)}",
                details={"errors": errors},
            )

        # 2. Verify device registration & reject unknown devices
        device = await self.device_repo.get_by_device_id(payload.device_id)
        if not device:
            logger.warning(f"Telemetry rejected: device '{payload.device_id}' is not registered in system.")
            raise DeviceNotFoundException(payload.device_id)

        storage_unit_id = device.storage_unit_id
        device.last_seen_at = datetime.now(timezone.utc)
        device.status = "ONLINE"

        # 3. Persist record to database
        record = TelemetryRecord(
            device_id=payload.device_id,
            storage_unit_id=storage_unit_id,
            timestamp=payload.timestamp,
            temperature_c=payload.temperature_c,
            humidity_percent=payload.humidity_percent,
            gas_ppm=payload.gas_ppm,
            solar_voltage=payload.solar_voltage,
            battery_voltage=payload.battery_voltage,
            battery_percent=payload.battery_percent,
            cooling_active=payload.cooling_active,
            door_open=payload.door_open,
        )
        saved_record = await self.telemetry_repo.create(record)

        # 4. Optional broadcast to realtime transport (e.g. Firebase)
        await self.firebase_client.sync_telemetry_record(
            device_id=payload.device_id,
            record={
                "timestamp": payload.timestamp.isoformat(),
                "temperature_c": payload.temperature_c,
                "humidity_percent": payload.humidity_percent,
                "gas_ppm": payload.gas_ppm,
                "cooling_active": payload.cooling_active,
            },
        )

        return TelemetryRecordOut.model_validate(saved_record)
