from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import HimarkaException, ErrorCode
from app.core.security import create_access_token, get_password_hash, verify_password, UserRole
from app.db.database import get_db
from app.db.models.user import User
from app.schemas.auth import TokenResponse, UserLogin, UserOut, UserRegister
from app.schemas.common import APIResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=APIResponse[UserOut], status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == payload.email)
    result = await db.execute(stmt)
    if result.scalars().first():
        raise HimarkaException(
            code=ErrorCode.VALIDATION_ERROR,
            message="User with this email already exists",
            status_code=409,
        )

    new_user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        role=payload.role.value,
        phone_number=payload.phone_number,
        preferred_language=payload.preferred_language,
    )
    db.add(new_user)
    await db.flush()

    return APIResponse(
        success=True,
        data=UserOut.model_validate(new_user),
        message="User registered successfully",
    )


@router.post("/login", response_model=APIResponse[TokenResponse])
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == payload.email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HimarkaException(
            code=ErrorCode.UNAUTHORIZED,
            message="Invalid email or password",
            status_code=401,
        )

    token = create_access_token(subject=user.id, role=UserRole(user.role))
    return APIResponse(
        success=True,
        data=TokenResponse(
            access_token=token,
            role=user.role,
            expires_in_minutes=1440,
        ),
        message="Login successful",
    )
