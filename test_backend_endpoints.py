#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""Test backend endpoints with mock data"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from backend.astrology_service import AstrologyService

print("=" * 80)
print("TEST: Backend Astrology Service")
print("=" * 80)

service = AstrologyService()

# Mock birth data
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

print("\n1. Testing generate_kundli()")
print("-" * 80)
try:
    result = service.generate_kundli(birth_data)
    if result.get('success'):
        print(f"[OK] Kundli generated successfully")
        print(f"     Kundli ID: {result.get('kundli_id')}")
        print(f"     Data keys: {len(result.get('data', {}).get('horoscope_info', {}))}")
    else:
        print(f"[ERROR] {result.get('error')}")
except Exception as e:
    print(f"[ERROR] {str(e)}")

print("\n2. Testing generate_charts()")
print("-" * 80)
try:
    result = service.generate_charts(birth_data, ['D1', 'D9', 'D10'])
    if result.get('success'):
        print(f"[OK] Charts generated successfully")
        print(f"     Charts: {list(result.get('charts', {}).keys())}")
    else:
        print(f"[ERROR] {result.get('error')}")
except Exception as e:
    print(f"[ERROR] {str(e)}")

print("\n3. Testing format_kundli_text()")
print("-" * 80)
try:
    result = service.format_kundli_text(birth_data)
    if result.get('success'):
        print(f"[OK] Kundli text formatted successfully")
        print(f"     Text length: {len(result.get('text', ''))}")
    else:
        print(f"[ERROR] {result.get('error')}")
except Exception as e:
    print(f"[ERROR] {str(e)}")

print("\n4. Testing format_chart_text()")
print("-" * 80)
try:
    result = service.format_chart_text(birth_data, 'D1')
    if result.get('success'):
        print(f"[OK] Chart text formatted successfully")
        print(f"     Chart type: {result.get('chart_type')}")
        print(f"     Text length: {len(result.get('text', ''))}")
    else:
        print(f"[ERROR] {result.get('error')}")
except Exception as e:
    print(f"[ERROR] {str(e)}")

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
