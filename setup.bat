@echo off
echo ========================================
echo Bedtime Story Generator - Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/4] Creating virtual environment...
if exist venv (
    echo Virtual environment already exists. Skipping creation.
) else (
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully.
)

echo.
echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

echo.
echo [3/4] Upgrading pip...
python -m pip install --upgrade pip

echo.
echo [4/4] Installing requirements...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install requirements
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo IMPORTANT: You need to set up your API keys before running the app.
echo.
echo 1. Get a FREE Groq API key from: https://console.groq.com/
echo    (Required for story generation)
echo.
echo 2. Get a FREE Google API key from: https://aistudio.google.com/
echo    (Optional - only needed for translation to other languages)
echo.
echo 3. Create a .env file in this directory with your keys:
echo    GROQ_API_KEY=your-groq-api-key-here
echo    GOOGLE_API_KEY=your-google-api-key-here
echo.
echo After setting up your .env file, run: run.bat
echo.
pause
