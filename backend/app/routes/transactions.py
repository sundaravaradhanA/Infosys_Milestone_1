from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction
from app.schemas import TransactionCreate, TransactionResponse

router = APIRouter()

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()

@router.post("/", response_model=TransactionResponse)
def create_transaction(txn: TransactionCreate, db: Session = Depends(get_db)):
    new_txn = Transaction(
        account_id=txn.account_id,
        description=txn.description,
        amount=txn.amount
    )
    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)
    return new_txn
