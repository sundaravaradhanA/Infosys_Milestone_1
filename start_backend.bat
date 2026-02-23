@echo off
cd d:\Infosys_Milestone_1\backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
