import uuid
from typing import Optional
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="VIEWER")  # ADMIN, OPERATOR, FARMER, VIEWER
    phone_number: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    preferred_language: Mapped[str] = mapped_column(String(10), default="en")  # en, as, bn, hi, etc.
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
