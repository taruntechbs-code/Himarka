# HIMARKA (SITAGARAA)
### Solar Powered Smart Mini Cold Storage System for Fresh Vegetables
**Northeast India · Cold-Chain Preservation & IoT Telemetry**

---

## Overview

**Himarka (SITAGARAA)** is an open-hardware, IoT, and Edge-AI cold storage monitoring system tailored for smallholder farmers and agricultural cooperatives in Northeast India. It provides continuous chamber microclimate tracking, solar energy telemetry, real-time computer vision produce detection, and multi-lingual user interfaces across 9 regional languages.

```
 [ESP32 + Sensors]  ──every 15s──>  Firebase (/liveData)
        │                                   │
 [ESP32-CAM Video]                          ▼
        │                         [Frontend Dashboard]
        ▼                                   ▲
 [AI Vision Engine] ──on detect──>  Firebase (/vegetableInfo)
(Laptop/Raspberry Pi)
```

---

## Repository Structure

```
Himarka/
├── .gitignore                      # Git exclusion rules
├── LICENSE                         # MIT License
├── README.md                       # Project overview & quickstart
│
├── frontend/                       # Web Dashboard (Pure HTML/CSS/JS)
│   ├── index.html                  # Main application & localized command center
│   ├── css/
│   │   └── style.css               # Responsive design system & glassmorphism theme
│   ├── js/
│   │   ├── script.js               # Dashboard UI logic, charts, and thresholds
│   │   ├── background.js           # Interactive canvas particle animations
│   │   ├── translations.js         # Multi-language dictionary (9 NE languages)
│   │   └── firebase-config.js      # Realtime Database listeners
│   └── assets/                     # UI visual assets
│
├── ai/                             # Computer Vision & Edge AI
│   ├── ai_vegetable_detector.py    # YOLOv8 produce detector & Firebase bridge
│   ├── requirements.txt            # Python dependencies
│   └── README.md                   # AI module execution guide
│
├── firmware/                       # Microcontroller Code
│   └── esp32/
│       └── esp32_sitagaraa.ino     # ESP32-CAM firmware (Sensors, Relay, Camera)
│
├── hardware/                       # Physical Construction & Circuitry
│   ├── README.md                   # Hardware pinout & wiring specifications
│   ├── diagrams/                   # Circuit diagrams & schematics
│   └── prototype/
│       ├── photos/                 # Physical prototype photography
│       └── README.md               # Chamber structure & insulation guide
│
└── docs/                           # In-Depth Technical Documentation
    ├── architecture.md             # End-to-end system topology & data flow
    ├── hardware.md                 # Pin assignments, power budget & sensors
    ├── ai.md                       # Vision model specs & fine-tuning instructions
    ├── firebase.md                 # Realtime Database schema & event models
    └── deployment.md               # Complete setup & deployment manual
```

---

## System Architecture

The system operates across three coordinated tiers:

1. **Hardware / Microcontroller (`firmware/esp32/`)**:
   - ESP32-CAM acquires readings from the **DHT22** (temperature/humidity), **MQ-135** (gas/CO₂), and a solar battery voltage divider.
   - Pushes sensor telemetry to `/liveData` every 15 seconds.
   - Actuates the cooling relay on **GPIO 16** (Peltier/DC compressor) based on internal setpoints.
   - Serves an MJPEG video stream on port 81 (`http://<esp32-ip>:81/stream`).

2. **Computer Vision Inference (`ai/`)**:
   - Runs on an edge device (laptop or Raspberry Pi) to conserve ESP32 compute.
   - Consumes the ESP32-CAM video stream via OpenCV.
   - Runs YOLO inference every 5 seconds to recognize produce and assess storage duration.
   - Updates `/vegetableInfo` in Firebase.

3. **Frontend Dashboard (`frontend/`)**:
   - Zero-build web dashboard running on modern Vanilla JavaScript.
   - Subscribes in real-time to Firebase `/liveData` and `/vegetableInfo`.
   - Offers real-time bilingual and regional language localization for Northeast India.

---

## Quick Start Guide

### 1. Launch the Frontend Dashboard

The frontend has no build step and can be served directly:

```bash
# Option A: Local Python server
cd frontend
python -m http.server 8000
# Visit http://localhost:8000

# Option B: Deploy to Firebase Hosting
firebase deploy --only hosting
```

### 2. Flash the ESP32 Firmware

1. Open `firmware/esp32/esp32_sitagaraa.ino` in Arduino IDE.
2. Install **Firebase ESP Client** (Mobizt) and **DHT sensor library** (Adafruit) via the Library Manager.
3. Configure your local Wi-Fi credentials (`WIFI_SSID` and `WIFI_PASSWORD`).
4. Select **AI Thinker ESP32-CAM** and flash the board.
5. Open Serial Monitor (115200 baud) and note the assigned IP address.

### 3. Start the AI Vision Detector

```bash
cd ai
pip install -r requirements.txt
```

Set `ESP32_STREAM_URL` in `ai_vegetable_detector.py` to your board's IP address, then start detection:

```bash
python ai_vegetable_detector.py
```

---

## Regional Languages & Localization

The user interface supports 9 regional languages of Northeast India:
- **English** (Default)
- **অসমীয়া** (Assamese — Assam)
- **বাংলা** (Bengali — Tripura & Barak Valley)
- **हिंदी** (Hindi — Inter-State communication)
- **नेपाली** (Nepali — Sikkim & Hill Districts)
- **মৈতৈলোন্** (Manipuri / Meitei — Manipur)
- **बर'** (Bodo — Bodoland, Assam)
- **Mizo ṭawng** (Mizo — Mizoram)
- **Ka Ktien Khasi** (Khasi — Meghalaya)

*Note: English, Assamese, Bengali, Hindi, and Nepali translations have been validated for domain terminology. Native speaker feedback is welcomed for refining Bodo, Manipuri, Mizo, and Khasi localizations.*

---

## Documentation Index

- [Architecture & Data Flow](docs/architecture.md)
- [Hardware & Pinout Specification](docs/hardware.md)
- [AI & Produce Detection Pipeline](docs/ai.md)
- [Firebase Realtime Database Schema](docs/firebase.md)
- [Comprehensive Deployment Guide](docs/deployment.md)

---

## License

This project is licensed under the [MIT License](LICENSE).
