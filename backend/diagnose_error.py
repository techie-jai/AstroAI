#!/usr/bin/env python
"""
Diagnose the exact error when generating kundli
Tests each step of the process to identify where it fails
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

print("=" * 80)
print("KUNDLI GENERATION ERROR DIAGNOSIS")
print("=" * 80)

# Test data
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
    'minute': 30,
    'second': 0
}

print("\n[STEP 1] Test AstroChartAPI directly...")
try:
    from astro_chart_api import AstroChartAPI
    api = AstroChartAPI()
    api.set_birth_data(**birth_data)
    kundli = api.get_kundli()
    print(f"✅ AstroChartAPI works: {len(kundli.get('horoscope_info', {}))} data points")
except Exception as e:
    print(f"❌ AstroChartAPI failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n[STEP 2] Test AstrologyService directly...")
try:
    from astrology_service import AstrologyService
    service = AstrologyService()
    result = service.generate_kundli(birth_data)
    if result.get('success'):
        print(f"✅ AstrologyService works: {result.get('kundli_id')}")
    else:
        print(f"❌ AstrologyService returned error: {result.get('error')}")
except Exception as e:
    print(f"❌ AstrologyService failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n[STEP 3] Test models validation...")
try:
    from models import BirthData, GenerateKundliRequest
    
    # Test BirthData validation
    bd = BirthData(**birth_data)
    print(f"✅ BirthData validation passed")
    
    # Test GenerateKundliRequest validation
    req = GenerateKundliRequest(birth_data=bd)
    print(f"✅ GenerateKundliRequest validation passed")
except Exception as e:
    print(f"❌ Model validation failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n[STEP 4] Test Firebase token verification...")
try:
    from firebase_config import FirebaseService
    
    # Try with invalid token
    result = FirebaseService.verify_token("invalid-token")
    if result is None:
        print(f"✅ Token verification correctly rejects invalid token")
    else:
        print(f"⚠️ Token verification returned: {result}")
except Exception as e:
    print(f"❌ Token verification failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n[STEP 5] Test endpoint response format...")
try:
    from main import app
    from fastapi.testclient import TestClient
    
    client = TestClient(app)
    
    # Test without token
    response = client.post(
        '/api/kundli/generate',
        json={
            'birth_data': birth_data,
            'include_charts': True,
            'chart_types': ['D1']
        }
    )
    print(f"Status without token: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 401:
        print(f"✅ Correctly returns 401 without token")
except Exception as e:
    print(f"❌ Endpoint test failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("DIAGNOSIS COMPLETE")
print("=" * 80)
print("""
KEY FINDINGS:
1. If AstroChartAPI works but AstrologyService fails → Issue in service layer
2. If AstrologyService works but endpoint fails → Issue in FastAPI/auth
3. If all work but frontend fails → Issue in CORS, token, or API client
4. If token verification fails → Firebase credentials issue

NEXT STEPS:
1. Check which step failed above
2. If all steps pass, the issue is in the frontend-backend communication
3. Check browser console (F12) for actual error message
4. Check backend logs for [AUTH] and [ERROR] messages
""")
