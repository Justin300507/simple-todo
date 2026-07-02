from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class UserBase(BaseModel):
    model_config = {"from_attributes": True}
    id: Optional[int] = None
    email: str = Field(min_length=1)
    display_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=1)


class UserUpdate(UserBase):
    email: Optional[str] = Field(None, min_length=1)
    password: Optional[str] = Field(None, min_length=1)


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
