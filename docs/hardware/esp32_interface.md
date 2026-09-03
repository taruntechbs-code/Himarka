# ESP32 Hardware Interface & Wiring Contract

## Pinout Mapping
| Peripheral | Pin | Type | Protocol / Notes |
| :--- | :--- | :--- | :--- |
| **DHT22 / SHT31** | GPIO21 (SDA), GPIO22 (SCL) | Input | I2C Digital Sensor |
| **MQ-135 Gas Sensor** | GPIO36 (VP) | Input | Analog ADC (0 - 3.3V) |
| **Solar Voltage Sense** | GPIO34 | Input | 10:1 Resistive Divider to ADC |
| **Battery Voltage Sense** | GPIO35 | Input | 5:1 Resistive Divider to ADC |
| **Cooling Relay** | GPIO26 | Output | Active-HIGH to Solid State Relay (SSR) |
| **Door Reed Switch** | GPIO27 | Input | Internal Pull-Up to GND |

## Telemetry Payload Schema
ESP32 sends JSON payload to `POST /api/v1/telemetry/ingest`:
```json
{
  "device_id": "HMRK-AS-001-ESP",
  "timestamp": "2026-09-03T15:30:00Z",
  "temperature_c": 4.2,
  "humidity_percent": 91.0,
  "gas_ppm": 125.4,
  "solar_voltage": 28.4,
  "battery_voltage": 25.6,
  "battery_percent": 82.0,
  "cooling_active": true,
  "door_open": false
}
```
