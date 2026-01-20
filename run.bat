@echo off
echo ========================================
echo Bedtime Story Generator - Launcher
echo ========================================
echo.

REM Check if virtual environment exists
if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first to set up the environment.
    pause
    exit /b 1
)

REM Note: .env file check removed as it's unreliable on Windows
REM The app will warn about missing API keys when it starts

echo [1/2] Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

echo.
echo [2/2] Starting Bedtime Story Generator...
echo.
echo ========================================
echo Server will start on: http://localhost:5000
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python app.py

REM Deactivate virtual environment when app closes
deactivate
