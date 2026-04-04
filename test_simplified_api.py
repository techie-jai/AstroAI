#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""Test simplified API"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

print("=" * 80)
print("TEST: Testing Simplified AstroChartAPI")
print("=" * 80)

try:
    from astro_chart_api_simplified import AstroChartAPISimplified
    
    api = AstroChartAPISimplified()
    print("[OK] AstroChartAPISimplified imported successfully")
    
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
    
    # Try to generate D1 chart
    d1_chart = api.get_chart('D1')
    print(f"[OK] D1 chart generated with {len(d1_chart['planets'])} planets")
    print(f"     Ascendant: {d1_chart['ascendant']['house_name']}")
    
    # Try to generate kundli
    kundli = api.get_kundli()
    print(f"[OK] Kundli generated with {len(kundli['horoscope_info'])} items")
    
    # Try to generate multiple charts
    charts = api.get_multiple_charts(['D1', 'D9', 'D10'])
    print(f"[OK] Generated {len(charts)} charts: {list(charts.keys())}")
    
except Exception as e:
    print(f"[ERROR] {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
