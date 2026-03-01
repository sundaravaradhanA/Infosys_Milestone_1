# Milestone 2 - Implementation Plan

## Current Status Analysis
### Already Implemented (from Milestone 1 & partial Milestone 2):
- ✅ User, Account, Transaction, Budget, Alert, CategoryRule models
- ✅ Basic CRUD APIs for transactions, budgets, alerts, category rules
- ✅ Auto-categorization engine (basic keyword/merchant matching)
- ✅ Frontend Transactions page with category editing
- ✅ Basic Budget page (hardcoded values)

### Missing Features (to implement):
1. Budget computation engine (calculate spent amounts from transactions)
2. Budget progress calculation (percentage)
3. Overspending detection & automatic alert system
4. Reporting API (spending by category)
5. Proper user-based filtering (currently returns all data)
6. JWT authentication on protected routes
7. Better Budget frontend with real data
8. Alerts frontend page

---

## Implementation Steps

### Step 1: Create Service Layer Architecture
- [ ] Create `backend/app/services/` directory
- [ ] Create `backend/app/services/rule_engine.py` - Enhanced rule matching
- [ ] Create `backend/app/services/budget_service.py` - Budget computation
- [ ] Create `backend/app/services/alert_service.py` - Alert generation

### Step 2: Enhance Budget Service
- [ ] Add monthly aggregation logic
- [ ] Add spent_amount calculation from transactions
- [ ] Add progress percentage calculation
- [ ] Update budget routes to use service layer

### Step 3: Implement Overspending Detection
- [ ] Add alert creation when budget exceeded
- [ ] Prevent duplicate alerts
- [ ] Add mark-as-read functionality

### Step 4: Create Reporting API
- [ ] Add `/reports/spending-by-category` endpoint
- [ ] Add month/year filtering

### Step 5: Add User-based Filtering
- [ ] Update all routes to filter by user_id
- [ ] Add JWT dependency for authentication

### Step 6: Update Frontend
- [ ] Update Budget.jsx with real API data
- [ ] Create Alerts.jsx page
- [ ] Update navigation

### Step 7: Database Optimizations
- [ ] Add indexes for better query performance

---

## Files to Create:
1. `backend/app/services/__init__.py`
2. `backend/app/services/rule_engine.py`
3. `backend/app/services/budget_service.py`
4. `backend/app/services/alert_service.py`
5. `banking-frontend/banking-frontend/src/pages/Alerts.jsx`

## Files to Modify:
1. `backend/app/routes/budgets.py`
2. `backend/app/routes/transactions.py`
3. `backend/app/routes/alerts.py`
4. `backend/app/schemas/budget.py`
5. `backend/app/models/transaction.py` (add txn_date field)
6. `banking-frontend/banking-frontend/src/pages/Budget.jsx`
7. `banking-frontend/banking-frontend/src/App.jsx`
