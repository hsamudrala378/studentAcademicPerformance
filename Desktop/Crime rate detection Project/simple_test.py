"""
Simple Python script to test the backend API
Run this while the backend server is running
"""
import requests
import json

def test_endpoints():
    base_url = "http://127.0.0.1:5000"
    
    endpoints = [
        ("/", "GET"),
        ("/health", "GET"),
        ("/routes", "GET"),
        ("/predict", "POST", {
            "city": "Test",
            "area_type": "urban",
            "population_density": 5000,
            "time_of_day": "day",
            "month": 6,
            "day_of_week": 1
        })
    ]
    
    for endpoint_info in endpoints:
        endpoint = endpoint_info[0]
        method = endpoint_info[1]
        
        print(f"\n{'='*60}")
        print(f"Testing: {method} {endpoint}")
        print(f"{'='*60}")
        
        try:
            if method == "GET":
                response = requests.get(f"{base_url}{endpoint}", timeout=5)
            else:
                data = endpoint_info[2] if len(endpoint_info) > 2 else {}
                response = requests.post(
                    f"{base_url}{endpoint}",
                    json=data,
                    headers={'Content-Type': 'application/json'},
                    timeout=5
                )
            
            print(f"Status Code: {response.status_code}")
            print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
            print(f"Response Text (first 500 chars):")
            print(response.text[:500])
            
            # Try to parse as JSON
            try:
                json_data = response.json()
                print(f"\nParsed JSON:")
                print(json.dumps(json_data, indent=2))
            except:
                print("\n(Not valid JSON)")
                
        except requests.exceptions.ConnectionError:
            print("ERROR: Could not connect to server. Is it running?")
        except Exception as e:
            print(f"ERROR: {type(e).__name__}: {e}")

if __name__ == "__main__":
    print("Testing Backend API")
    print("Make sure the backend server is running on http://127.0.0.1:5000")
    print()
    test_endpoints()

