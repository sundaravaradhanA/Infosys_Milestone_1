from pydantic import BaseModel
from datetime import datetime


# ================= USERS =================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    kyc_status: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    kyc_status: str

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: str
    password: str


# ================= ACCOUNTS =================

class AccountCreate(BaseModel):
    bank_name: str
    account_type: str
    balance: float


class AccountResponse(BaseModel):
    id: int
    bank_name: str
    account_type: str
    balance: float

    class Config:
        orm_mode = True


# ================= TRANSACTIONS =================

class TransactionCreate(BaseModel):
    account_id: int
    description: str
    amount: float


class TransactionResponse(BaseModel):
    id: int
    account_id: int
    description: str
    amount: float
    created_at: datetime   # ✅ NEW FIELD

    class Config:
        orm_mode = True
