@echo off
echo Setting up ELI5 Financial Explanation Microservice...

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Start the service
echo Starting ELI5 Financial Explanation Service on port 8000...
echo Open http://localhost:8000/docs to see API documentation
python main.py