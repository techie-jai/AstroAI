#!/usr/bin/env python
"""
Simulate the complete frontend-to-backend flow for kundli generation
This tests: Login → Get Token → Generate Kundli
"""

import requests
import json
import time

print("=" * 80)
print("COMPLETE FLOW TEST: Frontend → Backend → Kundli Generation")
print("=" * 80)

# Note: In a real scenario, the token comes from Firebase after Google login
# For testing, we'll use a test token and see what error we get

test_token = "test-firebase-token-12345"

birth_data = {
    'name': 'Test User',
    'place_name': 'New Delhi, India',
    'latitude': 28.6139,
    'longitude': 77.2090,
    'timezone_offset': 5.5,
    'year': 1990,
    'month': 1,
    'day': 15,
    'hour': 12,
    'minute': 30
}

print("\n[STEP 1] Testing /health endpoint...")
try:
    response = requests.get('http://localhost:8000/health', timeout=5)
    if response.status_code == 200:
        print("✅ Backend is healthy")
        print(f"   Response: {response.json()}")
    else:
        print(f"❌ Health check failed: {response.status_code}")
except Exception as e:
    print(f"❌ Cannot reach backend: {e}")
    exit(1)

print("\n[STEP 2] Testing /api/kundli/generate WITHOUT token...")
try:
    response = requests.post(
        'http://localhost:8000/api/kundli/generate',
        json={
            'birth_data': birth_data,
            'include_charts': True,
            'chart_types': ['D1', 'D7', 'D9', 'D10']
        },
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 401:
        print("✅ Correctly rejected (no token)")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n[STEP 3] Testing /api/kundli/generate WITH invalid token...")
try:
    response = requests.post(
        'http://localhost:8000/api/kundli/generate',
        json={
            'birth_data': birth_data,
            'include_charts': True,
            'chart_types': ['D1', 'D7', 'D9', 'D10']
        },
        headers={
            'Authorization': f'Bearer {test_token}'
        },
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 401:
        print("✅ Correctly rejected (invalid token)")
        print("   This is expected - need real Firebase token from Google login")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 80)
print("FLOW TEST COMPLETE")
print("=" * 80)
print("""
NEXT STEPS:
1. Open http://localhost:3001 in your browser
2. Click "Login with Google"
3. Sign in with your Google account
4. Fill in the birth details form
5. Click "Generate Kundli"
6. Check the backend terminal for logs showing:
   - [AUTH] messages
   - [TOKEN VERIFIED] or [TOKEN VERIFICATION FAILED]
   - Kundli generation success/failure

The frontend will automatically:
- Get a real Firebase token from Google
- Send it in the Authorization header
- The backend will verify it and generate the kundli
""")
