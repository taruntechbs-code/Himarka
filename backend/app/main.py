import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.core.exceptions import (
    HimarkaException,
    generic_exception_handler,
    himarka_exception_handler,
    validation_exception_handler,
)
from app.core.logging import correlation_id_ctx, logger
from app.db.base import Base
from app.db.database import engine

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist in dev SQLite if running without migrations
    logger.info(f"Starting {settings.APP_NAME} Backend v{settings.APP_VERSION} [{settings.APP_ENV}]")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    logger.info("Shutting down HIMARKA Backend")
    await engine.dispose()


app = FastAPI(
    title="HIMARKA API",
    description=(
        "Core Backend API for HIMARKA Solar-Powered Smart Mini Cold Storage System "
        "for Fresh Vegetables in North Eastern India."
    ),
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """Injects a unique request_id into the context and response headers."""

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        token = correlation_id_ctx.set(request_id)
        start_time = time.perf_counter()

        try:
            response: Response = await call_next(request)
            process_time = (time.perf_counter() - start_time) * 1000
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
            logger.info(
                f"{request.method} {request.url.path} - status={response.status_code} - {process_time:.2f}ms"
            )
            return response
        finally:
            correlation_id_ctx.reset(token)


# Middlewares
app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(HimarkaException, himarka_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include Versioned API Routes
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_PREFIX,
    }
