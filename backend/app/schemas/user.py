from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(min_length=1, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=255)


class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class AccessToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
