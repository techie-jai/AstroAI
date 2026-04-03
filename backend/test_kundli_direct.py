#!/usr/bin/env python
"""
Direct test of kundli generation without API
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

print("=" * 80)
print("DIRECT KUNDLI GENERATION TEST")
print("=" * 80)

# Test data
birth_data = {
    'name': 'Test User',
    'place_name': 'New Delhi',
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

print(f"\n[TEST] Birth data: {birth_data}")

try:
    from astrology_service import AstrologyService
    
    print("\n[STEP 1] Initializing AstrologyService...")
    service = AstrologyService()
    print("✅ AstrologyService initialized")
    
    print("\n[STEP 2] Generating kundli...")
    result = service.generate_kundli(birth_data)
    
    if result.get('success'):
        print("✅ Kundli generated successfully!")
        print(f"   - Kundli ID: {result.get('kundli_id')}")
        print(f"   - Generated at: {result.get('generated_at')}")
        horoscope_info = result.get('data', {}).get('horoscope_info', {})
        print(f"   - Horoscope info keys: {len(horoscope_info)}")
        print(f"   - Sample keys: {list(horoscope_info.keys())[:5]}")
    else:
        print(f"❌ Kundli generation failed: {result.get('error')}")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 80)
print("✅ KUNDLI GENERATION WORKS!")
print("=" * 80)
