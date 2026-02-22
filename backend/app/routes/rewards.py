from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Reward
from app.schemas import RewardCreate, RewardResponse

router = APIRouter()

@router.get("/", response_model=list[RewardResponse])
def get_rewards(db: Session = Depends(get_db)):
    return db.query(Reward).all()

@router.post("/", response_model=RewardResponse)
def create_reward(reward: RewardCreate, db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    new_reward = Reward(
        user_id=reward.user_id,
        points=reward.points,
        description=reward.description,
        earned_date=datetime.utcnow(),
        expires_date=datetime.utcnow() + timedelta(days=365)
    )
    db.add(new_reward)
    db.commit()
    db.refresh(new_reward)
    return new_reward
