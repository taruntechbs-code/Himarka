from datetime import datetime, timezone
from typing import List, Tuple
from app.core.config import get_settings
from app.schemas.telemetry import TelemetryIngestPayload

settings = get_settings()


class IoTTelemetryValidator:
    """Validates physical and operational sanity of incoming edge sensor readings."""

    @staticmethod
    def validate_payload(payload: TelemetryIngestPayload) -> Tuple[bool, List[str]]:
        errors: List[str] = []

        # 1. Clock skew validation (protect against dead RTCs or replay attacks)
        now = datetime.now(timezone.utc)
        payload_time = payload.timestamp
        if payload_time.tzinfo is None:
            payload_time = payload_time.replace(tzinfo=timezone.utc)

        skew_seconds = abs((now - payload_time).total_seconds())
        if skew_seconds > settings.IOT_MAX_CLOCK_SKEW_SECONDS:
            errors.append(
                f"Clock skew exceeded: timestamp {payload.timestamp.isoformat()} differs from server by {skew_seconds:.0f}s"
            )

        # 2. Temperature physical sanity limits (-20°C to +60°C)
        if payload.temperature_c < -20.0 or payload.temperature_c > 60.0:
            errors.append(f"Temperature {payload.temperature_c}°C is outside valid physical range [-20, 60]")

        # 3. Humidity physical sanity limits (0% to 100%)
        if payload.humidity_percent < 0.0 or payload.humidity_percent > 100.0:
            errors.append(f"Humidity {payload.humidity_percent}% is outside valid physical range [0, 100]")

        # 4. Air quality / gas sensor sanity
        if payload.gas_ppm is not None and payload.gas_ppm < 0:
            errors.append("Gas ppm cannot be negative")

        # 5. Solar and battery voltage sanity
        if payload.solar_voltage is not None and payload.solar_voltage < 0:
            errors.append("Solar voltage cannot be negative")
        if payload.battery_voltage is not None and payload.battery_voltage < 0:
            errors.append("Battery voltage cannot be negative")

        return len(errors) == 0, errors
