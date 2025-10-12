from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
from sentientresearchagent.framework_entry import SimpleSentientAgent

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Suppress the logging level warning by checking if PLAN level already exists
# This prevents the error when creating multiple agent instances
if not hasattr(logging, 'PLAN'):
    try:
        logging.addLevelName(25, 'PLAN')
        logging.PLAN = 25
    except Exception:
        pass  # Level already exists, ignore

# Initialize a single agent instance to reuse across requests
_agent_instance = None

def get_agent():
    """Get or create the ROMA agent instance"""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = SimpleSentientAgent.create()
    return _agent_instance

# Verify API key is set
if not os.getenv('OPENAI_API_KEY'):
    print("WARNING: OPENAI_API_KEY not set. Please add it to .env file")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Travel Itinerary Builder API is running'
    })

@app.route('/api/generate-itinerary', methods=['POST'])
def generate_itinerary():
    """
    Generate a travel itinerary using ROMA agent
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
        
        # Build the prompt for ROMA
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

        # Use ROMA to generate the itinerary
        agent = get_agent()
        result = agent.execute(prompt)
        
        # Extract the itinerary text from the result
        if isinstance(result, dict):
            itinerary_text = result.get('final_output') or result.get('status', 'Failed to generate itinerary')
        else:
            itinerary_text = str(result)
        
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
    Ask a specific question about the destination using ROMA
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

        # Use ROMA to answer the question
        agent = get_agent()
        result = agent.execute(prompt)
        
        # Extract the answer text from the result
        if isinstance(result, dict):
            answer_text = result.get('final_output') or result.get('status', 'Failed to answer question')
        else:
            answer_text = str(result)
        
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
