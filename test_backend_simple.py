#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""Simple test without unicode characters"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

print("=" * 80)
print("TEST 1: Testing AstroChartAPI directly")
print("=" * 80)

try:
    from astro_chart_api import AstroChartAPI
    
    api = AstroChartAPI()
    print("[OK] AstroChartAPI imported successfully")
    
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
    print("[OK] Birth data set successfully")
    
    # Try to generate kundli
    kundli = api.get_kundli()
    print(f"[OK] Kundli generated with {len(kundli['horoscope_info'])} items")
    
except Exception as e:
    print(f"[ERROR] {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
