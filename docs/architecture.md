# System Architecture

SITAGARAA is a multi-tier IoT and edge AI platform engineered for localized solar cold chain operations in Northeast India.

## High-Level Topology

```
+-----------------------------------------------------------------------------------+
|                                PHYSICAL COLD CHAMBER                              |
|                                                                                   |
|   +-----------------------+     +-----------------------+                         |
|   | DHT22 / MQ-135 / ADC  |     | OV2640 Camera Sensor  |                         |
|   +-----------+-----------+     +-----------+-----------+                         |
+---------------|-----------------------------|-------------------------------------+
                | GPIO / Analog               | Parallel CSI
                v                             v
    +-------------------------------------------------------------+
    |                    ESP32-CAM Microcontroller                |
    |                                                             |
    |   - Reads environmental telemetry every 15 seconds          |
    |   - Evaluates cooling threshold & triggers GPIO16 relay     |
    |   - Hosts HTTP MJPEG streaming server on Port 81 (/stream)  |
    +---------------+-----------------------------+---------------+
                    | HTTPS RTDB Write            | MJPEG Stream (LAN)
                    |                             v
                    |               +-----------------------------+
                    |               | Edge Machine (Laptop / RPi) |
                    |               | ai_vegetable_detector.py    |
                    |               | Runs YOLOv8 Object Detector |
                    |               +--------------+--------------+
                    v                              |
    +----------------------------------------------+--------------+
    |           Google Firebase Realtime Database                 |
    |                                                             |
    |   - /liveData      (temperature, humidity, co2, gas, solar) |
    |   - /vegetableInfo (detected produce, confidence, days)     |
    +------------------------------+------------------------------+
                                   | Realtime WebSocket / SSE
                                   v
    +-------------------------------------------------------------+
    |                 Farmer & Operator Dashboard                 |
    |                                                             |
    |   - Vanilla JS + Responsive CSS Glassmorphic UI             |
    |   - 9-language Northeast Regional Translation System        |
    |   - Live Canvas Particle Animations & Chart.js Visualizers  |
    +-------------------------------------------------------------+
```

## Data Flow Pipeline

1. **Telemetry Pipeline**:
   - ESP32 samples temperature, relative humidity, MQ-135 gas voltage, and solar voltage.
   - Values are packaged and transmitted directly to `/liveData` via the Firebase REST / RTDB client library.
   - Dashboard web client receives immediate delta updates via Firebase `onValue` subscription.

2. **Computer Vision Pipeline**:
   - ESP32-CAM captures raw frames from inside the chamber and serves a continuous MJPEG stream over HTTP port 81.
   - An edge device running `ai_vegetable_detector.py` consumes the video stream via OpenCV.
   - At 5-second intervals, the YOLOv8 model runs inference to identify stored vegetables and bounding box coordinates.
   - The verified classification and timestamp are pushed to `/vegetableInfo` in Firebase.

3. **Presentation & Localization Pipeline**:
   - The frontend reads state changes from `/liveData` and `/vegetableInfo`.
   - The regionalization layer in `translations.js` instantaneously updates all UI metrics, alert states, and produce classifications across 9 languages without page reloads.
