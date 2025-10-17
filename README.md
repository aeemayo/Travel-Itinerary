# 🌍 AI-Powered Travel Itinerary Builder

An intelligent travel itinerary builder powered by **Sentient Agent Framework** and **OpenRouter API**. Create personalized travel plans in seconds using AI!

> **🚀 New to this project? Start here:** [`START_HERE.md`](START_HERE.md)

## 🎥 Demo

![Travel Itinerary Builder](https://img.shields.io/badge/Status-Ready%20to%20Use-success)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Sentient Framework](https://img.shields.io/badge/Sentient-Framework-purple)
![OpenRouter](https://img.shields.io/badge/OpenRouter-API-green)

## ✨ Features

- 🤖 **AI-Powered Planning**: Uses Sentient Agent Framework with OpenRouter API for intelligent itinerary generation
- 🎯 **Customizable**: Set destination, duration, budget, and interests
- 💬 **Interactive Q&A**: Ask follow-up questions about your destination
- 🎨 **Beautiful UI**: Clean, modern React interface
- ⚡ **Fast**: Powered by Flask backend with async support
- 🔄 **Multiple AI Models**: Access GPT-3.5, GPT-4, Claude, and more via OpenRouter

## 🏗️ Tech Stack

### Backend
- **Python 3.10+**
- **Flask** - Web framework
- **Sentient Agent Framework** - AI agent orchestration
- **OpenRouter API** - Unified LLM provider (GPT-3.5, GPT-4, Claude, Llama, etc.)
- **Requests** - HTTP client for API calls

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client
- **Modern CSS** - Responsive design

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 16 or higher
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- Git

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

```bash
cd "c:\Users\Admin\Downloads\Travel Itinerary"
```

### Step 2: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   ```bash
   # On Windows (Git Bash)
   source venv/Scripts/activate
   
   # On Windows (CMD)
   venv\Scripts\activate.bat
   
   # On Mac/Linux
   source venv/bin/activate
   ```

4. **Install dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your OpenRouter API key
   # You can use nano, vim, or any text editor
   nano .env
   ```
   
   Add your API key to the `.env` file:

   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

6. **Run the backend server**:
   Add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=sk-or-your-key-here
   PORT=5000
   ```

6. **Verify setup** (optional but recommended):
   ```bash
   python test_setup.py
   ```
   
   This will test your API key and connection. Choose `y` when prompted to test the OpenRouter API.

7. **Start the backend**:
   ```bash
   python app.py
   ```
   
   The backend will start at `http://localhost:5000`

### Step 3: Frontend Setup

Open a **new terminal** window and:

1. **Navigate to frontend directory**:
   ```bash
   cd "c:\Users\Admin\Downloads\Travel Itinerary\frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   The frontend will automatically open at `http://localhost:3000`

## 🎮 Usage

1. **Access the app**: Open `http://localhost:3000` in your browser

2. **Fill in the form**:
   - Enter your destination (e.g., "Tokyo, Japan")
   - Choose number of days
   - Select budget level
   - Pick your interests
   - Add any special requirements

3. **Generate Itinerary**: Click the "Generate Itinerary" button

4. **Ask Questions**: Once the itinerary is generated, use the Q&A section to ask follow-up questions

## 📁 Project Structure

```
Travel Itinerary/
├── backend/
│   ├── app.py                      # Flask REST API
│   ├── travel_agent.py             # Sentient Agent Framework integration
│   ├── examples.py                 # Usage examples
│   ├── test_setup.py               # Configuration test script
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment variables template
│   ├── .env                        # Your API keys (create this)
│   ├── OPENROUTER_SETUP.md         # OpenRouter setup guide
│   ├── SENTIENT_INTEGRATION.md     # Agent framework guide
│   └── SSL_FIX_GUIDE.md            # SSL troubleshooting
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Node dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Backend API

- `GET /health` - Health check endpoint
- `POST /api/generate-itinerary` - Generate travel itinerary
  ```json
  {
    "destination": "Paris, France",
    "days": 5,
    "budget": "moderate",
    "interests": ["Culture & History", "Food & Dining"],
    "additionalNotes": "Prefer walking tours"
  }
  ```

- `POST /api/ask-question` - Ask questions about destination
  ```json
  {
    "question": "What's the best time to visit?",
    "destination": "Paris, France"
  }
  ```

## 🐛 Troubleshooting

### OpenRouter API Issues

- **Authentication Error**: Verify your `.env` file has the correct `OPENROUTER_API_KEY`
  - Get your key from [openrouter.ai](https://openrouter.ai)
  - Make sure it starts with `sk-or-`

- **SSL Certificate Error**: If you encounter SSL errors like `SSLV3_ALERT_BAD_RECORD_MAC`:
  - See [SSL_FIX_GUIDE.md](./backend/SSL_FIX_GUIDE.md)
  - Usually fixed by: `pip install --upgrade certifi`

- **Rate Limiting**: OpenRouter has usage limits based on your account
  - Check your usage at [openrouter.ai/activity](https://openrouter.ai/activity)
  - Consider upgrading your plan if you hit limits

### Backend Issues

- **ImportError**: Make sure you're in the virtual environment
- **API Key Error**: Verify your `.env` file has `OPENROUTER_API_KEY=sk-or-your-key-here`
- **Port already in use**: Change the port in `app.py` or kill the process using port 5000
- **Connection timeout**: Check your internet connection and OpenRouter API status

### Frontend Issues

- **Proxy errors**: Make sure backend is running on port 5000
- **CORS errors**: Check that Flask-CORS is properly configured in `app.py`
- **Module not found**: Run `npm install` again

## 🌟 Features Breakdown

### What Sentient Agent Framework Does

The Sentient Agent Framework enables:

1. **Agent Decomposition**: Breaks down complex travel planning into structured tasks
2. **Intelligent Planning**: Uses LLM (OpenRouter) to understand context and generate solutions
3. **Response Handling**: Manages and formats agent responses
4. **Async Support**: Handles operations asynchronously for better performance
5. **Extensibility**: Easy to extend with custom agents for different domains

### Example Flow

When you request a 5-day Tokyo itinerary:
1. Frontend sends request to backend
2. TravelItineraryAgent (extends AbstractAgent) analyzes the request
3. Agent calls OpenRouter API with refined prompts
4. OpenRouter's LLM (default: GPT-3.5-turbo) generates itinerary
5. ResponseHandler formats the response
6. Backend returns structured itinerary to frontend

## 📚 Additional Documentation

- **[OpenRouter Setup Guide](./backend/OPENROUTER_SETUP.md)**: Detailed OpenRouter configuration
- **[Sentient Integration Guide](./backend/SENTIENT_INTEGRATION.md)**: Framework integration details
- **[SSL Troubleshooting Guide](./backend/SSL_FIX_GUIDE.md)**: Fixing certificate errors

## 🚀 Next Steps / Enhancements

Want to extend this app? Here are some ideas:

- [ ] Save itineraries to a database
- [ ] User authentication
- [ ] Export to PDF
- [ ] Integration with booking APIs
- [ ] Weather information
- [ ] Currency conversion
- [ ] Map integration
- [ ] Multi-city trips
- [ ] Collaborative planning
- [ ] Custom agent types for different domains

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Sentient Agent Framework**: [sentient-agi/sentient-agent-framework](https://github.com/sentient-agi/)
- **OpenRouter**: For providing unified access to multiple LLMs
- Built with ❤️ using React, Flask, and Sentient Agent Framework

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Ensure all dependencies are installed: `pip install -r requirements.txt`
3. Run the setup test: `python test_setup.py`
4. Verify your API keys are correct in `.env`
5. Check the detailed guides in `backend/` folder
6. Ensure both frontend and backend are running

---

**Happy Traveling! ✈️🌍**
