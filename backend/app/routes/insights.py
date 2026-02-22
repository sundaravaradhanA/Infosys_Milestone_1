from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Transaction, Account, Budget, User

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_accounts = db.query(Account).count()
    total_transactions = db.query(Transaction).count()
    total_users = db.query(User).count()
    
    accounts = db.query(Account).all()
    total_balance = sum(a.balance for a in accounts)
    
    return {
        "total_accounts": total_accounts,
        "total_transactions": total_transactions,
        "total_users": total_users,
        "total_balance": total_balance
    }

@router.get("/spending-by-category")
def get_spending_by_category(db: Session = Depends(get_db)):
    transactions = db.query(
        Transaction.description,
        func.sum(Transaction.amount).label("total")
    ).group_by(Transaction.description).all()
    
    return [{"category": t.description, "amount": float(t.total)} for t in transactions]
