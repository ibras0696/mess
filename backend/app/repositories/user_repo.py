from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.session.get(User, user_id)

    def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        return self.session.scalar(stmt)

    def create(self, email: str, username: str, password_hash: str) -> User:
        user = User(email=email, username=username, password_hash=password_hash)
        self.session.add(user)
        return user

    def list_by_ids(self, ids: list[int]) -> list[User]:
        if not ids:
            return []
        stmt = select(User).where(User.id.in_(ids))
        return list(self.session.scalars(stmt).all())
