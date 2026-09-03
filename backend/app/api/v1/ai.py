from fastapi import APIRouter, status
from app.core.exceptions import NotConfiguredException
from app.integrations.ai.gemini import GeminiAIProvider
from app.integrations.ai.local import LocalModelProvider
from app.schemas.ai import (
    DetectionRequest,
    DetectionResponse,
    SpoilagePredictionRequest,
    SpoilagePredictionResponse,
)
from app.schemas.common import APIResponse

router = APIRouter(prefix="/ai", tags=["AI & Machine Learning"])


@router.post("/detection", response_model=APIResponse[DetectionResponse], status_code=status.HTTP_200_OK)
async def detect_produce(payload: DetectionRequest):
    """Computer vision produce detection endpoint.
    Returns 501 NOT_CONFIGURED when weights or vision providers are not registered.
    """
    local_provider = LocalModelProvider()
    if not local_provider.is_available():
        raise NotConfiguredException(
            component="YOLO Produce Detector",
            message="No active trained model weights found in registry. See docs/ai/model_registry.md.",
        )
    return APIResponse(success=False, message="Model pipeline execution requires checkpoint")


@router.post("/spoilage-risk", response_model=APIResponse[SpoilagePredictionResponse], status_code=status.HTTP_200_OK)
async def predict_spoilage_risk(payload: SpoilagePredictionRequest):
    """Spoilage risk estimation endpoint based on environmental telemetry history.
    Returns 501 NOT_CONFIGURED when models are uncalibrated or absent.
    """
    gemini_provider = GeminiAIProvider()
    if not gemini_provider.is_available():
        raise NotConfiguredException(
            component="Spoilage Risk Predictor",
            message="Spoilage prediction service requires server GEMINI_API_KEY or calibrated ML weights.",
        )
    return APIResponse(success=False, message="Prediction pipeline not configured")
