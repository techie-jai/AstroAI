#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test Jyotishganit Chart API
"""

from datetime import datetime
from jyotishganit_chart_api import JyotishganitChartAPI
import json

def test_api():
    """Test the Jyotishganit Chart API"""
    
    print("Testing Jyotishganit Chart API")
    print("=" * 50)
    
    # Initialize API
    api = JyotishganitChartAPI()
    
    # Set birth data
    api.set_birth_data(
        name="Arushi",
        place_name="Delhi, India",
        latitude=28.6139,
        longitude=77.209,
        timezone_offset=5.5,
        year=1999,
        month=7,
        day=7,
        hour=15,
        minute=35,
        second=0
    )
    
    print("Birth data set successfully!")
    
    # Test D1 chart
    print("\nGenerating D1 chart...")
    d1_chart = api.get_chart('D1')
    
    if 'error' in d1_chart:
        print(f"Error: {d1_chart['error']}")
    else:
        print("D1 chart generated successfully!")
        print(f"Chart type: {d1_chart['chart_type']}")
        print(f"Number of planets: {len(d1_chart['planets'])}")
        print(f"Ascendant: {d1_chart['ascendant']['house_name']}")
        
        # Show planets
        print("\nPlanets:")
        for planet in d1_chart['planets']:
            print(f"  {planet['name']:8} | House {planet['house']:2} | {planet['house_name']:10} | {planet['longitude']:6.2f}°")
    
    # Test kundli
    print("\nGenerating complete kundli...")
    kundli = api.get_kundli()
    
    if 'error' in kundli:
        print(f"Error: {kundli['error']}")
    else:
        print("Kundli generated successfully!")
        print(f"Engine: {kundli['metadata']['engine']}")
        print(f"Ephemeris: {kundli['metadata']['ephemeris']}")
        print(f"JSON size: {len(json.dumps(kundli))} characters")
        
        # Test chart text formatting
        print("\nChart text:")
        print("-" * 30)
        chart_text = api.format_chart_text(d1_chart)
        print(chart_text)
    
    print("\nAPI test completed!")

if __name__ == "__main__":
    test_api()
