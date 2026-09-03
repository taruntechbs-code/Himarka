from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    meta: Optional[dict] = Field(default_factory=dict)


class PaginationMeta(BaseModel):
    total: int
    limit: int
    offset: int
    has_more: bool


class StatusMessage(BaseModel):
    status: str
    message: str
    timestamp: str
