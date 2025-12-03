from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies.auth import get_current_user_id
from app.core.database import get_session
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserRead

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def get_me(user_id: int = Depends(get_current_user_id), session=Depends(get_session)):
    user = UserRepository(session).get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, session=Depends(get_session)):
    user = UserRepository(session).get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
