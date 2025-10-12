# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Setup (One Time)

**Option A: Automated Setup (Recommended)**
```bash
# On Windows
setup.bat

# On Mac/Linux or Git Bash
bash setup.sh
```

**Option B: Manual Setup**

Backend:
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

Frontend:
```bash
cd frontend
npm install
```

### Step 2: Add Your OpenAI API Key

1. Get an API key from: https://platform.openai.com/api-keys
2. Open `backend/.env`
3. Add your key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### Step 3: Run the App

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate  # Windows Git Bash
# or: venv\Scripts\activate.bat  # Windows CMD
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Then open: http://localhost:3000

## 🧪 Test Your Setup

Before running the full app, test your backend:

```bash
cd backend
source venv/Scripts/activate
python test_setup.py
```

## ⚡ Quick Commands

### Backend Commands
```bash
# Activate environment
source venv/Scripts/activate  # Git Bash
venv\Scripts\activate.bat     # CMD

# Run server
python app.py

# Test setup
python test_setup.py

# Install/Update ROMA
pip install git+https://github.com/sentient-agi/ROMA.git --upgrade
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build
```

## 🐛 Common Issues

### Issue: Can't install ROMA (network timeout)
**Solution:**
```bash
# Try shallow clone
pip install git+https://github.com/sentient-agi/ROMA.git --depth 1

# Or increase timeout
pip install --timeout=300 git+https://github.com/sentient-agi/ROMA.git
```

### Issue: "ImportError: No module named sentientresearchagent"
**Solution:**
```bash
# Make sure you're in the virtual environment
source venv/Scripts/activate
pip install git+https://github.com/sentient-agi/ROMA.git
```

### Issue: Backend CORS errors
**Solution:**
- Make sure Flask-CORS is installed: `pip install flask-cors`
- Check that backend is running on port 5000

### Issue: Frontend can't connect to backend
**Solution:**
- Verify backend is running: http://localhost:5000/health
- Check the proxy setting in `frontend/package.json`

## 📝 Project Structure

```
Travel Itinerary/
├── backend/              # Python Flask API
│   ├── app.py           # Main application
│   ├── test_setup.py    # Test script
│   ├── requirements.txt # Dependencies
│   ├── .env            # Your API keys (create this!)
│   └── venv/           # Virtual environment
├── frontend/            # React UI
│   ├── src/
│   │   ├── App.js      # Main component
│   │   └── App.css     # Styles
│   ├── public/
│   └── package.json
├── README.md           # Full documentation
├── QUICKSTART.md       # This file
├── setup.sh           # Linux/Mac setup
└── setup.bat          # Windows setup
```

## 🎯 Usage Tips

1. **Destination**: Be specific (e.g., "Tokyo, Japan" not just "Tokyo")
2. **Days**: 3-7 days works best for detailed itineraries
3. **Budget**: Affects accommodation and dining recommendations
4. **Interests**: Select multiple to get varied activities
5. **Additional Notes**: Add specific requirements (e.g., "vegetarian", "accessible")

## 💡 Example Queries

After generating an itinerary, try asking:
- "What's the best way to get around?"
- "Where can I find authentic local food?"
- "Are there any festivals during this time?"
- "What should I pack for the weather?"
- "How much cash should I bring?"

## 🔗 Useful Links

- **ROMA GitHub**: https://github.com/sentient-agi/ROMA
- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **React Docs**: https://react.dev/
- **Flask Docs**: https://flask.palletsprojects.com/

## 📊 API Endpoints

- `GET /health` - Check if backend is running
- `POST /api/generate-itinerary` - Generate travel itinerary
- `POST /api/ask-question` - Ask follow-up questions

## 🎨 Customization Ideas

- Change colors in `frontend/src/App.css`
- Add more interest categories
- Modify ROMA prompts in `backend/app.py`
- Add export to PDF functionality
- Save itineraries to database

---

**Need help?** Check the full README.md for detailed troubleshooting.
