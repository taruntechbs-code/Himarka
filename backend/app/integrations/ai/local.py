import os
from app.core.config import get_settings
from app.core.exceptions import NotConfiguredException
from app.integrations.ai.base import AIProvider
from app.schemas.ai import DetectionResponse, SpoilagePredictionRequest, SpoilagePredictionResponse

settings = get_settings()


class LocalModelProvider(AIProvider):
    """Local PyTorch / YOLO / ONNX model inference engine."""

    def __init__(self):
        self.checkpoints_dir = settings.AI_CHECKPOINTS_DIR
        self._models_loaded = False

    def is_available(self) -> bool:
        # Check if model checkpoints actually exist on disk (NO fake models)
        return os.path.isdir(self.checkpoints_dir) and any(
            f.endswith((".pt", ".onnx")) for f in os.listdir(self.checkpoints_dir)
        ) if os.path.exists(self.checkpoints_dir) else False

    async def detect_produce(self, image_data: bytes, threshold: float) -> DetectionResponse:
        if not self.is_available():
            raise NotConfiguredException(
                "LocalModelProvider: No trained YOLO produce detector weights found in registry"
            )
        raise NotConfiguredException("Local YOLO detection will execute when checkpoint weights are present")

    async def predict_spoilage_risk(self, request: SpoilagePredictionRequest) -> SpoilagePredictionResponse:
        if not self.is_available():
            raise NotConfiguredException(
                "LocalModelProvider: No trained spoilage prediction model found in registry"
            )
        raise NotConfiguredException("Local Spoilage model will execute when trained model is present")
