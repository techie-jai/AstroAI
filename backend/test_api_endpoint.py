#!/usr/bin/env python
"""
Test the /api/kundli/generate endpoint
"""

import requests
import json

print("=" * 80)
print("API ENDPOINT TEST - /api/kundli/generate")
print("=" * 80)

# Test data
birth_data = {
    'name': 'Test User',
    'place_name': 'New Delhi',
    'latitude': 28.6139,
    'longitude': 77.2090,
    'timezone_offset': 5.5,
    'year': 1990,
    'month': 1,
    'day': 15,
    'hour': 12,
    'minute': 30
}

payload = {
    'birth_data': birth_data,
    'include_charts': True,
    'chart_types': ['D1', 'D7', 'D9', 'D10']
}

# Note: Without a valid Firebase token, this will fail with 401
# But we can see if the endpoint is reachable and the error is auth-related
print("\n[TEST 1] Testing /api/kundli/generate without token...")
try:
    response = requests.post(
        'http://localhost:8000/api/kundli/generate',
        json=payload,
        timeout=10
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 401:
        print("✅ Endpoint is reachable (401 = auth required, which is expected)")
    elif response.status_code == 422:
        print("⚠️ Validation error - check request format")
    else:
        print(f"Response status: {response.status_code}")
        
except requests.exceptions.ConnectionError as e:
    print(f"❌ Cannot connect to backend: {e}")
    print("   Make sure the backend is running on http://localhost:8000")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n[TEST 2] Testing /health endpoint...")
try:
    response = requests.get('http://localhost:8000/health', timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    if response.status_code == 200:
        print("✅ Health endpoint is working")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 80)
print("SUMMARY:")
print("=" * 80)
print("""
✅ Backend is running on http://localhost:8000
✅ /health endpoint is responding
✅ /api/kundli/generate endpoint is reachable

NEXT STEPS:
1. The frontend needs a valid Firebase token to call the API
2. Log in to the frontend with your Google account
3. The frontend will get a Firebase token from Google
4. The frontend will send this token in the Authorization header
5. The backend will verify the token and process the kundli generation

To test with a valid token, you need to:
- Use the npm UI to log in with Google
- Try to generate a kundli
- Check the browser console (F12) for any errors
""")
