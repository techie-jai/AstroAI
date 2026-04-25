#!/usr/bin/env python3
"""
Test what the CSV endpoint actually returns
"""

import requests
import json

print("Testing CSV endpoint...")
print("=" * 60)

try:
    response = requests.get("http://localhost:8000/api/cities/search?query=Mumbai", timeout=5)
    print(f"Status: {response.status_code}")
    print(f"\nRaw Response:")
    print(json.dumps(response.json(), indent=2))
    
    data = response.json()
    if data:
        print(f"\n\nFirst result structure:")
        first = data[0]
        print(f"Keys: {list(first.keys())}")
        print(f"\nValues:")
        for key, value in first.items():
            print(f"  {key}: {value}")
            
except Exception as e:
    print(f"Error: {e}")
