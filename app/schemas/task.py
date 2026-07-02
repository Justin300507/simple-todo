from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class TaskCreate(BaseModel):
    model_config = {"from_attributes": True}
    title: str = Field(min_length=1)
    description: Optional[str] = None
    status: str = Field(min_length=1)
    priority: str = Field(min_length=1)
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    model_config = {"from_attributes": True}
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    status: Optional[str] = Field(None, min_length=1)
    priority: Optional[str] = Field(None, min_length=1)
    due_date: Optional[datetime] = None

class TaskStatusUpdate(BaseModel):
    model_config = {"from_attributes": True}
    status: str = Field(min_length=1)

class TaskResponse(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    user_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    user_id: Optional[int] = None
    model_config = {'from_attributes': True}
