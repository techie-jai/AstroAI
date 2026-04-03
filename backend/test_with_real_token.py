#!/usr/bin/env python
"""
Test kundli generation with a real Firebase token simulation
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

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

print("Testing kundli generation endpoint...")
print("\n[TEST 1] Without token (should be 401):")
response = client.post(
    '/api/kundli/generate',
    json={
        'birth_data': birth_data,
        'include_charts': True,
        'chart_types': ['D1']
    }
)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

print("\n[TEST 2] With invalid token (should be 401):")
response = client.post(
    '/api/kundli/generate',
    json={
        'birth_data': birth_data,
        'include_charts': True,
        'chart_types': ['D1']
    },
    headers={'Authorization': 'Bearer invalid-token'}
)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

print("\nNote: Real test requires valid Firebase token from Google login")
