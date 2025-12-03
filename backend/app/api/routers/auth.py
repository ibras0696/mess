from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.api.dependencies.auth import get_current_user_id
from app.core.database import get_session
from app.schemas.user import AccessToken, TokenPair, UserCreate
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=255)


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/register", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, session=Depends(get_session)):
    return AuthService(session).register(payload)


@router.post("/login", response_model=TokenPair)
def login(payload: LoginRequest, session=Depends(get_session)):
    return AuthService(session).login(payload.email, payload.password)


@router.post("/refresh", response_model=AccessToken)
def refresh(payload: RefreshRequest, session=Depends(get_session)):
    from app.core.security import decode_token

    data = decode_token(payload.refresh_token)
    if not data or data.get("type") != "refresh" or "sub" not in data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user_id = int(data["sub"])
    return AuthService(session).refresh(user_id)


@router.get("/me/token-test", response_model=AccessToken)
def token_test(user_id: int = Depends(get_current_user_id)):
    """Debug-only endpoint to ensure auth dependency works."""
    from app.core.config import settings
    from app.core.security import create_token

    access = create_token(str(user_id), settings.access_token_ttl, token_type="access")
    return AccessToken(access_token=access)
