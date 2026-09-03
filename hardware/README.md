# SITAGARAA — Hardware Architecture & Specifications

This directory documents the hardware configuration, pin mapping, sensor integration, and power specifications for the SITAGARAA solar-powered smart cold storage prototype.

## Pinout & Interfacing Guide

| Component | Hardware Pin | ESP32 GPIO | Mode | Description |
|---|---|---|---|---|
| **DHT22 / DHT11** | DATA | GPIO 4 | Digital In (Pull-up) | Temperature & Relative Humidity Sensing |
| **MQ-135** | AOUT | GPIO 34 | Analog In (ADC1_CH6) | Spoilage Detection, TVOC & CO₂ Level |
| **Solar Voltage Sensor** | VOUT | GPIO 35 | Analog In (ADC1_CH7) | Voltage divider monitoring 12V/24V battery |
| **Cooling Relay** | IN | GPIO 16 | Digital Out | Controls thermoelectric Peltier / DC compressor |
| **ESP32-CAM OV2640** | Integrated | Multiple (AI-Thinker) | Parallel CSI | MJPEG Video Streaming server on Port 81 |

## Sensor Specifications

### 1. Temperature & Humidity (DHT22 / AM2302)
- Operating Range: -40°C to +80°C, 0–100% RH
- Accuracy: ±0.5°C, ±2–5% RH
- Optimal Storage Range: 0°C to 12°C depending on commodity; 85% to 95% RH for leaf and fruit preservation.

### 2. Air Quality & Spoilage Sensor (MQ-135)
- Target Gases: Ammonia (NH₃), Nitric Oxides (NOx), Alcohol, Benzene, Carbon Dioxide (CO₂), and volatile organic compounds released during agricultural decomposition.
- Calibration: Requires 24h burn-in time for baseline resistance calculation.

### 3. Solar Power Subsystem
- Solar Panel: 12V / 24V Photovoltaic module
- Battery Bank: 12V deep-cycle / LiFePO4 storage
- Monitoring: Resistive voltage divider stepping down battery terminal voltage to safe 0–3.3V ADC levels for GPIO 35.

### 4. Thermal Control / Actuator
- Actuator: 1-channel / 2-channel 5V/12V optocoupled relay module connected to GPIO 16.
- Active Cooling: Thermoelectric Peltier assembly (TEC1-12706 / TEC1-12710) with heatsink and exhaust fan or miniature 12V DC refrigeration compressor.

## Firmware References

The complete microcontroller firmware is located in:
[`firmware/esp32/esp32_sitagaraa.ino`](../firmware/esp32/esp32_sitagaraa.ino)
