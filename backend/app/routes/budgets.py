from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Budget
from app.schemas import BudgetCreate, BudgetResponse
from sqlalchemy import func

router = APIRouter()

@router.get("/", response_model=list[BudgetResponse])
def get_budgets(db: Session = Depends(get_db)):
    return db.query(Budget).all()

@router.post("/", response_model=BudgetResponse)
def create_budget(budget: BudgetCreate, db: Session = Depends(get_db)):
    new_budget = Budget(
        user_id=budget.user_id,
        category=budget.category,
        limit_amount=budget.limit_amount,
        spent_amount=0,
        month=budget.month
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget
