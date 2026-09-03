# HIMARKA Database Schema

Implemented using SQLAlchemy 2.0 with declarative mappings and Alembic migrations.

## Entity Relationship Summary

```
StorageUnit (1) ────< (N) Device (1) ────< (N) Sensor
    │                      │
    │                      └────< (N) TelemetryRecord
    ├────< (N) ProduceBatch ────< (N) ProduceDetection
    ├────< (N) Alert
    └────< (N) EnergyRecord
```

## Tables
1. **`storage_units`**: Physical cold storage facility, target temperature & humidity ranges, village & state locations.
2. **`devices`**: ESP32 microcontrollers, hardware type, firmware version, status, and IP address.
3. **`sensors`**: Attached sensors (DHT22, MQ-135, ADC), bus type, calibration offsets.
4. **`telemetry_records`**: Time-series sensor logs (temperature, humidity, gas ppm, battery/solar voltage, cooling relay status).
5. **`produce_batches`**: Harvest records, farmer IDs, crop variety, stored dates, expected shelf-life.
6. **`produce_detections`**: AI vision inferences mapped to stored batches.
7. **`alerts`**: Environmental excursions and hardware offline warnings.
8. **`energy_records`**: Solar generation power (W), battery SoC (%), cooling energy load.
9. **`ai_inferences`**: Historical audit log of AI model inference runs and execution times.
10. **`users`**: System operators, farmers, and admins with salted hashed credentials and roles.
