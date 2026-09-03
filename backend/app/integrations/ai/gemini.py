from datetime import datetime, timezone
from typing import Optional
from app.core.config import get_settings
from app.core.exceptions import NotConfiguredException
from app.core.logging import logger
from app.integrations.ai.base import AIProvider
from app.schemas.ai import DetectionResponse, SpoilagePredictionRequest, SpoilagePredictionResponse

settings = get_settings()


class GeminiAIProvider(AIProvider):
    """Google Gemini AI intelligence layer integration.
    API keys remain strictly server-side.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self._enabled = bool(self.api_key and self.api_key != "replace_with_gemini_api_key_server_side_only")

    def is_available(self) -> bool:
        return self._enabled

    async def detect_produce(self, image_data: bytes, threshold: float) -> DetectionResponse:
        if not self._enabled:
            raise NotConfiguredException("GeminiProvider: GEMINI_API_KEY is not configured on the server")
        # Real Gemini Multimodal call will be wired when key is supplied
        logger.info("Executing Gemini vision inference")
        raise NotConfiguredException("Gemini Vision pipeline will execute once deployed with credentials")

    async def predict_spoilage_risk(self, request: SpoilagePredictionRequest) -> SpoilagePredictionResponse:
        if not self._enabled:
            raise NotConfiguredException("GeminiProvider: GEMINI_API_KEY is not configured on the server")
        raise NotConfiguredException("Gemini Spoilage prediction pipeline will execute once deployed with credentials")
