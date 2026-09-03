from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.core.security import UserRole


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2)
    role: UserRole = UserRole.VIEWER
    phone_number: Optional[str] = None
    preferred_language: str = "en"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    expires_in_minutes: int


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    phone_number: Optional[str] = None
    preferred_language: str
    is_active: bool

    model_config = {"from_attributes": True}
