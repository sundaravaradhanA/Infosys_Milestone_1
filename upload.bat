@echo off
cd /d %~dp0
git add .
git commit -m "Milestone 2"
git push origin main
pause
