from datetime import datetime, timezone
from typing import Any, Dict
from fastapi import APIRouter, status
from app.core.config import get_settings
from app.db.database import check_db_connection
from app.integrations.firebase.client import FirebaseClient
from app.integrations.ai.gemini import GeminiAIProvider
from app.integrations.ai.local import LocalModelProvider

router = APIRouter(prefix="/health", tags=["Observability & Health"])
settings = get_settings()


@router.get("", status_code=status.HTTP_200_OK)
async def get_system_health() -> Dict[str, Any]:
    """Comprehensive system health check inspecting all subsystem dependencies."""
    db_ok = await check_db_connection()
    firebase_client = FirebaseClient()
    gemini_provider = GeminiAIProvider()
    local_ml_provider = LocalModelProvider()

    overall_status = "HEALTHY" if db_ok else "DEGRADED"

    return {
        "status": overall_status,
        "app_name": settings.APP_NAME,
        "app_version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "components": {
            "api_server": {"status": "HEALTHY", "message": "FastAPI HTTP server running"},
            "database": {
                "status": "HEALTHY" if db_ok else "UNAVAILABLE",
                "message": "Connected" if db_ok else "Connection failed or pending migration",
            },
            "firebase": {
                "status": "HEALTHY" if firebase_client.is_connected else "NOT_CONFIGURED",
                "message": "Connected" if firebase_client.is_connected else "Running in offline/stub mode",
            },
            "ai_services": {
                "gemini": {
                    "status": "HEALTHY" if gemini_provider.is_available() else "NOT_CONFIGURED",
                    "message": "API key configured" if gemini_provider.is_available() else "Awaiting GEMINI_API_KEY",
                },
                "local_ml": {
                    "status": "HEALTHY" if local_ml_provider.is_available() else "NOT_CONFIGURED",
                    "message": "Checkpoints loaded" if local_ml_provider.is_available() else "No local weights registered",
                },
            },
        },
    }


@router.get("/live", status_code=status.HTTP_200_OK)
async def liveness_probe() -> Dict[str, str]:
    """Kubernetes / Docker liveness probe: returns 200 if container process is alive."""
    return {"status": "LIVE"}


@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_probe() -> Dict[str, Any]:
    """Kubernetes / Docker readiness probe: verifies whether service can accept traffic."""
    db_ok = await check_db_connection()
    return {
        "status": "READY" if db_ok else "NOT_READY",
        "database_ready": db_ok,
    }
