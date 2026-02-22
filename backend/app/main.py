from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import engine, SessionLocal, Base
from app.routes import auth, accounts, transactions, budgets, bills, rewards, insights, alerts

app = FastAPI(
    title="Digital Banking API",
    description="Modern Banking Application API",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(accounts.router, prefix="/api/accounts", tags=["Accounts"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(budgets.router, prefix="/api/budgets", tags=["Budgets"])
app.include_router(bills.router, prefix="/api/bills", tags=["Bills"])
app.include_router(rewards.router, prefix="/api/rewards", tags=["Rewards"])
app.include_router(insights.router, prefix="/api/insights", tags=["Insights"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])

@app.get("/")
def root():
    return {"message": "Digital Banking API is running", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
