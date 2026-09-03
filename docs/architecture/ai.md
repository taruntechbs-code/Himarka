# AI / Machine Learning Architecture

## Pillars
1. **Computer Vision:** YOLOv8/YOLOv11 for vegetable detection, crate counting, and visible surface defect localization.
2. **Predictive Spoilage Modeling:** Degree-day kinetics and multivariate machine learning combining historical chamber temperature, relative humidity, and gas/ethylene sensor trends.
3. **Solar Energy Forecasting:** Irradiance models predicting daylight charging capacity and advising cooling compressor scheduling.
4. **Multimodal Intelligence:** Server-side Gemini AI provider for agricultural diagnostics and farmer advisory.

## AI Data Flows
1. **Computer Vision (YOLO):**
   ```
   ESP32-CAM / Upload
       ↓
   Image Stream
       ↓
   Python / OpenCV Preprocessing
       ↓
   YOLO Inference
       ↓
   AI Result (Bounding Boxes, Classes, Confidence)
       ↓
   Backend / Database
       ↓
   Web Frontend
   ```

2. **Multimodal Intelligence (Gemini):**
   ```
   Web Frontend
       ↓ HTTPS
   Backend API
       ↓
   AI Provider Abstraction (backend/app/integrations/ai/)
       ↓ Server-side SDK
   Gemini API
   ```

> [!IMPORTANT]
> **Key Isolation Rule:** Gemini API keys must **NEVER** be exposed to the browser/frontend. All LLM interactions occur strictly server-side behind the `AIProvider` interface.

## Model Registry
All models must have versioned metadata in `ai/models/registry/`. Model weights (`.pt`, `.onnx`) are stored in artifact buckets, not in Git.
No synthetic metrics are fabricated; benchmarks require verified test datasets.
