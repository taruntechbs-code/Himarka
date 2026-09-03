# IoT Integration Architecture

## Ingestion Pipeline
```
ESP32 (Hardware RTC / Sensors)
  ↓ HTTPS POST /telemetry/ingest
IoT Ingestion Service
  ↓ IoTTelemetryValidator (Clock skew, range bounds)
Device Repository (Verify registered device ID & storage unit)
  ↓ Persist to Database (telemetry_records)
Firebase Realtime Adapter (Optional broadcast to web dashboard)
```

## Security & Sanity
- **Clock Skew:** Enforces timestamp within 300 seconds of server time.
- **Physical Boundaries:** Validates temperature (-20°C to 60°C), humidity (0% to 100%), gas ppm (>= 0).
- **Unregistered Device Isolation:** Telemetry from unregistered devices is rejected or logged for auditing without contaminating storage records.
