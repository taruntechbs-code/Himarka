# AI Model Registry & Serialization Guide

## Registration Workflow
1. Train model locally or in cloud GPU environment using reproducible scripts under `ai/pipelines/`.
2. Benchmark against test holdout set and compile evaluation metrics.
3. Export weights to ONNX or TorchScript in `ai/models/checkpoints/` (stored in remote object storage).
4. Commit a versioned `metadata.json` under `ai/models/registry/<model_name>/<version>/`.

## Model Registry Rules
- Never commit `.pt`, `.pth`, `.onnx`, or `.bin` files to git.
- Each model version is immutable once deployed.
- Input and output schemas in `metadata.json` must be strictly tested against backend `app/schemas/ai.py`.
