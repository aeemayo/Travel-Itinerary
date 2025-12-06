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

# User database file
USERS_DB_FILE = os.path.join(os.path.dirname(__file__), 'users_db.json')

def load_users_db():
    """Load users database from JSON file"""
    if not os.path.exists(USERS_DB_FILE):
        return {}
    try:
        with open(USERS_DB_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading users database: {e}")
        return {}

def save_users_db(users_db):
    """Save users database to JSON file"""
    try:
        with open(USERS_DB_FILE, 'w') as f:
            json.dump(users_db, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving users database: {e}")
        return False

def get_user_profile(email):
    """Get user profile from database"""
    users_db = load_users_db()
    return users_db.get(email, {'email': email, 'name': '', 'avatar': ''})

def update_user_profile(email, updates):
    """Update user profile in database"""
    users_db = load_users_db()
    if email not in users_db:
        users_db[email] = {'email': email, 'name': '', 'avatar': ''}
    users_db[email].update(updates)
    if save_users_db(users_db):
        return users_db[email]
    return None

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Unsplash API configuration for location images
UNSPLASH_ACCESS_KEY = os.getenv('UNSPLASH_ACCESS_KEY')
UNSPLASH_API_URL = "https://api.unsplash.com/search/photos"

# Verify API key is set
if not OPENROUTER_API_KEY:
    print("WARNING: OPENROUTER_API_KEY not set. Please add it to .env file")

if not UNSPLASH_ACCESS_KEY:
    print("WARNING: UNSPLASH_ACCESS_KEY not set. Image fetching will use fallback images.")

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

def fetch_location_image(location: str) -> str:
    """
    Fetch a relevant image for a location using Unsplash API (web scraping)
    Falls back to a placeholder if API key not set or request fails
    """
    # Fallback images for common destinations
    fallback_images = {
        'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
        'new york': 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?w=800&q=80',
        'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
        'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
        'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
        'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
        'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
        'lagos nigeria': 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=800&q=80',
        'lagos': 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=800&q=80',  # Default to Nigeria
    }
    
    location_lower = location.lower().strip()
    
    # Map of ambiguous city names to their most common context
    # This helps resolve cities that exist in multiple countries
    city_context_map = {
        'lagos': 'Lagos Nigeria Africa city skyline',
        'paris': 'Paris France Eiffel Tower',
        'london': 'London England UK Big Ben',
        'barcelona': 'Barcelona Spain Sagrada Familia',
        'rome': 'Rome Italy Colosseum',
        'sydney': 'Sydney Australia Opera House',
        'melbourne': 'Melbourne Australia city',
        'cairo': 'Cairo Egypt pyramids',
        'athens': 'Athens Greece Acropolis',
        'lima': 'Lima Peru South America',
        'santiago': 'Santiago Chile South America',
        'moscow': 'Moscow Russia Kremlin',
        'berlin': 'Berlin Germany Brandenburg Gate',
        'amsterdam': 'Amsterdam Netherlands canals',
        'vienna': 'Vienna Austria palace',
        'prague': 'Prague Czech Republic old town',
        'budapest': 'Budapest Hungary parliament',
        'istanbul': 'Istanbul Turkey mosque',
        'mumbai': 'Mumbai India Gateway',
        'delhi': 'Delhi India Lotus Temple',
        'bangalore': 'Bangalore India tech city',
        'shanghai': 'Shanghai China skyline',
        'beijing': 'Beijing China Forbidden City',
        'hong kong': 'Hong Kong China skyline harbor',
        'singapore': 'Singapore Marina Bay',
        'bangkok': 'Bangkok Thailand temple',
        'kuala lumpur': 'Kuala Lumpur Malaysia Petronas',
        'jakarta': 'Jakarta Indonesia city',
        'manila': 'Manila Philippines city',
        'cape town': 'Cape Town South Africa Table Mountain',
        'johannesburg': 'Johannesburg South Africa city',
        'nairobi': 'Nairobi Kenya Africa city',
        'accra': 'Accra Ghana Africa city',
        'abuja': 'Abuja Nigeria capital city',
    }
    
    # Check fallback first for exact matches with context
    for city, url in fallback_images.items():
        if city in location_lower or location_lower in city:
            # If no API key, use fallback directly
            if not UNSPLASH_ACCESS_KEY:
                return url
            break
    
    # Build a more specific search query
    search_query = location
    
    # Check if we have a specific context for this city
    for city_key, context in city_context_map.items():
        if city_key in location_lower:
            search_query = context
            print(f"🔍 Using specific search context for {location}: {search_query}")
            break
    else:
        # If no specific mapping, add generic travel terms
        # Check if location already has country/region info
        if ',' in location or len(location.split()) > 2:
            search_query = f"{location} city skyline travel"
        else:
            search_query = f"{location} city travel landmark destination"
    
    # Try Unsplash API if key is available
    if UNSPLASH_ACCESS_KEY:
        try:
            headers = {
                "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}",
                "Accept-Version": "v1"
            }
            params = {
                "query": search_query,
                "per_page": 3,  # Get a few results to pick from
                "orientation": "landscape",
                "content_filter": "high"  # Filter for high-quality content
            }
            
            response = requests.get(
                UNSPLASH_API_URL,
                headers=headers,
                params=params,
                timeout=10,
                verify=False
            )
            response.raise_for_status()
            
            data = response.json()
            if data.get('results') and len(data['results']) > 0:
                # Try to find the best matching image
                # Prefer images with relevant alt descriptions
                best_image = data['results'][0]
                location_words = set(location_lower.split())
                
                for result in data['results']:
                    description = (result.get('description') or '').lower()
                    alt_description = (result.get('alt_description') or '').lower()
                    # Check if any location words appear in description
                    if any(word in description or word in alt_description for word in location_words):
                        best_image = result
                        break
                
                image_url = best_image['urls'].get('regular', best_image['urls'].get('small'))
                print(f"✅ Fetched image for {location} (query: {search_query}): {image_url[:60]}...")
                return image_url
        except Exception as e:
            print(f"⚠️ Failed to fetch image from Unsplash: {str(e)}")
    
    # Return fallback image
    for city, url in fallback_images.items():
        if city in location_lower or location_lower in city:
            return url
    
    return fallback_images['default']

@app.route('/api/get-location-image', methods=['POST'])
def get_location_image():
    """
    Fetch image for a specific location
    """
    try:
        data = request.json
        location = data.get('location', '')
        
        if not location:
            return jsonify({'error': 'Location is required'}), 400
        
        image_url = fetch_location_image(location)
        
        return jsonify({
            'success': True,
            'imageUrl': image_url,
            'location': location
        })
        
    except Exception as e:
        print(f"Error fetching location image: {str(e)}")
        return jsonify({
            'error': 'Failed to fetch image',
            'details': str(e)
        }), 500

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
        
        # Fetch location image
        image_url = fetch_location_image(destination)
        
        return jsonify({
            'success': True,
            'itinerary': itinerary_text,
            'destination': destination,
            'days': days,
            'budget': budget,
            'imageUrl': image_url
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
        
        # Get or create user profile
        user_profile = get_user_profile(email)
        
        return jsonify({
            'success': True,
            'message': 'Code verified successfully',
            'user': user_profile
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
        
        # Get email from request (should be sent with the file)
        email = request.form.get('email')
        if email:
            # Save avatar URL to user profile
            update_user_profile(email, {'avatar': avatar_url})
        
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
        
        # Update user profile in database
        avatar = data.get('avatar', '')
        updates = {'name': name}
        if avatar:
            updates['avatar'] = avatar
        
        updated_profile = update_user_profile(email, updates)
        
        if updated_profile:
            return jsonify({
                'success': True,
                'message': 'Profile updated successfully',
                'profile': updated_profile
            })
        else:
            return jsonify({
                'error': 'Failed to save profile',
                'details': 'Database write error'
            }), 500
        
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        return jsonify({
            'error': 'Failed to update profile',
            'details': str(e)
        }), 500

@app.route('/api/user/save-itinerary', methods=['POST'])
def save_itinerary():
    """
    Save a generated itinerary to user's profile
    """
    try:
        data = request.json
        email = data.get('email', '').strip()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        itinerary = {
            'id': data.get('id', str(random.randint(100000, 999999))),
            'destination': data.get('destination', ''),
            'days': data.get('days', 3),
            'budget': data.get('budget', 'moderate'),
            'content': data.get('content', ''),
            'imageUrl': data.get('imageUrl', ''),
            'interests': data.get('interests', []),
            'createdAt': data.get('createdAt', ''),
            'status': data.get('status', 'planned')
        }
        
        # Load current user data
        users_db = load_users_db()
        if email not in users_db:
            users_db[email] = {'email': email, 'name': '', 'avatar': '', 'itineraries': []}
        
        # Initialize itineraries array if not exists
        if 'itineraries' not in users_db[email]:
            users_db[email]['itineraries'] = []
        
        # Add new itinerary (prepend to keep most recent first)
        users_db[email]['itineraries'].insert(0, itinerary)
        
        # Keep only last 20 itineraries to prevent storage bloat
        users_db[email]['itineraries'] = users_db[email]['itineraries'][:20]
        
        if save_users_db(users_db):
            return jsonify({
                'success': True,
                'message': 'Itinerary saved successfully',
                'itinerary': itinerary
            })
        else:
            return jsonify({
                'error': 'Failed to save itinerary',
                'details': 'Database write error'
            }), 500
        
    except Exception as e:
        print(f"Error saving itinerary: {str(e)}")
        return jsonify({
            'error': 'Failed to save itinerary',
            'details': str(e)
        }), 500

@app.route('/api/user/itineraries', methods=['GET'])
def get_user_itineraries():
    """
    Get all saved itineraries for a user
    """
    try:
        email = request.args.get('email', '').strip()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        users_db = load_users_db()
        user_data = users_db.get(email, {})
        itineraries = user_data.get('itineraries', [])
        
        return jsonify({
            'success': True,
            'itineraries': itineraries
        })
        
    except Exception as e:
        print(f"Error fetching itineraries: {str(e)}")
        return jsonify({
            'error': 'Failed to fetch itineraries',
            'details': str(e)
        }), 500

@app.route('/api/user/delete-itinerary', methods=['POST'])
def delete_itinerary():
    """
    Delete a saved itinerary
    """
    try:
        data = request.json
        email = data.get('email', '').strip()
        itinerary_id = data.get('itineraryId', '')
        
        if not email or not itinerary_id:
            return jsonify({'error': 'Email and itinerary ID are required'}), 400
        
        users_db = load_users_db()
        if email in users_db and 'itineraries' in users_db[email]:
            users_db[email]['itineraries'] = [
                it for it in users_db[email]['itineraries'] 
                if it.get('id') != itinerary_id
            ]
            
            if save_users_db(users_db):
                return jsonify({
                    'success': True,
                    'message': 'Itinerary deleted successfully'
                })
        
        return jsonify({
            'error': 'Itinerary not found'
        }), 404
        
    except Exception as e:
        print(f"Error deleting itinerary: {str(e)}")
        return jsonify({
            'error': 'Failed to delete itinerary',
            'details': str(e)
        }), 500

# if __name__ == '__main__':
#     port = int(os.getenv('PORT', 5000))
#     # Use 127.0.0.1 for local development (no network prompts)
#     # Set FLASK_HOST=0.0.0.0 in production if you need external access
#     host = os.getenv('FLASK_HOST', '127.0.0.1')
#     app.run(debug=True, host=host, port=port)
