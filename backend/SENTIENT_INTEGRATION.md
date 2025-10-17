# Sentient Agent Framework Integration Guide

## Overview

Your Travel Itinerary application now integrates the **Sentient Agent Framework** with **Google Gemini API** for intelligent travel planning.

## Architecture

### Two Modes of Operation:

1. **Flask REST API** (`app.py`)
   - Traditional REST endpoints
   - `/api/generate-itinerary` - Generate travel itineraries
   - `/api/ask-question` - Ask travel questions
   - Direct Gemini API integration
   - Port: 5000

2. **Sentient Agent Framework Server** (`travel_agent.py`)
   - Runs as an autonomous agent service
   - Uses Sentient Chat event protocol
   - Agent-based architecture
   - Custom port configuration
   - Direct Gemini API integration

## Setup

### Prerequisites
- Python 3.10+
- Google Gemini API key
- Virtual environment activated

### Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Create/update `.env` file:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=5000
   ```

3. **Get your Gemini API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create new API key
   - Add to `.env` file

## Running the Application

### Option 1: REST API (Recommended for Web Frontend)
```bash
python app.py
```
- Runs on `http://localhost:5000`
- Provides REST endpoints for your React frontend
- Check health: `curl http://localhost:5000/health`

### Option 2: Sentient Agent Server (Advanced)
```bash
python travel_agent.py
```
- Runs as an autonomous agent service
- Uses Sentient Chat protocol
- For integration with Sentient Chat systems
- Connect clients using Sentient Chat client

### Option 3: Test Setup
```bash
python test_setup.py
```
- Verifies environment configuration
- Tests Gemini API connectivity
- Checks all dependencies

## API Endpoints (REST Mode)

### Generate Itinerary
```bash
POST /api/generate-itinerary
Content-Type: application/json

{
  "destination": "Paris, France",
  "days": 5,
  "budget": "moderate",
  "interests": ["Art", "Food", "Culture"],
  "additionalNotes": "First time visiting"
}
```

### Ask Question
```bash
POST /api/ask-question
Content-Type: application/json

{
  "question": "Best time to visit?",
  "destination": "Paris, France"
}
```

### Health Check
```bash
GET /health
```

## Agent Features

The `TravelItineraryAgent` provides:

- **Intelligent Processing**: Uses Gemini 1.5 Flash for fast, accurate responses
- **Structured Output**: Provides detailed itineraries with:
  - Day-by-day activities
  - Accommodation recommendations
  - Transportation options
  - Budget breakdown
  - Local food recommendations
  - Cultural tips
  - Best visiting times

- **Async Support**: Full async/await support for non-blocking operations
- **Error Handling**: Comprehensive error handling and logging
- **Logging**: Detailed logging for debugging and monitoring

## File Structure

```
backend/
├── app.py                 # Flask REST API (main)
├── travel_agent.py        # Sentient Agent Framework integration
├── examples.py            # Example usage snippets
├── test_setup.py          # Environment verification
├── requirements.txt       # Dependencies
└── .env                   # Configuration (not in repo)
```

## Configuration

### Gemini Models Available
- `gemini-1.5-flash` (Used) - Fast, free tier
- `gemini-1.5-pro` - More capable, limited free requests

Change in `travel_agent.py` or `app.py`:
```python
model = genai.GenerativeModel('gemini-1.5-pro')  # For Pro model
```

## Troubleshooting

### "GOOGLE_API_KEY not set"
- Add `GOOGLE_API_KEY=your_key` to `.env`
- Restart the application

### Import Errors
```bash
pip install -r requirements.txt
```

### Agent Not Starting
- Check port availability
- Verify Gemini API key is valid
- Check logs for detailed error messages

## Development

### Adding New Features

1. **Extend the Agent:**
   ```python
   class ExtendedTravelAgent(TravelItineraryAgent):
       async def assist(self, query, session, response_handler):
           # Add custom logic
           pass
   ```

2. **Add New Endpoints:**
   Edit `app.py` to add more routes

3. **Customize Prompts:**
   Edit the prompt templates in `travel_agent.py` or `app.py`

## Performance Notes

- **Free Tier Limits**: 1,500 requests/day, 1M tokens/month
- **Response Time**: ~2-5 seconds per request
- **Token Usage**: ~500-1000 tokens per itinerary

## Next Steps

1. ✅ Start with REST API (`app.py`)
2. ✅ Test with `test_setup.py`
3. ✅ Run examples with `examples.py`
4. 🔄 Integrate with your React frontend
5. 🔄 Consider Sentient Agent mode for autonomous operation

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify `.env` configuration
3. Test API connectivity with `test_setup.py`
4. Review the example files for usage patterns
