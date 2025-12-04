from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv
import logging
import requests
import json
import urllib3
import random
import string
from werkzeug.utils import secure_filename

# Disable SSL warnings (optional, for development only)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Flask-Mail configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)

# Upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory storage for OTP codes (in production, use Redis or database)
otp_storage = {}

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

@app.route('/api/auth/send-code', methods=['POST'])
def send_code():
    """
    Generate and send OTP code to user's email
    """
    try:
        data = request.json
        email = data.get('email', '').strip()
        name = data.get('name', '').strip()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Generate 6-digit code
        code = ''.join(random.choices(string.digits, k=6))
        
        # Store code (expires after 10 minutes in production)
        otp_storage[email] = code
        
        # Send email
        try:
            msg = Message(
                subject='Your Travel Itinerary Login Code',
                recipients=[email],
                body=f'''Hello {name or 'there'},

Your login code is: {code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Travel Itinerary Team'''
            )
            mail.send(msg)
            
            return jsonify({
                'success': True,
                'message': f'Verification code sent to {email}'
            })
        except Exception as email_error:
            print(f"Email sending error: {str(email_error)}")
            # For development: return the code in response
            return jsonify({
                'success': True,
                'message': f'Email service unavailable. Your code is: {code}',
                'dev_code': code  # Remove this in production
            })
            
    except Exception as e:
        print(f"Error sending code: {str(e)}")
        return jsonify({
            'error': 'Failed to send verification code',
            'details': str(e)
        }), 500

@app.route('/api/auth/verify-code', methods=['POST'])
def verify_code():
    """
    Verify OTP code
    """
    try:
        data = request.json
        email = data.get('email', '').strip()
        code = data.get('code', '').strip()
        
        if not email or not code:
            return jsonify({'error': 'Email and code are required'}), 400
        
        # Check if code matches
        stored_code = otp_storage.get(email)
        if not stored_code:
            return jsonify({'error': 'No code found for this email'}), 400
        
        if stored_code != code:
            return jsonify({'error': 'Invalid code'}), 401
        
        # Code is valid, remove it
        del otp_storage[email]
        
        return jsonify({
            'success': True,
            'message': 'Code verified successfully'
        })
        
    except Exception as e:
        print(f"Error verifying code: {str(e)}")
        return jsonify({
            'error': 'Failed to verify code',
            'details': str(e)
        }), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/user/upload-avatar', methods=['POST'])
def upload_avatar():
    """
    Upload user avatar image
    """
    try:
        if 'avatar' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['avatar']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and GIF allowed'}), 400
        
        # Check file size (2MB limit)
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > 2 * 1024 * 1024:
            return jsonify({'error': 'File too large. Maximum size is 2MB'}), 400
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{random.randint(1000000, 9999999)}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        file.save(filepath)
        
        # Return URL
        avatar_url = f"http://localhost:5000/static/uploads/{unique_filename}"
        
        return jsonify({
            'success': True,
            'avatar_url': avatar_url
        })
        
    except Exception as e:
        print(f"Error uploading avatar: {str(e)}")
        return jsonify({
            'error': 'Failed to upload avatar',
            'details': str(e)
        }), 500

@app.route('/static/uploads/<filename>', methods=['GET'])
def serve_upload(filename):
    """
    Serve uploaded files
    """
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/user/update-profile', methods=['POST'])
def update_profile():
    """
    Update user profile information
    """
    try:
        data = request.json
        email = data.get('email', '').strip()
        name = data.get('name', '').strip()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # In a real app, you would update a database here
        # For now, just return success
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'profile': {
                'email': email,
                'name': name
            }
        })
        
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        return jsonify({
            'error': 'Failed to update profile',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
