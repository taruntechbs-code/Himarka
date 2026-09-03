# HIMARKA Model Registry

The Model Registry provides a reproducible catalog of all machine learning models across the HIMARKA platform.

## Model Manifest Specification
Every model in the registry must contain a versioned directory (e.g., `v1/`) with a `metadata.json` containing:

```json
{
  "model_name": "produce-detector",
  "version": "v1.0.0",
  "task_type": "DETECTION",
  "framework": "Ultralytics YOLOv8",
  "input_schema": {
    "format": "image/jpeg",
    "resolution": [640, 640],
    "channels": 3
  },
  "output_schema": {
    "type": "array",
    "items": {
      "class_name": "string",
      "confidence": "float",
      "bbox": [ "x_min", "y_min", "x_max", "y_max" ]
    }
  },
  "model_artifact_path": "checkpoints/produce_yolov8n.pt",
  "training_metadata": {
    "dataset_version": "ne-veg-v1",
    "epochs": 100,
    "batch_size": 16
  },
  "evaluation_metrics": {
    "status": "PENDING_TRAINING"
  }
}
```
