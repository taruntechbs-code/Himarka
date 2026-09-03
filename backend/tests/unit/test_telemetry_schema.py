from datetime import datetime, timezone
import pytest
from pydantic import ValidationError
from app.integrations.iot.validator import IoTTelemetryValidator
from app.schemas.telemetry import TelemetryIngestPayload


def test_valid_telemetry_payload():
    payload = TelemetryIngestPayload(
        device_id="ESP32-TEST-001",
        timestamp=datetime.now(timezone.utc),
        temperature_c=4.5,
        humidity_percent=90.0,
        gas_ppm=120.5,
        cooling_active=True,
    )
    is_valid, errors = IoTTelemetryValidator.validate_payload(payload)
    assert is_valid is True
    assert len(errors) == 0


def test_invalid_temperature_bounds():
    with pytest.raises(ValidationError):
        TelemetryIngestPayload(
            device_id="ESP32-TEST-001",
            timestamp=datetime.now(timezone.utc),
            temperature_c=150.0,  # Physically absurd for cold storage
            humidity_percent=80.0,
        )


def test_invalid_humidity_bounds():
    with pytest.raises(ValidationError):
        TelemetryIngestPayload(
            device_id="ESP32-TEST-001",
            timestamp=datetime.now(timezone.utc),
            temperature_c=4.0,
            humidity_percent=120.0,  # Impossible percentage
        )
