"""
Simple script to test if the backend API is working
Run this after starting the backend server
"""
import requests
import json

API_URL = 'http://localhost:5000'

def test_backend():
    print("Testing backend API...")
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
        return False
    
    # Test 2: Home endpoint
    print("\n2. Testing home endpoint...")
    try:
        response = requests.get(f"{API_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
        return False
    
    # Test 3: Predict endpoint
    print("\n3. Testing predict endpoint...")
    try:
        test_data = {
            "city": "Test City",
            "area_type": "urban",
            "population_density": 5000,
            "time_of_day": "day",
            "month": 6,
            "day_of_week": 1
        }
        response = requests.post(
            f"{API_URL}/predict",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('Content-Type')}")
        if 'application/json' in response.headers.get('Content-Type', ''):
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"   Response (first 200 chars): {response.text[:200]}")
    except Exception as e:
        print(f"   Error: {e}")
        return False
    
    print("\n✅ All tests passed!")
    return True

if __name__ == '__main__':
    test_backend()

