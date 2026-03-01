from pydantic import BaseModel
from datetime import datetime

class BillBase(BaseModel):
    bill_name: str
    amount: float
    due_date: datetime
    category: str

class BillCreate(BillBase):
    user_id: int

class BillResponse(BillBase):
    id: int
    user_id: int
    is_paid: bool
    
    class Config:
        from_attributes = True
