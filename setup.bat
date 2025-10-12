@echo off
echo 🌍 Travel Itinerary Builder - Quick Setup
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.12+ first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

echo ✅ Python version:
python --version
echo ✅ Node.js version:
node --version
echo.

REM Backend setup
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies (this may take a few minutes)...
pip install --upgrade pip
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit backend\.env and add your OPENAI_API_KEY
    echo.
)

cd ..

REM Frontend setup
echo.
echo 📦 Setting up frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit backend\.env and add your OPENAI_API_KEY
echo 2. Open two command prompt windows:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python app.py
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm start
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo Happy traveling! ✈️🌍
pause
