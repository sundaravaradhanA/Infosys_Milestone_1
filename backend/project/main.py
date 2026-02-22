from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, SessionLocal, Base

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Backend running"}

@app.get("/users", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.post("/users")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    # ✅ Check if email already exists
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=user.password,
        phone=user.phone,
        kyc_status=user.kyc_status,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.post("/login")
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
    }



@app.get("/accounts")
def get_accounts(db: Session = Depends(get_db)):
    return db.query(models.Account).all()


@app.post("/accounts")
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with id=1 not found")

    new_account = models.Account(
        user_id=1,
        bank_name=account.bank_name,
        account_type=account.account_type,
        balance=account.balance,
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account


@app.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(models.Transaction).all()


@app.post("/transactions")
def create_transaction(txn: schemas.TransactionCreate, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == txn.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    new_txn = models.Transaction(
        account_id=txn.account_id,
        description=txn.description,
        amount=txn.amount,
    )
    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)
    return new_txn
