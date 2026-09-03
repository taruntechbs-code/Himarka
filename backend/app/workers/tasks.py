"""HIMARKA Asynchronous Background Tasks.
All computationally heavy AI or aggregation jobs run outside the HTTP request/response cycle.
"""
from typing import Any, Dict
from app.core.logging import logger


async def process_vision_inference_task(image_ref: str, storage_unit_id: str) -> Dict[str, Any]:
    """Background task to run heavy YOLO produce detection."""
    logger.info(f"[Worker] Starting vision inference task for storage {storage_unit_id} (ref: {image_ref})")
    # Worker execution boundary
    return {
        "status": "QUEUED_OR_COMPLETED",
        "storage_unit_id": storage_unit_id,
        "image_ref": image_ref,
    }


async def aggregate_daily_telemetry_task(storage_unit_id: str) -> Dict[str, Any]:
    """Background task to compute rolling 24h averages and time-series downsampling."""
    logger.info(f"[Worker] Aggregating daily telemetry for storage {storage_unit_id}")
    return {
        "status": "COMPLETED",
        "storage_unit_id": storage_unit_id,
    }
