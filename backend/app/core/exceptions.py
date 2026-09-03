from enum import Enum
from typing import Any, Dict, Optional
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.logging import correlation_id_ctx, logger


class ErrorCode(str, Enum):
    VALIDATION_ERROR = "VALIDATION_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    DEVICE_NOT_FOUND = "DEVICE_NOT_FOUND"
    DEVICE_OFFLINE = "DEVICE_OFFLINE"
    STORAGE_NOT_FOUND = "STORAGE_NOT_FOUND"
    TELEMETRY_INVALID = "TELEMETRY_INVALID"
    AI_UNAVAILABLE = "AI_UNAVAILABLE"
    DATABASE_ERROR = "DATABASE_ERROR"
    NOT_CONFIGURED = "NOT_CONFIGURED"
    INTERNAL_ERROR = "INTERNAL_ERROR"


class HimarkaException(Exception):
    """Base exception for HIMARKA platform errors."""

    def __init__(
        self,
        code: ErrorCode,
        message: str,
        status_code: int = 400,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundException(HimarkaException):
    def __init__(self, message: str = "Resource not found", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            code=ErrorCode.NOT_FOUND,
            message=message,
            status_code=404,
            details=details,
        )


class DeviceNotFoundException(HimarkaException):
    def __init__(self, device_id: str):
        super().__init__(
            code=ErrorCode.DEVICE_NOT_FOUND,
            message=f"Device '{device_id}' was not found",
            status_code=404,
            details={"device_id": device_id},
        )


class TelemetryInvalidException(HimarkaException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            code=ErrorCode.TELEMETRY_INVALID,
            message=message,
            status_code=422,
            details=details,
        )


class NotConfiguredException(HimarkaException):
    def __init__(self, component: str, message: Optional[str] = None):
        msg = message or f"The requested feature/service '{component}' is planned but not configured in this environment"
        super().__init__(
            code=ErrorCode.NOT_CONFIGURED,
            message=msg,
            status_code=501,
            details={"component": component, "status": "PLANNED"},
        )


def format_error_response(
    code: str,
    message: str,
    request_id: str,
    details: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    return {
        "error": {
            "code": code,
            "message": message,
            "request_id": request_id,
            "details": details or {},
        }
    }


async def himarka_exception_handler(request: Request, exc: HimarkaException) -> JSONResponse:
    request_id = correlation_id_ctx.get()
    logger.warning(f"Handled exception: {exc.code} - {exc.message} (status {exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content=format_error_response(
            code=exc.code.value,
            message=exc.message,
            request_id=request_id,
            details=exc.details,
        ),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = correlation_id_ctx.get()
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content=format_error_response(
            code=ErrorCode.VALIDATION_ERROR.value,
            message="Input data validation failed",
            request_id=request_id,
            details={"validation_errors": exc.errors()},
        ),
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = correlation_id_ctx.get()
    logger.exception(f"Unhandled internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=format_error_response(
            code=ErrorCode.INTERNAL_ERROR.value,
            message="An internal server error occurred",
            request_id=request_id,
        ),
    )
