"""
Simple test script to verify OpenRouter integration
"""
import os
from dotenv import load_dotenv
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def test_environment():
    """Test if environment is set up correctly"""
    print("🔍 Testing environment setup...\n")
    
    # Load environment variables
    load_dotenv()
    
    # Check API key
    api_key = os.getenv('OPENROUTER_API_KEY')
    if api_key:
        print(f"✅ OPENROUTER_API_KEY is set (starts with: {api_key[:10]}...)")
    else:
        print("❌ OPENROUTER_API_KEY is not set")
        print("   Please add it to the .env file")
        return False
    
    # Check requests import
    try:
        import requests
        print("✅ Requests library imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import requests: {e}")
        print("   Try: pip install requests")
        return False
    
    # Check Flask
    try:
        import flask
        print(f"✅ Flask {flask.__version__} installed")
    except ImportError:
        print("❌ Flask not installed")
        return False
    
    print("\n✅ All checks passed! Your backend is ready to run.")
    return True

def test_openrouter_api():
    """Test OpenRouter with a simple query"""
    print("\n🤖 Testing OpenRouter (this will make an API call)...\n")
    
    try:
        import requests
        
        api_key = os.getenv('OPENROUTER_API_KEY')
        headers = {
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "Travel Itinerary Builder",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "List 3 popular tourist destinations in Europe in one sentence each."}
            ],
            "max_tokens": 200,
            "temperature": 0.7
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30,
            verify=False  # Disable SSL verification
        )
        
        response.raise_for_status()
        result = response.json()
        output = result['choices'][0]['message']['content']
        
        print("✅ OpenRouter test successful!")
        print(f"\nResult:\n{output}\n")
        return True
        
    except requests.exceptions.SSLError as e:
        print(f"❌ SSL Error: {e}")
        print("\nTrying to fix SSL issues...")
        print("Run: pip install --upgrade certifi")
        return False
    except Exception as e:
        print(f"❌ OpenRouter test failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Sentient Agent Framework - Backend Test")
    print("=" * 60)
    print()
    
    # Run environment tests
    env_ok = test_environment()
    
    if env_ok:
        response = input("\n⚠️  Run OpenRouter test? This will use your API credits. (y/n): ")
        if response.lower() == 'y':
            test_openrouter_api()
        else:
            print("\nSkipping OpenRouter test.")
    
    print("\n" + "=" * 60)
    print("If all tests passed, run: python app.py")
    print("=" * 60)
