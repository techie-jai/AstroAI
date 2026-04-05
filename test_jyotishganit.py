#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test Jyotishganit library to understand its capabilities
"""

from datetime import datetime
from jyotishganit import calculate_birth_chart, get_birth_chart_json_string
import json

def test_jyotishganit():
    """Test Jyotishganit with sample birth data"""
    
    print("Testing Jyotishganit Library")
    print("=" * 50)
    
    # Test with the same birth details as before
    birth_date = datetime(1999, 7, 7, 15, 35, 0)  # 7th July 1999 3:35 pm
    latitude = 28.6139   # Delhi, India  
    longitude = 77.209
    timezone_offset = 5.5  # IST
    name = "Arushi"
    location_name = "Delhi, India"
    
    try:
        # Generate a complete Vedic birth chart
        print("Generating birth chart...")
        chart = calculate_birth_chart(
            birth_date=birth_date,
            latitude=latitude,
            longitude=longitude,
            timezone_offset=timezone_offset,
            location_name=location_name,
            name=name
        )
        
        print("Birth chart generated successfully!")
        
        print("\nBASIC CHART DATA:")
        print("-" * 30)
        
        # Ascendant (Lagna)
        ascendant = chart.d1_chart.houses[0]
        print(f"Ascendant: {ascendant.sign} (House 1)")
        
        # Moon Sign
        moon = chart.d1_chart.planets[1]  # Moon is index 1
        print(f"Moon Sign: {moon.sign} (House {moon.house})")
        
        # Sun Sign
        sun = chart.d1_chart.planets[0]  # Sun is index 0
        print(f"Sun Sign: {sun.sign} (House {sun.house})")
        
        # Nakshatra
        print(f"Moon Nakshatra: {chart.panchanga.nakshatra}")
        
        # Test Panchanga
        print("\nPANCHANGA:")
        print("-" * 30)
        panchanga = chart.panchanga
        print(f"Tithi: {panchanga.tithi}")
        print(f"Nakshatra: {panchanga.nakshatra}")
        print(f"Yoga: {panchanga.yoga}")
        print(f"Karana: {panchanga.karana}")
        print(f"Vaara: {panchanga.vaara}")
        
        # Test all planets
        print("\nALL PLANETS:")
        print("-" * 30)
        planet_names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        
        for i, planet in enumerate(chart.d1_chart.planets):
            if i < len(planet_names):
                planet_name = planet_names[i]
                print(f"{planet_name:8} | {planet.sign:10} | House {planet.house:2} | {planet.sign_degrees:6.2f}° | {planet.nakshatra}")
        
        # Test divisional charts
        print("\nDIVISIONAL CHARTS:")
        print("-" * 30)
        print(f"Available charts: {list(chart.divisional_charts.keys())}")
        
        # Test Navamsa (D9)
        if 'd9' in chart.divisional_charts:
            navamsa = chart.divisional_charts['d9']
            print(f"Navamsa (D9) Ascendant: {navamsa.houses[0].sign}")
        
        # Test Shadbala
        print("\nSHADBALA (Sun):")
        print("-" * 30)
        sun_shadbala = sun.shadbala['Shadbala']
        print(f"Total Shadbala: {sun_shadbala['Total']:.2f}")
        print(f"Available keys: {list(sun_shadbala.keys())}")
        
        # Test available shadbala components
        for key in sun_shadbala.keys():
            if key != 'Total':
                print(f"{key}: {sun_shadbala[key]:.2f}")
        
        # Test Ashtakavarga
        print("\nASHTAKAVARGA:")
        print("-" * 30)
        sarva = chart.ashtakavarga.sav
        print("Sarvashtakavarga (Total points per sign):")
        for sign, points in list(sarva.items())[:6]:  # Show first 6
            print(f"  {sign:10}: {points} points")
        
        # Test Dasha
        print("\nDASHA PERIODS:")
        print("-" * 30)
        dashas = chart.dashas
        print("Next 3 Mahadashas:")
        for i, (lord, md) in enumerate(list(dashas.upcoming['mahadashas'].items())[:3]):
            print(f"  {i+1}. {lord:8}: {md['start']} to {md['end']}")
        
        # Test JSON export
        print("\nJSON EXPORT:")
        print("-" * 30)
        json_data = get_birth_chart_json_string(chart)
        
        # Save to file
        filename = f"jyotishganit_{name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, "w", encoding='utf-8') as json_file:
            json_file.write(json_data)
        
        print(f"Chart saved to: {filename}")
        print(f"JSON size: {len(json_data)} characters")
        
        # Show JSON structure
        json_dict = json.loads(json_data)
        print(f"JSON keys: {list(json_dict.keys())}")
        
        print("Jyotishganit test completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_jyotishganit()
