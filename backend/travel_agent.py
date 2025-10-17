"""
Travel Itinerary Agent using Sentient Agent Framework and OpenRouter API
"""
import os
import logging
from dotenv import load_dotenv
import requests
import urllib3
from sentient_agent_framework import AbstractAgent, DefaultServer, ResponseHandler, Query, Session
from typing import AsyncIterator

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"


class TravelItineraryAgent(AbstractAgent):
    """
    A sentient agent that generates travel itineraries using OpenRouter API
    """

    def __init__(self, name: str = "Travel Itinerary Agent"):
        super().__init__(name)
        logger.info(f"✅ {name} initialized with OpenRouter API")

    def call_openrouter(self, prompt: str, max_tokens: int = 2000) -> str:
        """Call OpenRouter API"""
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
                    "content": "You are an expert travel assistant with deep knowledge of destinations worldwide."
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

    async def assist(
        self,
        query: Query,
        session: Session,
        response_handler: ResponseHandler
    ) -> None:
        """
        Process user query and generate travel itinerary recommendations
        """
        try:
            # Extract the prompt from the query
            user_prompt = query.prompt
            logger.info(f"Processing query: {user_prompt[:100]}...")

            # Build a structured prompt for the agent
            system_context = """You are an expert travel assistant with deep knowledge of destinations worldwide.
You help travelers plan perfect trips by providing detailed, practical itineraries.
Consider budgets, interests, cultural aspects, and practical logistics.
Always format responses clearly with day-by-day breakdowns, costs, and recommendations."""

            full_prompt = f"""{system_context}

User Request: {user_prompt}

Please provide a comprehensive travel plan with:
1. Detailed day-by-day itinerary
2. Accommodation recommendations with estimated costs
3. Transportation options and tips
4. Restaurant and local food recommendations
5. Must-see attractions and hidden gems
6. Practical travel tips and cultural considerations
7. Budget breakdown
8. Best time to visit

Format your response clearly with headers and bullet points."""

            # Generate content using OpenRouter
            logger.info("Generating content with OpenRouter...")
            result_text = self.call_openrouter(full_prompt, max_tokens=2000)
            logger.info("✅ Content generated successfully")

            # Stream the response back to the client
            await response_handler.complete_with_text(result_text)

        except Exception as e:
            logger.error(f"❌ Error in agent: {str(e)}")
            error_message = f"Error generating itinerary: {str(e)}"
            await response_handler.complete_with_text(error_message)


async def create_and_run_agent():
    """
    Create and run the travel itinerary agent with DefaultServer
    """
    try:
        # Create agent instance
        agent = TravelItineraryAgent(name="Travel Itinerary Agent")

        # Create server
        server = DefaultServer(agent)

        # Run the server
        logger.info("🚀 Starting Travel Itinerary Agent Server...")
        server.run()

    except Exception as e:
        logger.error(f"❌ Failed to start agent: {e}")
        raise


if __name__ == "__main__":
    import asyncio

    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    # Check for API key
    if not os.getenv('OPENROUTER_API_KEY'):
        print("❌ ERROR: OPENROUTER_API_KEY not found in .env file")
        print("Please add your OpenRouter API key to the .env file")
        exit(1)

    # Run the agent
    asyncio.run(create_and_run_agent())
