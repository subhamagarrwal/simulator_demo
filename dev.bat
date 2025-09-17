@echo off
title Financial Trading Simulator - Dev Server

echo Starting development environment...
echo.

REM Start microservice in background
echo [1/2] Starting ELI5 Microservice (http://localhost:8000)...
start /min "ELI5-Service" cmd /c "cd eli5-service && call venv\Scripts\activate && python main.py"

REM Wait a moment for microservice to initialize
timeout /t 3 /nobreak >nul

REM Start frontend
echo [2/2] Starting React Frontend (http://localhost:3001)...
echo.
echo ==========================================
echo  Development servers are starting...
echo  Frontend: http://localhost:3001  
echo  API: http://localhost:8000/docs
echo ==========================================
echo.

npm run dev