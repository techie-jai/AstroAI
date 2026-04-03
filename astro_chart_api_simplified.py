#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Simplified Astrology Chart API - Generate Divisional Charts using PyJHora
Bypasses problematic Horoscope class and uses core chart generation logic directly
"""

import sys
import os
from datetime import datetime
from typing import Dict, List, Tuple, Optional

# Add parent directory and PyJHora to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'PyJHora'))

# Set ephemeris path BEFORE importing any jhora modules
import swisseph as swe
ephe_path = os.path.join(os.path.dirname(__file__), 'PyJHora', 'jhora', 'data', 'ephe')
ephe_path = os.path.abspath(ephe_path)
print(f"Setting ephemeris path to: {ephe_path}")
swe.set_ephe_path(ephe_path)

# Import only what we need from jhora
from jhora import const, utils
from jhora.panchanga import drik
from jhora.horoscope.chart import charts

class AstroChartAPISimplified:
    """
    Simplified API for generating astrological charts using PyJHora
    Bypasses the problematic Horoscope class initialization
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
        self.current_birth_data = None
        self.current_kundli_data = None
    
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
            timezone_offset: Timezone offset from UTC
            year, month, day: Birth date
            hour, minute, second: Birth time (24-hour format)
        
        Returns:
            Dictionary with birth data
        """
        # Create drik objects for calculations
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
        
        return self.current_birth_data
    
    def get_chart(self, chart_type: str = 'D1', chart_method: int = 1) -> Dict:
        """
        Generate a divisional chart
        
        Args:
            chart_type: Chart type (D1, D7, D9, D10, etc.)
            chart_method: Calculation method (1 = Traditional Parasara)
        
        Returns:
            Dictionary with chart data
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
        
        # Get planet positions using core chart logic
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
                planet_name = utils.PLANET_NAMES.get(planet_id, f"Planet {planet_id}")
                planet_short = utils.PLANET_SHORT_NAMES.get(planet_id, str(planet_id))
            
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
    
    def get_kundli(self) -> Dict:
        """
        Generate complete kundli with basic horoscope information
        
        Returns:
            Dictionary with kundli data
        """
        if not self.current_birth_data:
            raise ValueError("Birth data not set. Call set_birth_data() first.")
        
        try:
            # Generate D1 chart as the main kundli
            d1_chart = self.get_chart('D1')
            
            # Create basic horoscope info from D1 chart
            horoscope_info = {
                'name': self.current_birth_data['name'],
                'place': self.current_birth_data['place_name'],
                'date': f"{self.current_birth_data['year']}-{self.current_birth_data['month']:02d}-{self.current_birth_data['day']:02d}",
                'time': f"{self.current_birth_data['hour']:02d}:{self.current_birth_data['minute']:02d}:{self.current_birth_data['second']:02d}",
                'latitude': self.current_birth_data['latitude'],
                'longitude': self.current_birth_data['longitude'],
                'timezone_offset': self.current_birth_data['timezone_offset'],
                'ascendant': d1_chart['ascendant']['house_name'] if d1_chart['ascendant'] else 'Unknown',
                'ascendant_longitude': d1_chart['ascendant']['longitude'] if d1_chart['ascendant'] else 0,
            }
            
            # Add planet positions
            for planet in d1_chart['planets']:
                if planet['id'] != 'L':
                    horoscope_info[f"{planet['name']}_house"] = planet['house_name']
                    horoscope_info[f"{planet['name']}_longitude"] = planet['longitude']
            
            self.current_kundli_data = {
                'horoscope_info': horoscope_info,
                'horoscope_charts': {'D1': d1_chart},
                'vimsottari_info': {},
                'birth_data': {
                    'name': self.current_birth_data['name'],
                    'place': self.current_birth_data['place_name'],
                    'date': f"{self.current_birth_data['year']}-{self.current_birth_data['month']:02d}-{self.current_birth_data['day']:02d}",
                    'time': f"{self.current_birth_data['hour']:02d}:{self.current_birth_data['minute']:02d}:{self.current_birth_data['second']:02d}",
                    'latitude': self.current_birth_data['latitude'],
                    'longitude': self.current_birth_data['longitude'],
                    'timezone_offset': self.current_birth_data['timezone_offset']
                }
            }
            
            return self.current_kundli_data
        except Exception as e:
            raise ValueError(f"Failed to generate kundli: {str(e)}")
    
    def format_kundli_text(self) -> str:
        """
        Format complete kundli as readable text
        
        Returns:
            Formatted string representation of the kundli
        """
        if not self.current_kundli_data:
            self.get_kundli()
        
        lines = []
        lines.append("=" * 100)
        lines.append("COMPLETE KUNDLI (HOROSCOPE)")
        lines.append("=" * 100)
        
        birth_data = self.current_kundli_data['birth_data']
        lines.append(f"\nName: {birth_data['name']}")
        lines.append(f"Place: {birth_data['place']}")
        lines.append(f"Date: {birth_data['date']}")
        lines.append(f"Time: {birth_data['time']}")
        lines.append(f"Latitude: {birth_data['latitude']}")
        lines.append(f"Longitude: {birth_data['longitude']}")
        lines.append(f"Timezone Offset: {birth_data['timezone_offset']}")
        
        lines.append("\n" + "=" * 100)
        lines.append("ASTROLOGICAL INFORMATION")
        lines.append("=" * 100)
        
        horoscope_info = self.current_kundli_data['horoscope_info']
        for key, value in horoscope_info.items():
            lines.append(f"{key}: {value}")
        
        lines.append("\n" + "=" * 100)
        
        return "\n".join(lines)
    
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
        if chart_data['ascendant']:
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
