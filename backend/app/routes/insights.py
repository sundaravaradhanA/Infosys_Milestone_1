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
    # Get all transactions with their categories
    transactions = db.query(Transaction).filter(
        Transaction.amount < 0,  # Only expenses (negative amounts)
        Transaction.category != None,  # Exclude null categories
        Transaction.category != ""   # Exclude empty categories
    ).all()
    
    # Group by category and sum absolute values in Python
    category_totals = {}
    for txn in transactions:
        cat = txn.category
        amount = abs(txn.amount)  # Convert to positive in Python
        if cat in category_totals:
            category_totals[cat] += amount
        else:
            category_totals[cat] = amount
    
    # Convert to list and sort by amount descending
    result = [{"category": cat, "amount": round(amount, 2)} 
              for cat, amount in category_totals.items()]
    
    return sorted(result, key=lambda x: x["amount"], reverse=True)
