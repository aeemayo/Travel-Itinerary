# OpenRouter API Integration Guide

## Overview

Your Travel Itinerary application now uses **OpenRouter API** instead of Gemini. OpenRouter provides unified access to multiple AI models including GPT-3.5, GPT-4, and more.

## Why OpenRouter?

- ✅ **Multiple Models**: Access GPT-3.5, GPT-4, Claude, and more from one API
- ✅ **Cost Efficient**: Use credits across different providers
- ✅ **Fallback Support**: Automatic fallback if primary model is unavailable
- ✅ **No Vendor Lock-in**: Easy to switch between models
- ✅ **Free Credits**: Get free credits to get started

## Setup

### 1. Get OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up or log in
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key

### 2. Update .env File

```
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxx
PORT=5000
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Application

### Option 1: REST API (Recommended)
```bash
python app.py
```
- Runs on `http://localhost:5000`
- Endpoints:
  - `GET /health` - Health check
  - `POST /api/generate-itinerary` - Generate travel itinerary
  - `POST /api/ask-question` - Ask travel questions

### Option 2: Test Setup
```bash
python test_setup.py
```
- Verifies environment and API connectivity

### Option 3: Run Examples
```bash
python examples.py
```
- Interactive examples for all features

### Option 4: Sentient Agent Server
```bash
python travel_agent.py
```
- Runs as autonomous agent service

## Available Models on OpenRouter

### Popular Options:

```python
# Fast and cheap (recommended for travel itineraries)
"openai/gpt-3.5-turbo"

# More capable
"openai/gpt-4"

# Claude models
"anthropic/claude-3-sonnet"
"anthropic/claude-2.1"

# Open source options
"meta-llama/llama-2-70b-chat"
"mistralai/mistral-7b-instruct"
```

### How to Change Model

Edit `app.py` or `travel_agent.py` and update the model parameter:

```python
data = {
    "model": "openai/gpt-4",  # Change this line
    # ... rest of config
}
```

## API Endpoints

### Generate Itinerary
```bash
curl -X POST http://localhost:5000/api/generate-itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris, France",
    "days": 5,
    "budget": "moderate",
    "interests": ["Art", "Food", "Culture"],
    "additionalNotes": "First time visiting"
  }'
```

### Ask Question
```bash
curl -X POST http://localhost:5000/api/ask-question \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Best time to visit?",
    "destination": "Paris, France"
  }'
```

### Health Check
```bash
curl http://localhost:5000/health
```

## Pricing

OpenRouter uses a credit system:
- Free tier includes $5 in credits
- Pricing varies by model
- View current pricing at [OpenRouter Pricing](https://openrouter.ai/pricing)

### Estimated Cost for Travel Itinerary:
- GPT-3.5 Turbo: ~$0.01 per itinerary
- GPT-4: ~$0.10 per itinerary

## Configuration

### Timeout
- Currently set to 30 seconds per request
- Change in `app.py` `call_openrouter()` function:
  ```python
  timeout=30  # Change this value
  ```

### Temperature
- Currently 0.7 (balanced creativity)
- Range: 0.0 (deterministic) to 1.0 (very creative)
- Change in model data:
  ```python
  "temperature": 0.7
  ```

### Max Tokens
- Generate itinerary: 2000 tokens
- Ask question: 1000 tokens
- Adjust as needed in function calls

## File Structure

```
backend/
├── app.py                    # Flask REST API
├── travel_agent.py          # Sentient Agent Framework
├── examples.py              # Example usage
├── test_setup.py            # Configuration test
├── requirements.txt         # Dependencies
├── .env                     # Configuration (not in repo)
└── SENTIENT_INTEGRATION.md  # Integration guide
```

## Troubleshooting

### "OPENROUTER_API_KEY not set"
- Verify `.env` file contains `OPENROUTER_API_KEY=your_key`
- Restart the application

### "401 Unauthorized"
- Check API key is correct
- Verify key is not expired
- Get a new key from [OpenRouter](https://openrouter.ai/keys)

### "Timeout"
- API requests taking too long
- Check OpenRouter status
- Try with a simpler prompt first

### "Invalid model"
- Model name might have changed
- Check [available models](https://openrouter.ai/docs/models)
- Update model name in code

## Environment Variables

Required:
- `OPENROUTER_API_KEY` - Your OpenRouter API key

Optional:
- `PORT` - Server port (default: 5000)

## Performance Notes

- **Response Time**: 2-10 seconds depending on model
- **Free Credits**: $5 included (typically ~500 requests)
- **Rate Limits**: Varies by plan

## Support

For issues:
1. Check `.env` file configuration
2. Run `python test_setup.py`
3. Verify API key at [OpenRouter Dashboard](https://openrouter.ai)
4. Check API status at [OpenRouter](https://openrouter.ai)

## Next Steps

1. ✅ Get OpenRouter API key
2. ✅ Add to `.env` file
3. ✅ Run `python test_setup.py` to verify
4. ✅ Start with `python app.py`
5. 🔄 Try `python examples.py` for interactive examples
6. 🔄 Connect your React frontend

## Switching Back to Gemini

If you want to switch back to Gemini:

1. Update `requirements.txt`:
   ```
   google-generativeai
   ```

2. Run installation:
   ```bash
   pip install google-generativeai
   ```

3. Revert files to use Gemini API

Or contact support for previous versions.
