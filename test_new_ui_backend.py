#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Quick test to verify the backend works for the new UI
"""

import sys
import os

# Add paths
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'PyJHora'))

# Set ephemeris path
import swisseph as swe
ephe_path = os.path.join(os.path.dirname(__file__), 'PyJHora', 'jhora', 'data', 'ephe')
ephe_path = os.path.abspath(ephe_path)
print(f"Setting ephemeris path to: {ephe_path}")
swe.set_ephe_path(ephe_path)

# Now import and test
from astro_chart_api import AstroChartAPI

print("\n" + "="*60)
print("Testing AstroChartAPI with ephemeris path fix")
print("="*60)

try:
    api = AstroChartAPI()
    print("✓ API initialized successfully")
    
    # Set birth data
    api.set_birth_data(
        name="Test User",
        place_name="Chennai,IN",
        latitude=13.0827,
        longitude=80.2707,
        timezone_offset=5.5,
        year=1994,
        month=12,
        day=28,
        hour=18,
        minute=50
    )
    print("✓ Birth data set successfully")
    
    # Generate D1 chart
    chart = api.get_chart('D1')
    print("✓ D1 chart generated successfully")
    print(f"  Chart: {chart['chart_name']}")
    print(f"  Ascendant: {chart['ascendant']['house_name']}")
    print(f"  Number of planets: {len(chart['planets'])}")
    
    # Generate D9 chart
    chart = api.get_chart('D9')
    print("✓ D9 chart generated successfully")
    print(f"  Chart: {chart['chart_name']}")
    
    print("\n" + "="*60)
    print("SUCCESS! Backend is working correctly")
    print("="*60)
    
except Exception as e:
    print(f"\n✗ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
