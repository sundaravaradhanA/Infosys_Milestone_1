@echo off
cd /d %~dp0
cd backend
python seed_sample_data.py
pause
