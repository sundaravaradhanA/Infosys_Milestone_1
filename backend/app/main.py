from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.routes import auth, accounts, transactions, budgets, bills, rewards, alerts, insights, categories

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

# Register routes
app.include_router(auth.router, prefix="", tags=["Auth"])
app.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
app.include_router(bills.router, prefix="/bills", tags=["Bills"])
app.include_router(rewards.router, prefix="/rewards", tags=["Rewards"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])
app.include_router(categories.router, prefix="", tags=["Categories"])

@app.get("/")
def root():
    return {"message": "Digital Banking API is running", "version": "1.0.0"}

@app.get("/health") 
def health_check():
    return {"status": "healthy"}
