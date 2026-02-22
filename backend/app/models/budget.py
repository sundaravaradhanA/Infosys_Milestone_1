from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String)
    limit_amount = Column(Float)
    spent_amount = Column(Float, default=0)
    month = Column(String)  # e.g., "2024-01"
    
    # Relationships
    user = relationship("User", back_populates="budgets")
