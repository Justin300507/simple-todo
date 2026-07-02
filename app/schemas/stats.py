from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class StatsSummary(BaseModel):
    total_members: int
    active_today: int
    revenue_this_month: float
    classes_today: int

    model_config = ConfigDict(from_attributes=True)
