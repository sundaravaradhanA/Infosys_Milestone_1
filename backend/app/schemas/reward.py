from pydantic import BaseModel
from datetime import datetime

class RewardBase(BaseModel):
    points: int
    description: str

class RewardCreate(RewardBase):
    user_id: int

class RewardResponse(RewardBase):
    id: int
    user_id: int
    earned_date: datetime
    expires_date: datetime
    
    class Config:
        from_attributes = True
