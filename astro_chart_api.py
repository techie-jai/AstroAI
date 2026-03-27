#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Astrology Chart API - Generate Divisional Charts using PyJHora

This module provides a simple API interface to generate various divisional charts
(D1, D7, D9, D10, etc.) from birth details.
"""

import sys
import os
from datetime import datetime
from typing import Dict, List, Tuple, Optional

# Add PyJHora to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'PyJHora'))

from jhora import const, utils
from jhora.panchanga import drik
from jhora.horoscope import main
from jhora.horoscope.chart import charts

# Initialize language resources
utils.set_language('en')

class AstroChartAPI:
    """
    API for generating astrological charts using PyJHora
    """
    
    # Divisional chart mappings
    CHART_TYPES = {
        'D1': (1, 'Rasi Chart', 'Birth Chart, Overall Life'),
        'D2': (2, 'Hora Chart', 'Wealth, Money'),
        'D3': (3, 'Drekkana Chart', 'Siblings, Courage'),
        'D4': (4, 'Chaturthamsa Chart', 'Property, Assets'),
        'D5': (5, 'Panchamsa Chart', 'Fame, Power'),
        'D6': (6, 'Shashthamsa Chart', 'Health, Diseases'),
        'D7': (7, 'Saptamsa Chart', 'Children, Progeny'),
        'D8': (8, 'Ashtamsa Chart', 'Longevity, Obstacles'),
        'D9': (9, 'Navamsa Chart', 'Spouse, Marriage'),
        'D10': (10, 'Dasamsa Chart', 'Career, Profession'),
        'D11': (11, 'Rudramsa Chart', 'Destruction'),
        'D12': (12, 'Dwadasamsa Chart', 'Parents'),
        'D16': (16, 'Shodasamsa Chart', 'Vehicles, Comforts'),
        'D20': (20, 'Vimsamsa Chart', 'Spiritual Progress'),
        'D24': (24, 'Chaturvimsamsa Chart', 'Education'),
        'D27': (27, 'Nakshatramsa Chart', 'Strengths'),
        'D30': (30, 'Trimsamsa Chart', 'Evils, Misfortunes'),
        'D40': (40, 'Khavedamsa Chart', 'Effects'),
        'D45': (45, 'Akshavedamsa Chart', 'General'),
        'D60': (60, 'Shashtyamsa Chart', 'Well-being')
    }
    
    def __init__(self):
        """Initialize the API"""
        self.current_horoscope = None
        self.current_birth_data = None
    
    def set_birth_data(self, 
                       name: str,
                       place_name: str,
                       latitude: float,
                       longitude: float,
                       timezone_offset: float,
                       year: int,
                       month: int,
                       day: int,
                       hour: int,
                       minute: int,
                       second: int = 0) -> Dict:
        """
        Set birth data for chart calculations
        
        Args:
            name: Person's name
            place_name: Birth place
            latitude: Latitude in decimal degrees
            longitude: Longitude in decimal degrees
            timezone_offset: Timezone offset from UTC (e.g., 5.5 for IST)
            year, month, day: Birth date
            hour, minute, second: Birth time (24-hour format)
        
        Returns:
            Dictionary with birth data
        """
        birth_date = drik.Date(year, month, day)
        birth_time = f"{hour}:{minute}:{second}"
        place = drik.Place(place_name, latitude, longitude, timezone_offset)
        
        self.current_birth_data = {
            'name': name,
            'place_name': place_name,
            'latitude': latitude,
            'longitude': longitude,
            'timezone_offset': timezone_offset,
            'birth_date': birth_date,
            'birth_time': birth_time,
            'place': place,
            'year': year,
            'month': month,
            'day': day,
            'hour': hour,
            'minute': minute,
            'second': second
        }
        
        # Generate horoscope object
        self.current_horoscope = main.Horoscope(
            place_with_country_code=place_name,
            latitude=latitude,
            longitude=longitude,
            timezone_offset=timezone_offset,
            date_in=birth_date,
            birth_time=birth_time,
            calculation_type='drik',
            language='en'
        )
        
        return self.current_birth_data
    
    def get_chart(self, chart_type: str = 'D1', chart_method: int = 1) -> Dict:
        """
        Generate a divisional chart
        
        Args:
            chart_type: Chart type (D1, D7, D9, D10, etc.)
            chart_method: Calculation method (1 = Traditional Parasara)
        
        Returns:
            Dictionary with chart data including:
            - chart_type: Type of chart
            - chart_name: Full name of chart
            - planets: List of planet positions
            - houses: Dictionary of houses with planets
            - ascendant: Ascendant information
        """
        if not self.current_birth_data:
            raise ValueError("Birth data not set. Call set_birth_data() first.")
        
        if chart_type not in self.CHART_TYPES:
            raise ValueError(f"Invalid chart type. Must be one of: {list(self.CHART_TYPES.keys())}")
        
        divisional_factor, chart_name, signification = self.CHART_TYPES[chart_type]
        
        # Calculate Julian Day
        jd = utils.julian_day_number(
            self.current_birth_data['birth_date'],
            (self.current_birth_data['hour'], 
             self.current_birth_data['minute'], 
             self.current_birth_data['second'])
        )
        
        # Get planet positions
        planet_positions = charts.divisional_chart(
            jd,
            self.current_birth_data['place'],
            divisional_chart_factor=divisional_factor,
            chart_method=chart_method
        )
        
        # Process planet positions
        planets_list = []
        houses_dict = {i: [] for i in range(12)}
        ascendant_info = None
        
        for planet_data in planet_positions:
            planet_id = planet_data[0]
            rasi, longitude = planet_data[1]
            
            if planet_id == 'L':
                planet_name = "Ascendant"
                planet_short = "Asc"
                ascendant_info = {
                    'house': rasi,
                    'house_name': utils.RAASI_LIST[rasi],
                    'longitude': longitude,
                    'longitude_dms': utils.to_dms(longitude, is_lat_long='plong')
                }
            else:
                planet_name = utils.PLANET_NAMES[planet_id]
                planet_short = utils.PLANET_SHORT_NAMES[planet_id]
            
            planet_info = {
                'id': planet_id,
                'name': planet_name,
                'short_name': planet_short,
                'house': rasi,
                'house_name': utils.RAASI_LIST[rasi],
                'longitude': longitude,
                'longitude_dms': utils.to_dms(longitude, is_lat_long='plong')
            }
            
            planets_list.append(planet_info)
            houses_dict[rasi].append(planet_info)
        
        return {
            'chart_type': chart_type,
            'divisional_factor': divisional_factor,
            'chart_name': chart_name,
            'signification': signification,
            'planets': planets_list,
            'houses': houses_dict,
            'ascendant': ascendant_info,
            'birth_data': {
                'name': self.current_birth_data['name'],
                'place': self.current_birth_data['place_name'],
                'date': f"{self.current_birth_data['year']}-{self.current_birth_data['month']:02d}-{self.current_birth_data['day']:02d}",
                'time': f"{self.current_birth_data['hour']:02d}:{self.current_birth_data['minute']:02d}:{self.current_birth_data['second']:02d}"
            }
        }
    
    def get_multiple_charts(self, chart_types: List[str] = None) -> Dict[str, Dict]:
        """
        Generate multiple divisional charts at once
        
        Args:
            chart_types: List of chart types (e.g., ['D1', 'D9', 'D10'])
                        If None, generates all major charts
        
        Returns:
            Dictionary with chart_type as key and chart data as value
        """
        if chart_types is None:
            chart_types = ['D1', 'D7', 'D9', 'D10']
        
        results = {}
        for chart_type in chart_types:
            results[chart_type] = self.get_chart(chart_type)
        
        return results
    
    def get_planet_in_house(self, chart_type: str, planet_name: str) -> Optional[Dict]:
        """
        Get the house position of a specific planet in a chart
        
        Args:
            chart_type: Chart type (D1, D9, etc.)
            planet_name: Planet name (e.g., 'Sun', 'Moon', 'Mars', 'Rahu'/'Raagu', 'Ketu'/'Kethu')
        
        Returns:
            Dictionary with planet position info or None if not found
        """
        chart_data = self.get_chart(chart_type)
        
        # Normalize the search name (handle both Rahu/Raagu and Ketu/Kethu)
        search_name = planet_name.lower()
        if search_name == 'rahu':
            search_name = 'raagu'
        elif search_name == 'ketu':
            search_name = 'kethu'
        
        for planet in chart_data['planets']:
            # Check both full name and short name, handle special symbols
            planet_full = planet['name'].replace('☉', '').replace('☾', '').replace('♂', '').replace('☿', '').replace('♃', '').replace('♀', '').replace('♄', '').replace('☊', '').replace('☋', '').replace('⛢', '').replace('♆', '').replace('♇', '').strip()
            planet_short = planet['short_name'].replace('☉', '').replace('☾', '').replace('♂', '').replace('☿', '').replace('♃', '').replace('♀', '').replace('♄', '').replace('☊', '').replace('☋', '').replace('⛢', '').replace('♆', '').replace('♇', '').strip()
            
            if planet_full.lower() == search_name or planet_short.lower() == search_name:
                return planet
        
        return None
    
    def get_planets_in_house(self, chart_type: str, house_number: int) -> List[Dict]:
        """
        Get all planets in a specific house
        
        Args:
            chart_type: Chart type (D1, D9, etc.)
            house_number: House number (1-12)
        
        Returns:
            List of planets in that house
        """
        if house_number < 1 or house_number > 12:
            raise ValueError("House number must be between 1 and 12")
        
        chart_data = self.get_chart(chart_type)
        return chart_data['houses'][house_number - 1]
    
    def format_chart_text(self, chart_type: str = 'D1') -> str:
        """
        Format chart as readable text
        
        Args:
            chart_type: Chart type
        
        Returns:
            Formatted string representation of the chart
        """
        chart_data = self.get_chart(chart_type)
        
        lines = []
        lines.append("=" * 80)
        lines.append(f"{chart_data['chart_name']} ({chart_data['chart_type']})")
        lines.append(f"Signification: {chart_data['signification']}")
        lines.append("=" * 80)
        lines.append(f"Name: {chart_data['birth_data']['name']}")
        lines.append(f"Place: {chart_data['birth_data']['place']}")
        lines.append(f"Date: {chart_data['birth_data']['date']}")
        lines.append(f"Time: {chart_data['birth_data']['time']}")
        lines.append("-" * 80)
        lines.append(f"Ascendant: {chart_data['ascendant']['house_name']} {chart_data['ascendant']['longitude_dms']}")
        lines.append("-" * 80)
        lines.append("\nPlanet Positions:")
        lines.append("-" * 80)
        
        for planet in chart_data['planets']:
            if planet['id'] != 'L':
                lines.append(f"{planet['name']:15s} -> {planet['house_name']:15s} {planet['longitude_dms']}")
        
        lines.append("-" * 80)
        lines.append("\nHouses with Planets:")
        lines.append("-" * 80)
        
        for house_num in range(12):
            planets_in_house = chart_data['houses'][house_num]
            if planets_in_house:
                planet_names = ", ".join([p['short_name'] for p in planets_in_house])
                lines.append(f"House {house_num + 1:2d} ({utils.RAASI_LIST[house_num]:15s}): {planet_names}")
        
        lines.append("=" * 80)
        
        return "\n".join(lines)


# ============================================================================
# Example Usage Functions
# ============================================================================

def example_basic_usage():
    """Example: Basic usage of the API"""
    print("\n" + "=" * 80)
    print("EXAMPLE 1: Basic Chart Generation")
    print("=" * 80)
    
    # Create API instance
    api = AstroChartAPI()
    
    # Set birth data
    api.set_birth_data(
        name="Example Person",
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
    
    # Generate D1 chart
    d1_chart = api.get_chart('D1')
    print(f"\nChart Type: {d1_chart['chart_name']}")
    print(f"Ascendant: {d1_chart['ascendant']['house_name']}")
    print(f"\nPlanets:")
    for planet in d1_chart['planets'][:5]:  # Show first 5
        print(f"  {planet['name']:15s} in {planet['house_name']}")


def example_multiple_charts():
    """Example: Generate multiple charts"""
    print("\n" + "=" * 80)
    print("EXAMPLE 2: Multiple Charts (D1, D7, D9, D10)")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    api.set_birth_data(
        name="Example Person",
        place_name="Mumbai,IN",
        latitude=19.0760,
        longitude=72.8777,
        timezone_offset=5.5,
        year=1985,
        month=3,
        day=20,
        hour=14,
        minute=45
    )
    
    # Generate multiple charts
    charts = api.get_multiple_charts(['D1', 'D7', 'D9', 'D10'])
    
    for chart_type, chart_data in charts.items():
        print(f"\n{chart_data['chart_name']} ({chart_type}):")
        print(f"  Signification: {chart_data['signification']}")
        print(f"  Ascendant: {chart_data['ascendant']['house_name']}")


def example_query_specific_info():
    """Example: Query specific information"""
    print("\n" + "=" * 80)
    print("EXAMPLE 3: Query Specific Information")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    api.set_birth_data(
        name="Example Person",
        place_name="Delhi,IN",
        latitude=28.6139,
        longitude=77.2090,
        timezone_offset=5.5,
        year=1995,
        month=12,
        day=10,
        hour=8,
        minute=15
    )
    
    # Find where Sun is in D1
    sun_position = api.get_planet_in_house('D1', 'Sun')
    print(f"\nSun in D1 Chart:")
    print(f"  House: {sun_position['house_name']}")
    print(f"  Longitude: {sun_position['longitude_dms']}")
    
    # Find all planets in house 1 of D9
    planets_in_1st = api.get_planets_in_house('D9', 1)
    print(f"\nPlanets in 1st house of D9 (Navamsa):")
    for planet in planets_in_1st:
        print(f"  {planet['name']}")


def example_formatted_output():
    """Example: Formatted text output"""
    print("\n" + "=" * 80)
    print("EXAMPLE 4: Formatted Chart Output")
    print("=" * 80)
    
    api = AstroChartAPI()
    
    api.set_birth_data(
        name="Example Person",
        place_name="Bangalore,IN",
        latitude=12.9716,
        longitude=77.5946,
        timezone_offset=5.5,
        year=2000,
        month=1,
        day=1,
        hour=12,
        minute=0
    )
    
    # Print formatted D10 chart
    print(api.format_chart_text('D10'))


if __name__ == "__main__":
    # Run all examples
    example_basic_usage()
    example_multiple_charts()
    example_query_specific_info()
    example_formatted_output()
    
    print("\n" + "=" * 80)
    print("API READY FOR USE")
    print("=" * 80)
    print("\nAvailable chart types:")
    for chart_type, (factor, name, sig) in AstroChartAPI.CHART_TYPES.items():
        print(f"  {chart_type:5s} - {name:30s} ({sig})")
