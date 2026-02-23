# Complete Commands Guide for Banking Application

This guide contains all verified commands to run the complete banking application (Backend + Frontend + PostgreSQL Database).

---

## Prerequisites

Ensure the following are installed on your PC:
1. **PostgreSQL 18** - Download from https://www.postgresql.org/download/windows/
2. **Python 3.10+** - Download from https://www.python.org/downloads/
3. **Node.js** - Download from https://nodejs.org/
4. **VS Code** - Download from https://code.visualstudio.com/

---

## Step 1: Database Setup

### 1.1 Open pgAdmin or psql and create the database:

```
sql
CREATE DATABASE banking_db;
```

### 1.2 Connect to the database and create tables:

```
sql
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

---

## Step 2: Python Dependencies

### 2.1 Install Python packages (run in Backend directory):

```
cmd
cd d:\Infosys_Milestone_1\backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-multipart
```

---

## Step 3: Run Backend Server

### Option A: Using batch file (recommended)
```
cmd
d:\Infosys_Milestone_1\run_backend.bat
```

### Option B: Manual command
```
cmd
cd d:\Infosys_Milestone_1\backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Backend URL:** http://127.0.0.1:8000

**API Documentation:** http://127.0.0.1:8000/docs

---

## Step 4: Run Frontend Server

### 4.1 Install npm dependencies (first time only):

```
cmd
cd d:\Infosys_Milestone_1\banking-frontend\banking-frontend
npm install
```

### 4.2 Run Frontend Server

#### Option A: Using batch file (recommended)
```
cmd
d:\Infosys_Milestone_1\run_frontend.bat
```

#### Option B: Manual command
```
cmd
cd d:\Infosys_Milestone_1\banking-frontend\banking-frontend
npm run dev
```

**Frontend URL:** http://localhost:5173

---

## Step 5: Open Application in Chrome

```
cmd
start chrome http://localhost:5173
```

---

## Quick Reference Summary

| Step | Command | Location |
|------|---------|----------|
| Install Python deps | `pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-multipart` | d:\Infosys_Milestone_1\backend |
| Install npm deps | `npm install` | d:\Infosys_Milestone_1\banking-frontend\banking-frontend |
| Run Backend | `python -m uvicorn app.main:app --reload` | d:\Infosys_Milestone_1\backend |
| Run Frontend | `npm run dev` | d:\Infosys_Milestone_1\banking-frontend\banking-frontend |
| Open in Chrome | `start chrome http://localhost:5173` | Any |

---

## Alternative: Using start_*.bat files

The project also includes alternative batch files:

```
cmd
d:\Infosys_Milestone_1\start_backend.bat
d:\Infosys_Milestone_1\start_frontend.bat
```

---

## Troubleshooting

### If backend doesn't start:
1. Check PostgreSQL is running
2. Verify database 'banking_db' exists
3. Check database credentials in `backend/app/database.py`

### If frontend doesn't start:
1. Ensure Node.js is installed: `node --version`
2. Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

### If pages don't load:
1. Ensure both backend and frontend are running
2. Check if ports 8000 and 5175 are available

---

## Application URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://127.0.0.1:8000 |
| API Docs (Swagger) | http://127.0.0.1:8000/docs |
| pgAdmin | Search in Start Menu |
