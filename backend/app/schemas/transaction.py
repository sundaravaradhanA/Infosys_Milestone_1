from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    account_id: int
    description: str
    amount: float

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True
