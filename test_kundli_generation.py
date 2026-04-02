#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test script to verify kundli generation functionality
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Set up ephemeris path before importing anything else
import swisseph as swe
ephe_path = os.path.join(os.path.dirname(__file__), 'PyJHora', 'jhora', 'data', 'ephe')
ephe_path = os.path.abspath(ephe_path)
swe.set_ephe_path(ephe_path)

from astro_chart_api import AstroChartAPI

def test_kundli_generation():
    """Test kundli generation"""
    print("\n" + "=" * 100)
    print("TEST: Kundli Generation")
    print("=" * 100)
    
    try:
        # Create API instance
        api = AstroChartAPI()
        
        # Set birth data
        print("\nSetting birth data...")
        api.set_birth_data(
            name="Test Person",
            place_name="Chennai,IN",
            latitude=13.0827,
            longitude=80.2707,
            timezone_offset=5.5,
            year=1990,
            month=6,
            day=15,
            hour=10,
            minute=30,
            second=0
        )
        print("✓ Birth data set successfully")
        
        # Generate kundli
        print("\nGenerating complete kundli...")
        kundli_data = api.get_kundli()
        print("✓ Kundli generated successfully")
        
        # Check kundli data structure
        print("\nKundli Data Structure:")
        print(f"  - horoscope_info keys: {len(kundli_data['horoscope_info'])} items")
        print(f"  - horoscope_charts: {len(kundli_data['horoscope_charts'])} charts")
        print(f"  - vimsottari_info: {type(kundli_data['vimsottari_info'])}")
        print(f"  - birth_data: {kundli_data['birth_data']}")
        
        # Format kundli text
        print("\nFormatting kundli text...")
        kundli_text = api.format_kundli_text()
        print("✓ Kundli text formatted successfully")
        
        # Show sample of kundli info
        print("\nSample Horoscope Information (first 10 items):")
        for i, (key, value) in enumerate(list(kundli_data['horoscope_info'].items())[:10]):
            print(f"  {key}: {value}")
        
        print("\n" + "=" * 100)
        print("✓ KUNDLI GENERATION TEST PASSED")
        print("=" * 100)
        
        return True
        
    except Exception as e:
        print(f"\n✗ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_chart_generation():
    """Test that chart generation still works"""
    print("\n" + "=" * 100)
    print("TEST: Chart Generation (D1 and D9)")
    print("=" * 100)
    
    try:
        api = AstroChartAPI()
        
        api.set_birth_data(
            name="Test Person",
            place_name="Chennai,IN",
            latitude=13.0827,
            longitude=80.2707,
            timezone_offset=5.5,
            year=1990,
            month=6,
            day=15,
            hour=10,
            minute=30,
            second=0
        )
        
        # Test D1
        print("\nGenerating D1 chart...")
        d1_chart = api.get_chart('D1')
        print(f"✓ D1 Chart: {d1_chart['chart_name']}")
        print(f"  Ascendant: {d1_chart['ascendant']['house_name']}")
        print(f"  Planets: {len(d1_chart['planets'])} items")
        
        # Test D9
        print("\nGenerating D9 chart...")
        d9_chart = api.get_chart('D9')
        print(f"✓ D9 Chart: {d9_chart['chart_name']}")
        print(f"  Ascendant: {d9_chart['ascendant']['house_name']}")
        print(f"  Planets: {len(d9_chart['planets'])} items")
        
        print("\n" + "=" * 100)
        print("✓ CHART GENERATION TEST PASSED")
        print("=" * 100)
        
        return True
        
    except Exception as e:
        print(f"\n✗ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("\n" + "=" * 100)
    print("KUNDLI GENERATION TEST SUITE")
    print("=" * 100)
    
    results = []
    
    # Run tests
    results.append(("Kundli Generation", test_kundli_generation()))
    results.append(("Chart Generation", test_chart_generation()))
    
    # Summary
    print("\n" + "=" * 100)
    print("TEST SUMMARY")
    print("=" * 100)
    for test_name, passed in results:
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    all_passed = all(result[1] for result in results)
    print("\n" + ("=" * 100))
    if all_passed:
        print("✓ ALL TESTS PASSED")
    else:
        print("✗ SOME TESTS FAILED")
    print("=" * 100)
    
    sys.exit(0 if all_passed else 1)
