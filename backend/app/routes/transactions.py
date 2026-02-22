from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction, CategoryRule
from app.schemas import TransactionCreate, TransactionResponse, TransactionUpdate

router = APIRouter()

def auto_categorize_transaction(description: str, db: Session):
    """Automatically categorize transaction based on rules"""
    # Get all active rules ordered by priority
    rules = db.query(CategoryRule).filter(CategoryRule.is_active == True).order_by(CategoryRule.priority.desc()).all()
    
    for rule in rules:
        # Check keyword pattern
        if rule.keyword_pattern and rule.keyword_pattern.lower() in description.lower():
            return rule.category
        # Check merchant pattern
        if rule.merchant_pattern and rule.merchant_pattern.lower() in description.lower():
            return rule.category
    
    return None

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()

@router.post("/", response_model=TransactionResponse)
def create_transaction(txn: TransactionCreate, db: Session = Depends(get_db)):
    # Auto-categorize if no category provided
    category = txn.category
    if not category:
        category = auto_categorize_transaction(txn.description, db)
    
    new_txn = Transaction(
        account_id=txn.account_id,
        description=txn.description,
        amount=txn.amount,
        category=category
    )
    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)
    return new_txn

@router.put("/{transaction_id}/category", response_model=TransactionResponse)
def update_transaction_category(transaction_id: int, update_data: TransactionUpdate, db: Session = Depends(get_db), save_as_rule: bool = False):
    """Update transaction category"""
    txn = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if update_data.category is not None:
        txn.category = update_data.category
        
        # Save as rule if requested
        if save_as_rule:
            # Check if rule already exists for this keyword
            existing_rule = db.query(CategoryRule).filter(
                CategoryRule.keyword_pattern == txn.description.split()[0] if txn.description else None
            ).first()
            
            if not existing_rule and txn.description:
                new_rule = CategoryRule(
                    user_id=1,
                    category=update_data.category,
                    keyword_pattern=txn.description.split()[0] if txn.description else "",
                    priority=1,
                    is_active=True
                )
                db.add(new_rule)
    
    db.commit()
    db.refresh(txn)
    return txn

@router.post("/categorize-all")
def categorize_all_transactions(db: Session = Depends(get_db)):
    """Apply auto-categorization to all uncategorized transactions"""
    transactions = db.query(Transaction).filter(Transaction.category == None).all()
    
    count = 0
    for txn in transactions:
        category = auto_categorize_transaction(txn.description, db)
        if category:
            txn.category = category
            count += 1
    
    db.commit()
    return {"message": f"Categorized {count} transactions"}
