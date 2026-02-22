# 🚀 Complete Banking Application Setup Guide

This guide will help you set up the full banking application (Backend + Frontend + PostgreSQL Database).

---

## 📋 Prerequisites (Must be installed on your PC)

1. **PostgreSQL 18** - Download from https://www.postgresql.org/download/windows/
2. **Python 3.10+** - Download from https://www.python.org/downloads/
3. **Node.js** - Download from https://nodejs.org/
4. **VS Code** - Download from https://code.visualstudio.com/

---

## 🛠️ Step-by-Step Setup

### Step 1: Setup PostgreSQL Database

1. Install PostgreSQL 18 and set password as: `sundar@2005`
2. Open pgAdmin or psql and run these commands:

```
sql
-- Create database
CREATE DATABASE banking_db;

-- Connect to database
\c banking_db

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    email VARCHAR UNIQUE,
    password VARCHAR,
    phone VARCHAR,
    kyc_status VARCHAR
);

-- Create accounts table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    bank_name VARCHAR,
    account_type VARCHAR,
    balance FLOAT
);

-- Create transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    description VARCHAR,
    amount FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    category VARCHAR,
    limit_amount FLOAT,
    spent_amount FLOAT DEFAULT 0,
    month VARCHAR
);

-- Create bills table
CREATE TABLE bills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    bill_name VARCHAR,
    amount FLOAT,
    due_date DATE,
    category VARCHAR,
    is_paid BOOLEAN DEFAULT FALSE
);

-- Create rewards table
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    points INTEGER,
    description VARCHAR,
    earned_date TIMESTAMP DEFAULT NOW(),
    expires_date TIMESTAMP DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR,
    message VARCHAR,
    alert_type VARCHAR,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 2: Insert Sample Data

Run these SQL commands to add sample data:

```
sql
-- Insert sample users
INSERT INTO users (name, email, password, phone, kyc_status) VALUES 
('Sundaravaradhan A', 'sundar@gmail.com', 'sundar@2005', '9876543210', 'Verified'),
('Aditya Sharma', 'aditya@gmail.com', 'Aditya123', '9876543211', 'Verified'),
('Rahul Verma', 'rahul.verma@yahoo.com', 'Rahul456', '9123456789', 'Verified'),
('Priya Patel', 'priya.patel@hotmail.com', 'Priya789', '9988776655', 'Pending');

-- Insert sample accounts
INSERT INTO accounts (user_id, bank_name, account_type, balance) VALUES 
(1, 'HDFC Bank', 'Savings', 50000),
(1, 'State Bank', 'Current', 120000),
(2, 'ICICI Bank', 'Savings', 75000),
(3, 'Bank of Baroda', 'Current', 150000);

-- Insert sample transactions
INSERT INTO transactions (account_id, description, amount) VALUES 
(1, 'Grocery Shopping', -2500),
(1, 'Salary Credit', 50000),
(2, 'Utility Bill', -1500),
(3, 'Online Shopping', -3000);

-- Insert sample budgets
INSERT INTO budgets (user_id, category, limit_amount, spent_amount, month) VALUES 
(1, 'Food', 10000, 5000, 'February 2026'),
(1, 'Transport', 5000, 2000, 'February 2026'),
(2, 'Shopping', 15000, 8000, 'February 2026');

-- Insert sample bills
INSERT INTO bills (user_id, bill_name, amount, due_date, category, is_paid) VALUES 
(1, 'Electricity Bill', 1500, '2026-02-25', 'Utilities', FALSE),
(1, 'Internet Bill', 999, '2026-02-28', 'Services', FALSE),
(2, 'Water Bill', 500, '2026-03-01', 'Utilities', FALSE);

-- Insert sample rewards
INSERT INTO rewards (user_id, points, description) VALUES 
(1, 500, 'Welcome Bonus'),
(1, 200, 'Referral Bonus'),
(2, 300, 'First Transaction');

