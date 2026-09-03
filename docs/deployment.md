# Deployment Guide

This guide details steps to set up and deploy all components of the SITAGARAA system.

## 1. Frontend Web Dashboard

The web dashboard is fully static (Vanilla HTML, CSS, JavaScript) and requires no build pipeline.

### Option A: Local Testing
Serve the `frontend/` directory using any static web server:

Using Python:
```bash
cd frontend
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

Using Node.js `serve` / `http-server`:
```bash
npx serve frontend
```

### Option B: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Specify 'frontend' as your public directory
firebase deploy --only hosting
```

---

## 2. ESP32 Firmware Flashing

1. **Install Arduino IDE**:
   Download and install the latest Arduino IDE from [arduino.cc](https://www.arduino.cc/).
2. **Add ESP32 Board Support**:
   - Go to `File` → `Preferences`.
   - In *Additional Boards Manager URLs*, add:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to `Tools` → `Board` → `Boards Manager`, search for **esp32** by Espressif and install.
3. **Install Required Libraries**:
   Go to `Tools` → `Manage Libraries` and install:
   - **Firebase ESP Client** (by Mobizt)
   - **DHT sensor library** (by Adafruit)
4. **Open and Configure Firmware**:
   - Open `firmware/esp32/esp32_sitagaraa.ino`.
   - Update `WIFI_SSID` and `WIFI_PASSWORD` with your local Wi-Fi credentials.
5. **Select Board and Port**:
   - Board: **AI Thinker ESP32-CAM** (or ESP32 Wrover Module).
   - Partition Scheme: **Huge APP (3MB No OTA/1MB SPIFFS)**.
   - Connect USB-to-UART module (GPIO 0 tied to GND during flash mode).
   - Click **Upload**.
6. **Obtain Board IP**:
   - Disconnect GPIO 0 from GND, press RESET.
   - Open Serial Monitor at **115200 baud**.
   - Note the assigned IP address printed to the console.

---

## 3. Edge AI Detector Setup

1. **Navigate to AI Directory**:
   ```bash
   cd ai
   ```
2. **Create and Activate Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure IP Address**:
   - Open `ai_vegetable_detector.py`.
   - Update `ESP32_STREAM_URL` to match your ESP32's IP:
     ```python
     ESP32_STREAM_URL = "http://<YOUR_ESP32_IP>:81/stream"
     ```
5. **Start Detector**:
   ```bash
   python ai_vegetable_detector.py
   ```
