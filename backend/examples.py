"""
Simple OpenRouter Usage Examples
This file shows how to use OpenRouter API independently of the Flask app
"""

import os
from dotenv import load_dotenv
import requests
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables
load_dotenv()

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

def call_openrouter(prompt: str, max_tokens: int = 1000) -> str:
    """Helper function to call OpenRouter API"""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Travel Itinerary Builder",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful travel assistant with expertise in travel planning."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    response = requests.post(
        f"{OPENROUTER_BASE_URL}/chat/completions",
        headers=headers,
        json=data,
        timeout=30,
        verify=False  # Disable SSL verification
    )
    response.raise_for_status()
    
    result = response.json()
    return result['choices'][0]['message']['content']


def example_1_simple_query():
    """Example 1: Simple query"""
    
    print("\n" + "="*60)
    print("Example 1: Simple Query")
    print("="*60)
    
    prompt = "List the top 3 tourist attractions in Rome, Italy with a brief description of each."
    
    print(f"\nPrompt: {prompt}")
    print("\nOpenRouter is thinking...\n")
    
    result = call_openrouter(prompt, max_tokens=500)
    
    print("Result:")
    print(result)


def example_2_travel_itinerary():
    """Example 2: Create a travel itinerary"""
    
    print("\n" + "="*60)
    print("Example 2: Travel Itinerary")
    print("="*60)
    
    prompt = """Create a 3-day travel itinerary for Barcelona, Spain.

Budget: Moderate
Interests: Architecture, Food, Culture
Additional: Interested in Gaudi's work

Include:
- Day-by-day activities
- Restaurant recommendations
- Transportation tips
- Estimated costs"""
    
    print(f"\nPrompt: {prompt}")
    print("\nOpenRouter is creating your itinerary...\n")
    
    result = call_openrouter(prompt, max_tokens=1500)
    
    print("Result:")
    print(result)


def example_3_research_question():
    """Example 3: Answer a specific travel question"""
    
    print("\n" + "="*60)
    print("Example 3: Research Question")
    print("="*60)
    
    prompt = """What are the best months to visit Japan for cherry blossoms?
Include specific regions and approximate blooming times."""
    
    print(f"\nPrompt: {prompt}")
    print("\nOpenRouter is researching...\n")
    
    result = call_openrouter(prompt, max_tokens=1000)
    
    print("Result:")
    print(result)


def example_4_complex_planning():
    """Example 4: Complex multi-city planning"""
    
    print("\n" + "="*60)
    print("Example 4: Complex Planning")
    print("="*60)
    
    prompt = """Plan a 2-week European trip covering Paris, Amsterdam, and Berlin.

Requirements:
- Start in Paris (4 days)
- Amsterdam (4 days)
- Berlin (6 days)
- Budget: $3000 USD total
- Interests: History, Art, Nightlife

Include:
1. Transportation between cities (with costs)
2. Accommodation suggestions for each city
3. Must-see attractions
4. Daily budget breakdown
5. Travel tips for each city"""
    
    print(f"\nPrompt: {prompt}")
    print("\nOpenRouter is planning your multi-city trip...\n")
    
    result = call_openrouter(prompt, max_tokens=2000)
    
    print("Result:")
    print(result)


def main():
    """Run all examples"""
    print("\n" + "="*60)
    print("OpenRouter Travel Agent Examples")
    print("="*60)
    print("\nThese examples demonstrate how OpenRouter handles different")
    print("types of travel-related queries.")
    print("\nNote: Each query will use your OpenRouter API credits.")
    print("="*60)
    
    # Check API key
    if not os.getenv('OPENROUTER_API_KEY'):
        print("\n❌ ERROR: OPENROUTER_API_KEY not found!")
        print("Please add it to your .env file")
        return
    
    print("\n✅ API key found")
    
    # Menu
    print("\nSelect an example to run:")
    print("1. Simple query (top attractions)")
    print("2. Create travel itinerary (Barcelona)")
    print("3. Research question (cherry blossoms)")
    print("4. Complex planning (multi-city Europe)")
    print("5. Run all examples")
    print("0. Exit")
    
    choice = input("\nEnter your choice (0-5): ").strip()
    
    # Map choices to functions
    examples = {
        '1': example_1_simple_query,
        '2': example_2_travel_itinerary,
        '3': example_3_research_question,
        '4': example_4_complex_planning,
    }
    
    if choice == '0':
        print("\nGoodbye!")
        return
    elif choice == '5':
        print("\n⚠️  Running all examples will use more API credits.")
        confirm = input("Continue? (y/n): ").strip().lower()
        if confirm != 'y':
            print("\nCancelled.")
            return
        # Run all examples
        for func in examples.values():
            func()
            input("\nPress Enter to continue to next example...")
    elif choice in examples:
        examples[choice]()
    else:
        print("\n❌ Invalid choice")
        return
    
    print("\n" + "="*60)
    print("Done! Check out the results above.")
    print("="*60)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure:")
        print("1. You're in the virtual environment")
        print("2. ROMA is installed: pip install git+https://github.com/sentient-agi/ROMA.git")
        print("3. Your API key is set in .env")
