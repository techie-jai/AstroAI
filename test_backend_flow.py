#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""Test backend flow to identify the 'Failed to generate kundli' error"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

# Test 1: Test AstroChartAPI directly
print("=" * 80)
print("TEST 1: Testing AstroChartAPI directly")
print("=" * 80)

try:
    from astro_chart_api import AstroChartAPI
    
    api = AstroChartAPI()
    print("✓ AstroChartAPI imported successfully")
    
    # Set birth data
    api.set_birth_data(
        name="Test Person",
        place_name="Delhi,IN",
        latitude=28.6139,
        longitude=77.2090,
        timezone_offset=5.5,
        year=1990,
        month=6,
        day=15,
        hour=10,
        minute=30
    )
    print("✓ Birth data set successfully")
    
    # Try to generate kundli
    kundli = api.get_kundli()
    print(f"✓ Kundli generated with {len(kundli['horoscope_info'])} items")
    print(f"  Keys: {list(kundli.keys())}")
    
except Exception as e:
    print(f"✗ Error in AstroChartAPI: {str(e)}")
    import traceback
    traceback.print_exc()

# Test 2: Test AstrologyService
print("\n" + "=" * 80)
print("TEST 2: Testing AstrologyService")
print("=" * 80)

try:
    from backend.astrology_service import AstrologyService
    
    service = AstrologyService()
    print("✓ AstrologyService imported successfully")
    
    birth_data = {
        'name': 'Test Person',
        'place_name': 'Delhi,IN',
        'latitude': 28.6139,
        'longitude': 77.2090,
        'timezone_offset': 5.5,
        'year': 1990,
        'month': 6,
        'day': 15,
        'hour': 10,
        'minute': 30,
        'second': 0
    }
    
    result = service.generate_kundli(birth_data)
    print(f"✓ generate_kundli result: {result.get('success')}")
    if result.get('success'):
        print(f"  Kundli ID: {result.get('kundli_id')}")
        print(f"  Data keys: {list(result.get('data', {}).keys())}")
    else:
        print(f"  Error: {result.get('error')}")
    
except Exception as e:
    print(f"✗ Error in AstrologyService: {str(e)}")
    import traceback
    traceback.print_exc()

# Test 3: Test FastAPI endpoint
print("\n" + "=" * 80)
print("TEST 3: Testing FastAPI endpoint (simulated)")
print("=" * 80)

try:
    from backend.models import BirthData, GenerateKundliRequest
    
    birth_data_obj = BirthData(
        name='Test Person',
        place_name='Delhi,IN',
        latitude=28.6139,
        longitude=77.2090,
        timezone_offset=5.5,
        year=1990,
        month=6,
        day=15,
        hour=10,
        minute=30
    )
    print("✓ BirthData model created successfully")
    
    request = GenerateKundliRequest(birth_data=birth_data_obj)
    print("✓ GenerateKundliRequest created successfully")
    print(f"  Chart types: {request.chart_types}")
    
except Exception as e:
    print(f"✗ Error in models: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
