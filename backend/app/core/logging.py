import logging
import sys
from contextvars import ContextVar

# Context variable for request correlation ID
correlation_id_ctx: ContextVar[str] = ContextVar("correlation_id", default="system")


class StructuredFormatter(logging.Formatter):
    """Formats log records as structured key-value pairs or JSON-ready records."""

    def format(self, record: logging.LogRecord) -> str:
        correlation_id = correlation_id_ctx.get()
        base_msg = super().format(record)
        return f"[{self.formatTime(record)}] [{record.levelname}] [{correlation_id}] {record.name}: {base_msg}"


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    level = getattr(logging, log_level.upper(), logging.INFO)
    logger = logging.getLogger("himarka")
    logger.setLevel(level)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(level)
        formatter = StructuredFormatter(
            fmt="%(asctime)s %(levelname)s %(name)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


logger = setup_logging()
