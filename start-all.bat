@echo off
echo ==========================================
echo  Financial Trading Simulator Launcher
echo ==========================================
echo.

echo Starting ELI5 Microservice...
echo.
start "ELI5 Microservice (Port 8000)" cmd /c "cd eli5-service && start.bat"

echo Waiting for microservice to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend React App...
echo.
start "React Frontend (Port 3001)" cmd /c "npm run dev"

echo.
echo ==========================================
echo  Both services are starting!
echo ==========================================
echo.
echo Frontend: http://localhost:3001
echo Microservice API: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press any key to open both in browser...
pause >nul

start http://localhost:3001
start http://localhost:8000/docs

echo.
echo Services are running! Check the opened terminals.
echo Press any key to exit this launcher...
pause >nul