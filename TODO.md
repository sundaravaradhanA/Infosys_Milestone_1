# Milestone 2 - Week 3: Category Rules & Auto-Categorization

## Backend Changes

### 1. Update Transaction Model
- [ ] Add `category` field to Transaction model

### 2. Create CategoryRule Model
- [ ] Create CategoryRule model in backend/app/models/category_rule.py

### 3. Create CategoryRule Schema
- [ ] Create schema in backend/app/schemas/category_rule.py

### 4. Create Category Routes
- [ ] Create backend/app/routes/categories.py with:
  - GET /api/categories - List predefined categories
  - POST /api/categories/rules - Create categorization rule
  - GET /api/categories/rules - List rules
  - PUT /api/categories/rules/{id} - Update rule
  - DELETE /api/categories/rules/{id} - Delete rule

### 5. Update Transaction Routes
- [ ] Add PUT /api/transactions/{id}/category - Update transaction category

### 6. Register Routes in main.py
- [ ] Add categories router to main.py

## Frontend Changes

### 1. Update Transactions Page
- [ ] Add category dropdown to Transactions.jsx
- [ ] Add "Save As Rule" checkbox
- [ ] Add Update button

### 2. Create CategoryRules Page
- [ ] Create CategoryRules.jsx page

### 3. Update App.jsx
- [ ] Add route for CategoryRules page

## Database Changes

### 1. Add category to transactions table
- [ ] Add column via SQL or migration

### 2. Create category_rules table
- [ ] Create table via SQL

### 3. Create category_master table
- [ ] Insert predefined categories
