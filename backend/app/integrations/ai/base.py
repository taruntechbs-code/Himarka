from abc import ABC, abstractmethod
from app.schemas.ai import DetectionResponse, SpoilagePredictionRequest, SpoilagePredictionResponse


class AIProvider(ABC):
    """Abstract Base Class for HIMARKA AI/ML inference providers."""

    @abstractmethod
    async def detect_produce(self, image_data: bytes, threshold: float) -> DetectionResponse:
        """Run computer vision detection on produce image."""
        pass

    @abstractmethod
    async def predict_spoilage_risk(self, request: SpoilagePredictionRequest) -> SpoilagePredictionResponse:
        """Predict spoilage risk based on environmental history and produce type."""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if provider credentials/models are configured and ready."""
        pass
