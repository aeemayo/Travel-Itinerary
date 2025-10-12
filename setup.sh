#!/bin/bash

echo "🌍 Travel Itinerary Builder - Quick Setup"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null
then
    echo "❌ Python is not installed. Please install Python 3.12+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Python version: $(python --version)"
echo "✅ Node.js version: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/Scripts/activate || source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies (this may take a few minutes)..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your OPENAI_API_KEY"
    echo ""
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env and add your OPENAI_API_KEY"
echo "2. Open two terminal windows:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend"
echo "   source venv/Scripts/activate  # On Windows Git Bash"
echo "   python app.py"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy traveling! ✈️🌍"
