from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.user import AccessToken, TokenPair, UserCreate, UserRead


class AuthService:
    def __init__(self, session: Session):
        self.repo = UserRepository(session)
        self.session = session

    def register(self, data: UserCreate) -> TokenPair:
        existing = self.repo.get_by_email(data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )
        user = self.repo.create(
            email=data.email,
            username=data.username,
            password_hash=hash_password(data.password),
        )
        self.session.commit()
        self.session.refresh(user)
        return self._issue_tokens(user)

    def login(self, email: str, password: str) -> TokenPair:
        user = self.repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return self._issue_tokens(user)

    def refresh(self, user_id: int) -> AccessToken:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        access = create_token(str(user.id), settings.access_token_ttl, token_type="access")
        return AccessToken(access_token=access)

    def _issue_tokens(self, user: User) -> TokenPair:
        access = create_token(str(user.id), settings.access_token_ttl, token_type="access")
        refresh = create_token(str(user.id), settings.refresh_token_ttl, token_type="refresh")
        return TokenPair(
            access_token=access,
            refresh_token=refresh,
            user=UserRead.model_validate(user),
        )
