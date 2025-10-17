from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
import requests
import json
import urllib3

# Disable SSL warnings (optional, for development only)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Verify API key is set
if not OPENROUTER_API_KEY:
    print("WARNING: OPENROUTER_API_KEY not set. Please add it to .env file")

def call_openrouter(prompt: str, max_tokens: int = 2000) -> str:
    """
    Call OpenRouter API with the given prompt
    """
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Travel Itinerary Builder",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "openai/gpt-3.5-turbo",  # You can change this to other models
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful travel assistant with expertise in creating detailed travel itineraries."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=data,
            timeout=30,
            verify=False  # Disable SSL verification (for troubleshooting)
        )
        response.raise_for_status()
        
        result = response.json()
        return result['choices'][0]['message']['content']
    except requests.exceptions.SSLError as e:
        print(f"SSL Error: {str(e)}")
        raise Exception(f"SSL Connection Error: {str(e)}. Try updating certifi: pip install --upgrade certifi")
    except requests.exceptions.RequestException as e:
        raise Exception(f"OpenRouter API error: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Sentient Agent Framework API is running'
    })

@app.route('/api/generate-itinerary', methods=['POST'])
def generate_itinerary():
    """
    Generate a travel itinerary using OpenRouter API
    """
    try:
        data = request.json
        
        # Extract parameters
        destination = data.get('destination', '')
        days = data.get('days', 3)
        budget = data.get('budget', 'moderate')
        interests = data.get('interests', [])
        additional_notes = data.get('additionalNotes', '')
        
        if not destination:
            return jsonify({'error': 'Destination is required'}), 400
        
        # Build the prompt
        prompt = f"""Create a detailed travel itinerary for a {days}-day trip to {destination}.

Budget Level: {budget}
Interests: {', '.join(interests) if interests else 'General sightseeing'}
Additional Requirements: {additional_notes if additional_notes else 'None'}

Please provide:
1. Day-by-day itinerary with morning, afternoon, and evening activities
2. Recommended accommodations (with approximate prices)
3. Transportation suggestions
4. Estimated daily budget breakdown
5. Must-visit attractions and hidden gems
6. Local food recommendations
7. Practical tips and cultural considerations
8. Best time to visit each attraction

Format the response in a clear, structured way with proper headings and bullet points."""

        # Call OpenRouter
        itinerary_text = call_openrouter(prompt, max_tokens=2000)
        
        return jsonify({
            'success': True,
            'itinerary': itinerary_text,
            'destination': destination,
            'days': days,
            'budget': budget
        })
        
    except Exception as e:
        print(f"Error generating itinerary: {str(e)}")
        return jsonify({
            'error': 'Failed to generate itinerary',
            'details': str(e)
        }), 500

@app.route('/api/ask-question', methods=['POST'])
def ask_question():
    """
    Ask a specific question about the destination using OpenRouter API
    """
    try:
        data = request.json
        question = data.get('question', '')
        destination = data.get('destination', '')
        
        if not question:
            return jsonify({'error': 'Question is required'}), 400
        
        # Build the prompt
        prompt = f"""Answer this travel-related question about {destination if destination else 'travel'}:

Question: {question}

Provide a detailed, helpful answer based on current information."""

        # Call OpenRouter
        answer_text = call_openrouter(prompt, max_tokens=1000)
        
        return jsonify({
            'success': True,
            'answer': answer_text
        })
        
    except Exception as e:
        print(f"Error answering question: {str(e)}")
        return jsonify({
            'error': 'Failed to answer question',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
