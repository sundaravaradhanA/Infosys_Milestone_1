from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Bill
from app.schemas import BillCreate, BillResponse

router = APIRouter()

@router.get("/", response_model=list[BillResponse])
def get_bills(db: Session = Depends(get_db)):
    return db.query(Bill).all()

@router.post("/", response_model=BillResponse)
def create_bill(bill: BillCreate, db: Session = Depends(get_db)):
    new_bill = Bill(
        user_id=bill.user_id,
        bill_name=bill.bill_name,
        amount=bill.amount,
        due_date=bill.due_date,
        category=bill.category,
        is_paid=False
    )
    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)
    return new_bill
