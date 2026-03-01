from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Reward
from app.schemas import RewardCreate, RewardResponse

router = APIRouter()

@router.get("/", response_model=list[RewardResponse])
def get_rewards(
    user_id: int = Query(1, description="User ID"),
    db: Session = Depends(get_db)
):
    """Get all rewards for a user"""
    return db.query(Reward).filter(Reward.user_id == user_id).order_by(Reward.earned_date.desc()).all()

@router.post("/", response_model=RewardResponse)
def create_reward(reward: RewardCreate, db: Session = Depends(get_db)):
    """Create a new reward"""
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

@router.get("/total-points")
def get_total_points(
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    """Get total reward points for a user"""
    from sqlalchemy import func
    total = db.query(func.sum(Reward.points)).filter(Reward.user_id == user_id).scalar()
    return {"total_points": total or 0}
