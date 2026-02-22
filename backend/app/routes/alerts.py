from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Alert
from app.schemas import AlertCreate, AlertResponse

router = APIRouter()

@router.get("/", response_model=list[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).all()

@router.post("/", response_model=AlertResponse)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    new_alert = Alert(
        user_id=alert.user_id,
        title=alert.title,
        message=alert.message,
        alert_type=alert.alert_type,
        is_read=False
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert
