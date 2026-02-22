from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CategoryRuleBase(BaseModel):
    category: str
    keyword_pattern: Optional[str] = None
    merchant_pattern: Optional[str] = None
    priority: int = 0
    is_active: bool = True

class CategoryRuleCreate(CategoryRuleBase):
    pass

class CategoryRuleUpdate(BaseModel):
    category: Optional[str] = None
    keyword_pattern: Optional[str] = None
    merchant_pattern: Optional[str] = None
    priority: Optional[int] = None
    is_active: Optional[bool] = None

class CategoryRuleResponse(CategoryRuleBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Predefined categories
PREDEFINED_CATEGORIES = [
    {"name": "Groceries", "icon": "shopping_cart", "color": "#FF6B6B"},
    {"name": "Utilities", "icon": "lightning", "color": "#4ECDC4"},
    {"name": "Entertainment", "icon": "film", "color": "#45B7D1"},
    {"name": "Transportation", "icon": "car", "color": "#F7DC6F"},
    {"name": "Healthcare", "icon": "health", "color": "#BB8FCE"},
    {"name": "Shopping", "icon": "bag", "color": "#85C1E2"},
    {"name": "Subscriptions", "icon": "layers", "color": "#F8B88B"},
    {"name": "Salary", "icon": "trending_up", "color": "#52C41A"},
    {"name": "Transfer", "icon": "swap", "color": "#1890FF"},
    {"name": "Other", "icon": "more_horiz", "color": "#BFBFBF"},
]
