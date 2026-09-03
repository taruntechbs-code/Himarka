# HIMARKA AI / ML Intelligence Subsystem

The AI subsystem operates independently from the frontend presentation and backend HTTP transport layers. It is responsible for computer vision produce detection, environmental spoilage risk analysis, and energy forecasting.

## Subsystem Architecture

```
                                    ┌───────────────────────┐
                                    │    Edge Camera / IoT  │
                                    │  (ESP32-CAM / Sensor) │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │   Vision Preprocess   │
                                    │  (Resizing, Normaliz) │
                                    └───────────┬───────────┘
                                                │
                                                ▼
┌───────────────────────┐           ┌───────────────────────┐
│ Environmental History │           │      YOLO Vision      │
│  (Temp, Hum, Gas)     │           │   Produce Detection   │
└───────────┬───────────┘           └───────────┬───────────┘
            │                                   │
            └───────────────┬───────────────────┘
                            ▼
                ┌───────────────────────┐
                │ Spoilage Risk Model   │
                │ Shelf-Life Estimator  │
                └───────────┬───────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ Backend / DB / Alerts │
                └───────────────────────┘
```

## Subsystem Structure

- `vision/`: Produce detection, image preprocessing, and YOLO inference.
- `prediction/`: Shelf-life estimation, spoilage risk modeling, and solar energy prediction.
- `anomaly/`: Environmental anomaly detection (excursion spikes, gas surges).
- `models/registry/`: Versioned model manifests with input/output schemas and evaluation metrics.
- `models/checkpoints/`: Model weight binaries (`.pt`, `.onnx`) — excluded from Git.
- `datasets/`: Dataset curation guides and training split manifests.
- `pipelines/`: Training, evaluation, and serialization pipelines.

## Model Governance & Ethical Principles
- **No Fabricated Performance:** No accuracy, precision, or recall figures are claimed until empirical model evaluation benchmarks are performed on ground-truth North Eastern agricultural produce datasets.
- **Artifact Decoupling:** Model binaries (`*.pt`, `*.onnx`) are never committed to version control.
