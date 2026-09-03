# HIMARKA ESP32 Edge Firmware

Isolated embedded firmware subsystem for the HIMARKA solar-powered smart mini cold storage system.

## Hardware Specification
- **Microcontroller:** ESP32-WROOM-32D (Dual-core 240MHz, 4MB Flash, Wi-Fi 802.11 b/g/n + BLE)
- **Chamber Temperature & Humidity:** High-accuracy digital sensor (DHT22 / SHT31 over I2C)
- **Chamber Gas / Air Quality:** MQ-135 (Ethylene / Ammonia / Volatile organic compounds detection)
- **Solar & Battery Telemetry:** Voltage divider connected to ADC pins (GPIO34, GPIO35)
- **Cooling Control:** Solid-state relay (SSR) controlling 12V/24V DC refrigeration compressor (GPIO26)
- **Door State:** Magnetic reed switch (GPIO27)
- **Vision Capture (Optional Edge):** ESP32-CAM module transmitting periodic Chamber snapshots

## Telemetry Transmission Contract
Telemetry payloads are transmitted as JSON over HTTPS `POST /api/v1/telemetry/ingest` or synced via Firebase RTDB adapter.
See `include/telemetry_contract.h` for the exact C++ telemetry data structure.
