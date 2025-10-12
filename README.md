# 🌍 AI-Powered Travel Itinerary Builder

A simple and elegant travel itinerary builder powered by **ROMA** (Recursive Open Meta-Agents). Create personalized travel plans in seconds using AI!

> **🚀 New to this project? Start here:** [`START_HERE.md`](START_HERE.md)

## 🎥 Demo

![Travel Itinerary Builder](https://img.shields.io/badge/Status-Ready%20to%20Use-success)
![Python](https://img.shields.io/badge/Python-3.12+-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![ROMA](https://img.shields.io/badge/ROMA-Integrated-purple)

## ✨ Features

- 🤖 **AI-Powered Planning**: Uses ROMA's advanced agent framework to generate detailed itineraries
- 🎯 **Customizable**: Set destination, duration, budget, and interests
- 💬 **Interactive Q&A**: Ask follow-up questions about your destination
- 🎨 **Beautiful UI**: Clean, modern React interface
- ⚡ **Fast**: Powered by Flask backend with async support

## 🏗️ Tech Stack

### Backend
- **Python 3.12+**
- **Flask** - Web framework
- **ROMA** - AI agent framework
- **OpenAI API** - LLM provider

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client
- **Modern CSS** - Responsive design

## 📋 Prerequisites

- Python 3.12 or higher
- Node.js 16 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
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
   
   **Note**: Installing ROMA might take a few minutes. If the full clone fails due to network issues, you can try:
   ```bash
   # Option 1: Shallow clone (faster)
   pip install git+https://github.com/sentient-agi/ROMA.git@main --depth 1
   
   # Option 2: Install without ROMA first, then try again
   pip install flask flask-cors python-dotenv openai
   pip install git+https://github.com/sentient-agi/ROMA.git
   ```

5. **Set up environment variables**:
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key
   # You can use nano, vim, or any text editor
   nano .env
   ```
   
   Add your API key to the `.env` file:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

6. **Run the backend server**:
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
│   ├── app.py              # Flask application with ROMA integration
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variables template
│   └── .env               # Your API keys (create this)
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

### ROMA Installation Issues

If you encounter network errors while installing ROMA:

1. **Try shallow clone**:
   ```bash
   pip install git+https://github.com/sentient-agi/ROMA.git --depth 1
   ```

2. **Increase timeout**:
   ```bash
   pip install --timeout=300 git+https://github.com/sentient-agi/ROMA.git
   ```

3. **Use sparse checkout** (see main README)

### Backend Issues

- **ImportError**: Make sure you're in the virtual environment
- **API Key Error**: Verify your `.env` file has the correct `OPENAI_API_KEY`
- **Port already in use**: Change the port in `app.py` or kill the process using port 5000

### Frontend Issues

- **Proxy errors**: Make sure backend is running on port 5000
- **CORS errors**: Check that Flask-CORS is properly configured
- **Module not found**: Run `npm install` again

## 🌟 Features Breakdown

### What ROMA Does

ROMA (Recursive Open Meta-Agents) breaks down complex tasks into subtasks:

1. **Task Decomposition**: Splits itinerary creation into research, planning, and formatting
2. **Parallel Execution**: Processes multiple aspects simultaneously
3. **Intelligent Aggregation**: Combines results into a coherent itinerary
4. **Recursive Planning**: Handles complex queries that require multiple steps

### Example Flow

When you request a 5-day Tokyo itinerary:
1. ROMA analyzes the request
2. Breaks it into: attractions research, food recommendations, transportation, budgeting
3. Executes each subtask (potentially in parallel)
4. Aggregates results into a comprehensive day-by-day plan

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

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **ROMA Framework**: [sentient-agi/ROMA](https://github.com/sentient-agi/ROMA)
- **OpenAI**: For providing the LLM capabilities
- Built with ❤️ using React and Flask

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Ensure all dependencies are installed
3. Verify your API keys are correct
4. Check that both frontend and backend are running

---

**Happy Traveling! ✈️🌍**
