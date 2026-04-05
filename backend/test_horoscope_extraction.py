#!/usr/bin/env python
"""
Test horoscope_info extraction from kundli JSON
"""

import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

# Load a sample kundli JSON file
kundli_file = r"e:\25. Codes\16. AstroAI V2\AstroAI\users\20260406_043437_8d4414d9-Jai\kundli\Jai_Kundli.json"

print("=" * 80)
print("HOROSCOPE INFO EXTRACTION TEST")
print("=" * 80)

try:
    with open(kundli_file, 'r') as f:
        kundli_data = json.load(f)
    
    print(f"\n[TEST] Loaded kundli data from: {kundli_file}")
    print(f"[TEST] Top-level keys: {list(kundli_data.keys())}")
    
    # Extract horoscope_info
    horoscope_info = {}
    
    if isinstance(kundli_data, dict):
        jyotishganit_json = kundli_data.get('jyotishganit_json', {})
        
        if isinstance(jyotishganit_json, dict):
            # Extract panchanga
            if 'panchanga' in jyotishganit_json:
                panchanga = jyotishganit_json['panchanga']
                horoscope_info['tithi'] = panchanga.get('tithi', '')
                horoscope_info['nakshatra'] = panchanga.get('nakshatra', '')
                horoscope_info['yoga'] = panchanga.get('yoga', '')
                horoscope_info['karana'] = panchanga.get('karana', '')
                horoscope_info['vaara'] = panchanga.get('vaara', '')
            
            # Extract ayanamsa
            if 'ayanamsa' in jyotishganit_json:
                ayanamsa = jyotishganit_json['ayanamsa']
                horoscope_info['ayanamsa_name'] = ayanamsa.get('name', '')
                horoscope_info['ayanamsa_value'] = ayanamsa.get('value', 0)
            
            # Extract D1 Chart data
            if 'd1Chart' in jyotishganit_json:
                d1_chart = jyotishganit_json['d1Chart']
                
                # Extract houses and planets from occupants
                if 'houses' in d1_chart:
                    houses = d1_chart['houses']
                    for i, house in enumerate(houses[:12]):
                        house_num = house.get('number', i + 1)
                        horoscope_info[f'house_{house_num}_sign'] = house.get('sign', '')
                        horoscope_info[f'house_{house_num}_lord'] = house.get('lord', '')
                        
                        # Extract planets from occupants
                        occupants = house.get('occupants', [])
                        for occupant in occupants:
                            planet_name = occupant.get('celestialBody', '').lower().replace(' ', '_')
                            if planet_name:
                                horoscope_info[f'{planet_name}_sign'] = occupant.get('sign', '')
                                horoscope_info[f'{planet_name}_house'] = occupant.get('house', '')
                                horoscope_info[f'{planet_name}_nakshatra'] = occupant.get('nakshatra', '')
    
    print(f"\n[TEST] Extracted horoscope_info keys: {list(horoscope_info.keys())}")
    print(f"[TEST] Total keys extracted: {len(horoscope_info)}")
    print(f"\n[TEST] Sample data:")
    for key, value in list(horoscope_info.items())[:10]:
        print(f"  {key}: {value}")
    
    if len(horoscope_info) > 0:
        print("\n✅ SUCCESS: horoscope_info extracted successfully!")
    else:
        print("\n❌ FAILED: No horoscope_info extracted!")
        sys.exit(1)

except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 80)
