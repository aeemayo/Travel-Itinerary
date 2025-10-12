"""
Simple test script to verify ROMA integration
"""
import os
from dotenv import load_dotenv

def test_environment():
    """Test if environment is set up correctly"""
    print("🔍 Testing environment setup...\n")
    
    # Load environment variables
    load_dotenv()
    
    # Check API key
    api_key = os.getenv('OPENAI_API_KEY')
    if api_key:
        print(f"✅ OPENAI_API_KEY is set (starts with: {api_key[:10]}...)")
    else:
        print("❌ OPENAI_API_KEY is not set")
        print("   Please add it to the .env file")
        return False
    
    # Check ROMA import
    try:
        from sentientresearchagent.framework_entry import SentientAgent
        print("✅ ROMA (sentientresearchagent) imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import ROMA: {e}")
        print("   Try: pip install git+https://github.com/sentient-agi/ROMA.git")
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

def test_roma_agent():
    """Test ROMA agent with a simple query"""
    print("\n🤖 Testing ROMA agent (this will make an API call)...\n")
    
    try:
        import asyncio
        from sentientresearchagent.framework_entry import SentientAgent
        
        # Create agent
        agent = SentientAgent.create()
        
        # Simple test query
        prompt = "List 3 popular tourist destinations in Europe in one sentence each."
        
        # Run agent
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(agent.run(prompt))
        loop.close()
        
        print("✅ ROMA agent test successful!")
        print(f"\nResult:\n{result}\n")
        return True
        
    except Exception as e:
        print(f"❌ ROMA agent test failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Travel Itinerary Builder - Backend Test")
    print("=" * 60)
    print()
    
    # Run environment tests
    env_ok = test_environment()
    
    if env_ok:
        response = input("\n⚠️  Run ROMA agent test? This will use your OpenAI API credits. (y/n): ")
        if response.lower() == 'y':
            test_roma_agent()
        else:
            print("\nSkipping ROMA agent test.")
    
    print("\n" + "=" * 60)
    print("If all tests passed, run: python app.py")
    print("=" * 60)
