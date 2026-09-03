# Hardware Specification & Wiring

## Component Breakdown

| Subsystem | Part | Specification | Interface |
|---|---|---|---|
| Main Compute & Vision | ESP32-CAM (AI-Thinker) | Dual-core 32-bit LX6, 520 KB SRAM, 4 MB PSRAM, Wi-Fi 802.11 b/g/n, BLE 4.2 | 3.3V Logic / 5V Input |
| Camera Module | OmniVision OV2640 | 2 Megapixel, UXGA (1600x1200) max resolution | DVP Parallel Interface |
| Temp & Humidity Sensor | DHT22 / AM2302 | Precision capacitive humidity & NTC thermistor | Single-wire digital bus (GPIO 4) |
| Gas / Air Quality Sensor | MQ-135 | Metal Oxide Semiconductor sensing element | Analog 0–3.3V Output (GPIO 34) |
| Solar Voltage Monitor | Resistive Divider | 100kΩ / 10kΩ precision resistors | Analog 0–3.3V Input (GPIO 35) |
| Cooling Controller | 10A Optocoupled Relay | 5V Coil, 250VAC / 30VDC rated contacts | Digital Control (GPIO 16) |

## Schematic & Interfacing Details

### 1. DHT22 Sensor
- **VCC**: Connect to 3.3V or 5V rail
- **DATA**: Connect to ESP32 **GPIO 4** (with 10kΩ pull-up resistor between DATA and VCC)
- **GND**: Connect to common Ground

### 2. MQ-135 Gas Sensor
- **VCC**: Connect to 5V rail (internal heater coil requires 5V)
- **AOUT**: Connect to ESP32 **GPIO 34** (ADC1 channel 6)
- **GND**: Connect to common Ground

### 3. Solar Voltage Measurement
- Connect battery (+) terminal to high side of voltage divider.
- Step-down ratio designed to map peak solar charge voltage (up to 18V–24V) to under 3.3V max ADC reference voltage.
- Voltage divider output wired directly to **GPIO 35** (ADC1 channel 7).

### 4. Cooling Relay
- **VCC**: Connect to 5V rail
- **IN**: Connect to ESP32 **GPIO 16**
- **GND**: Connect to common Ground
- **COM / NO**: Wired in series with cooling actuator power supply.

## Power Supply Constraints
- ESP32-CAM draws transient current spikes up to 310mA during Wi-Fi transmission and camera capture. A dedicated 5V 2A regulator or buck converter with an electrolytic buffer capacitor (470uF–1000uF) is essential on the 5V line to prevent brownout resets.