-- Insert sample alerts
INSERT INTO alerts (user_id, title, message, alert_type) VALUES 
(1, 'Low Balance Alert', 'Your account balance is below Rs. 5000', 'warning'),
(1, 'Bill Reminder', 'Electricity bill due in 3 days', 'info'),
(2, 'Transaction Alert', 'A new transaction of Rs. 3000 occurred', 'success');
```

---

### Step 3: Update Database Password in Code

Edit file: `Backend/app/database.py`

Change the DATABASE_URL to use your PostgreSQL password:

```
python
DATABASE_URL = "postgresql://postgres:sundar%402005@localhost:5432/banking_db"
```

Note: In the URL, `@` is encoded as `%40`

---

### Step 4: Install Python Dependencies

Make sure you have the required packages installed:

```
bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic
```

---

### Step 5: Start Backend

Open terminal and run:

```
bash
cd d:/Infosys_Milestone_1/Backend
python -m uvicorn app.main:app --reload
```

Backend will run at: http://127.0.0.1:8000

---

### Step 6: Start Frontend

Open a new terminal and run:

```
bash
cd d:/Infosys_Milestone_1/banking-frontend/banking-frontend
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

---

### Step 7: Use the Application

1. Open browser to: http://localhost:5173
2. Register a new account
3. Login with your credentials

---

## 📊 How to View Data in pgAdmin

1. Open pgAdmin
2. Connect to PostgreSQL server (password: sundar@2005)
3. Expand: Servers → PostgreSQL 18 → Databases → banking_db → Schemas → public → Tables
4. Right-click table → View/Edit Data → All Rows

---

## 🔧 Useful SQL Commands

```
sql
-- View all data
SELECT * FROM users;
SELECT * FROM accounts;
SELECT * FROM transactions;
SELECT * FROM budgets;
SELECT * FROM bills;
SELECT * FROM rewards;
SELECT * FROM alerts;

-- Add new user
INSERT INTO users (name, email, password, phone, kyc_status) 
VALUES ('Your Name', 'email@example.com', 'password', '1234567890', 'Pending');

-- Update data
UPDATE users SET kyc_status = 'Verified' WHERE id = 1;

-- Delete data
DELETE FROM users WHERE id = 2;
```

---

## ✅ Complete Prompt for Blackbox AI

Copy and paste this prompt to Blackbox:

---

**"I have a banking application with backend (FastAPI) and frontend (React + Vite) code in my repository. I need you to help me set it up and run it.

Prerequisites needed:
- PostgreSQL 18 installed with password: sundar@2005
- Python installed
- Node.js installed

Please do the following:

1. Create a PostgreSQL database named 'banking_db' with all tables: users, accounts, transactions, budgets, bills, rewards, alerts (use the SQL from SETUP_GUIDE.md)

2. Insert the sample data provided in SETUP_GUIDE.md

3. Update Backend/app/database.py to use password: sundar%402005 (URL encode @ as %40)

4. Install Python dependencies: pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic

5. Start the backend server using: cd Backend && python -m uvicorn app.main:app --reload

6. Start the frontend by running: cd banking-frontend/banking-frontend && npm install && npm run dev

7. Confirm both servers are running and tell me the URLs to access the application."**

---

## 🎯 Quick Summary

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://127.0.0.1:8000 |
| pgAdmin | Search in Start Menu |

---

## 📁 Project Structure

```
Infosys_Milestone_1/
├── Backend/                    # FastAPI Backend
│   └── app/
│       ├── main.py            # Main application file
│       ├── database.py        # Database configuration
│       ├── models/            # SQLAlchemy models
│       ├── schemas/           # Pydantic schemas
│       └── routes/            # API routes
├── banking-frontend/          # React Frontend
│   └── banking-frontend/
│       ├── src/
│       │   ├── pages/        # React pages
│       │   └── components/    # React components
│       └── package.json
└── SETUP_GUIDE.md            # This file
```

---

Happy Coding! 🚀
