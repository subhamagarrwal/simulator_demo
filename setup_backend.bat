@echo off
echo Installing Python dependencies for simulation backend...

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if pip is available  
pip --version >nul 2>&1
if errorlevel 1 (
    echo Error: pip is not installed or not in PATH
    pause
    exit /b 1
)

echo Installing required Python packages...
pip install -r requirements.txt

if errorlevel 1 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Python dependencies installed successfully!
echo.
echo To start the simulation backend:
echo   python simulatorprogram.py
echo.
echo The backend will run on http://127.0.0.1:5000
echo Make sure the model file 'model_and_pre_fin.pkl' is in the same directory
echo.
pause