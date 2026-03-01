from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Bill
from app.schemas import BillCreate, BillResponse

router = APIRouter()

@router.get("/", response_model=list[BillResponse])
def get_bills(
    user_id: int = Query(1, description="User ID"),
    unpaid_only: bool = Query(False, description="Show only unpaid bills"),
    db: Session = Depends(get_db)
):
    """Get all bills for a user"""
    query = db.query(Bill).filter(Bill.user_id == user_id)
    
    if unpaid_only:
        query = query.filter(Bill.is_paid == False)
    
    return query.order_by(Bill.due_date.asc()).all()

@router.post("/", response_model=BillResponse)
def create_bill(bill: BillCreate, db: Session = Depends(get_db)):
    """Create a new bill"""
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

@router.patch("/{bill_id}/pay")
def pay_bill(
    bill_id: int,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    """Mark a bill as paid"""
    bill = db.query(Bill).filter(
        Bill.id == bill_id,
        Bill.user_id == user_id
    ).first()
    
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    bill.is_paid = True
    db.commit()
    return {"message": "Bill marked as paid"}

@router.delete("/{bill_id}")
def delete_bill(
    bill_id: int,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    """Delete a bill"""
    bill = db.query(Bill).filter(
        Bill.id == bill_id,
        Bill.user_id == user_id
    ).first()
    
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    db.delete(bill)
    db.commit()
    return {"message": "Bill deleted successfully"}
