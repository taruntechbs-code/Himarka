# SITAGARAA — AI Vegetable Detection Module

This directory contains the computer vision inference engine for the SITAGARAA smart cold storage system.

## Overview

The AI detector is designed to run on edge computing hardware (such as a laptop or Raspberry Pi) rather than on the ESP32 microcontroller, which lacks the compute capacity to run deep convolutional neural networks.

```
+------------------+         MJPEG Video Stream        +----------------------------+
| ESP32-CAM Board  | ================================> | ai_vegetable_detector.py   |
| (Inside Storage) |   http://<esp32-ip>:81/stream     | (Laptop / Raspberry Pi)    |
+------------------+                                   +--------------+-------------+
                                                                      |
                                                                      | Realtime Updates
                                                                      v
                                                       +----------------------------+
                                                       | Firebase RTDB              |
                                                       | (/vegetableInfo)           |
                                                       +----------------------------+
```

## Prerequisites

- Python 3.8+
- Network connectivity to the same local WiFi network as the ESP32-CAM module

## Installation

```bash
pip install -r requirements.txt
```

## Configuration

Open `ai_vegetable_detector.py` and verify/adjust the user configuration:

```python
ESP32_STREAM_URL = "http://192.168.1.50:81/stream"   # Match your ESP32-CAM's printed IP
FIREBASE_HOST = "https://vegetable-box-system-default-rtdb.asia-southeast1.firebasedatabase.app"
MODEL_PATH = "yolov8n.pt"                           # Stock YOLOv8n or fine-tuned weights
CONFIDENCE_THRESHOLD = 0.45                         # Minimum confidence threshold
DETECT_INTERVAL_SEC = 5                             # Inference frequency (seconds)
```

## Running the Detector

```bash
python ai_vegetable_detector.py
```

Press `q` on the OpenCV preview window to exit.

## Supported Vegetable Classes

The detector maps predictions against regional produce categories:
- `banana`, `apple`, `orange`, `broccoli`, `carrot`
- `tomato`, `potato`, `onion`, `cabbage`, `cucumber`
- `capsicum`, `pepper`, `chilli`, `brinjal`, `eggplant`
- `corn`, `spinach`, `cauliflower`, `beans`, `garlic`, `lettuce`

> **Note on Model Tuning**: The default `yolov8n.pt` weights contain general COCO categories. For production deployment in Northeast India, fine-tune YOLOv8 using a custom dataset of regional vegetables and point `MODEL_PATH` to the exported `.pt` weights file.
