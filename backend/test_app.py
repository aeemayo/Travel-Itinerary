#!/usr/bin/env python3

from app import app

def test_health():
    with app.test_client() as client:
        response = client.get('/health')
        print(f"Health endpoint - Status: {response.status_code}")
        print(f"Response: {response.get_json()}")
        return response.status_code == 200

def test_generate_itinerary():
    with app.test_client() as client:
        data = {
            'destination': 'Paris',
            'days': 3,
            'budget': 'moderate',
            'interests': ['food', 'culture']
        }
        response = client.post('/api/generate-itinerary', json=data)
        print(f"Generate itinerary - Status: {response.status_code}")
        if response.status_code == 200:
            result = response.get_json()
            print("Success! Itinerary generated.")
            print(f"Destination: {result.get('destination')}")
            print(f"Days: {result.get('days')}")
        else:
            print(f"Error: {response.get_json()}")
        return response.status_code == 200

if __name__ == "__main__":
    print("Testing Flask app endpoints...")
    print()

    print("1. Testing health endpoint:")
    health_ok = test_health()
    print()

    print("2. Testing generate itinerary endpoint:")
    itinerary_ok = test_generate_itinerary()
    print()

    if health_ok and itinerary_ok:
        print("✅ All tests passed! The backend is working correctly.")
    else:
        print("❌ Some tests failed.")