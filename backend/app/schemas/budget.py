from pydantic import BaseModel

class BudgetBase(BaseModel):
    category: str
    limit_amount: float
    month: str

class BudgetCreate(BudgetBase):
    user_id: int

class BudgetResponse(BudgetBase):
    id: int
    user_id: int
    spent_amount: float
    
    class Config:
        orm_mode = True
