from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.telemetry import router as telemetry_router
from app.api.v1.devices import router as devices_router
from app.api.v1.storage import router as storage_router
from app.api.v1.produce import router as produce_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.energy import router as energy_router
from app.api.v1.ai import router as ai_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(telemetry_router)
api_v1_router.include_router(devices_router)
api_v1_router.include_router(storage_router)
api_v1_router.include_router(produce_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(energy_router)
api_v1_router.include_router(ai_router)
