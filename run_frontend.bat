@echo off
cd /d %~dp0
cd banking-frontend\banking-frontend
start cmd /k "npm run dev"
