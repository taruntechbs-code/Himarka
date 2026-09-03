# AI Produce Detection & Vision Architecture

## Overview

The computer vision subsystem identifies fresh produce inside the storage chamber, measures storage duration, and feeds classification data to the dashboard to adjust preservation guidelines.

## Computer Vision Pipeline

```
 [ESP32-CAM]
      │
      │ HTTP /stream (MJPEG 800x600)
      ▼
 [OpenCV VideoCapture]
      │
      │ Frame extraction every 5 seconds
      ▼
 [YOLOv8 Inference Engine]
      │
      ├─ Filter by CONFIDENCE_THRESHOLD (>= 0.45)
      ├─ Filter by VEGETABLE_CLASSES whitelist
      └─ Rank highest confidence object
      │
      ▼
 [Firebase Patch Operation]
      │
      └─ Updates /vegetableInfo payload
```

## Payload Specification (`/vegetableInfo`)

When a vegetable is detected, the Python detector issues an HTTP `PATCH` to `/vegetableInfo`:

```json
{
  "currentVegetable": "Tomatoes",
  "confidence": 0.98,
  "detectedAt": 1756891200000,
  "storageStartTime": 1756804800000,
  "daysStored": 1
}
```

If no candidate vegetable is detected in current frame, the background interval maintains `daysStored` tracking from `storageStartTime` without overwriting the last known identification.

## Fine-Tuning Guidelines

The stock `yolov8n.pt` model recognizes COCO categories. For production deployments in regional agricultural hubs:

1. **Collect Dataset**: Capture 200–500 images per target vegetable under the cold chamber's internal illumination.
2. **Annotation**: Label bounding boxes in YOLO format (using tools like Roboflow or LabelImg).
3. **Train**:
   ```bash
   yolo detect train data=regional_veg.yaml model=yolov8n.pt epochs=50 imgsz=640
   ```
4. **Deploy**: Copy `best.pt` into the `ai/` folder and update `MODEL_PATH = "best.pt"` in `ai/ai_vegetable_detector.py`.
