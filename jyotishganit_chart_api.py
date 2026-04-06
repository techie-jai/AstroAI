#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Jyotishganit Chart API - Professional Vedic Astrology Library
Uses Jyotishganit library for accurate astronomical calculations
"""

import sys
import os
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any

try:
    from jyotishganit import calculate_birth_chart, get_birth_chart_json
except ImportError as e:
    print(f"Jyotishganit import error: {e}")
    print("Install with: pip install jyotishganit")
    sys.exit(1)


class JyotishganitChartAPI:
    """
    Jyotishganit-based Chart API
    Professional-grade Vedic astrology calculations using NASA JPL ephemeris
    """
    
    # Divisional chart mappings (same as before for compatibility)
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
        'D12': (12, 'Dwadashamsa Chart', 'Parents'),
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
        """Initialize the Jyotishganit API"""
        self.current_birth_data = None
        self.current_chart = None
    
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
            timezone_offset: Timezone offset from UTC (e.g., 5.5)
            year, month, day: Birth date
            hour, minute, second: Birth time (24-hour format)
        
        Returns:
            Dictionary with birth data
        """
        # Create datetime object
        birth_date = datetime(year, month, day, hour, minute, second)
        
        self.current_birth_data = {
            'name': name,
            'place_name': place_name,
            'latitude': latitude,
            'longitude': longitude,
            'timezone_offset': timezone_offset,
            'birth_date': birth_date,
            'year': year,
            'month': month,
            'day': day,
            'hour': hour,
            'minute': minute,
            'second': second
        }
        
        return self.current_birth_data
    
    def calculate_chart(self) -> Any:
        """Calculate the complete birth chart using Jyotishganit"""
        if not self.current_birth_data:
            raise ValueError("Birth data not set. Call set_birth_data() first.")
        
        try:
            # Generate complete Vedic birth chart
            self.current_chart = calculate_birth_chart(
                birth_date=self.current_birth_data['birth_date'],
                latitude=self.current_birth_data['latitude'],
                longitude=self.current_birth_data['longitude'],
                timezone_offset=self.current_birth_data['timezone_offset'],
                location_name=self.current_birth_data['place_name'],
                name=self.current_birth_data['name']
            )
            
            return self.current_chart
            
        except Exception as e:
            raise RuntimeError(f"Failed to calculate chart: {str(e)}")
    
    def get_chart(self, chart_type: str = 'D1', chart_method: int = 1) -> Dict:
        """
        Generate a divisional chart
        
        Args:
            chart_type: Chart type (D1, D7, D9, D10, etc.)
            chart_method: Calculation method (for compatibility)
        
        Returns:
            Dictionary with chart data
        """
        if not self.current_chart:
            self.calculate_chart()
        
        if chart_type not in self.CHART_TYPES:
            raise ValueError(f"Invalid chart type. Must be one of: {list(self.CHART_TYPES.keys())}")
        
        divisional_factor, chart_name, signification = self.CHART_TYPES[chart_type]
        
        try:
            if chart_type == 'D1':
                return self._generate_d1_chart(chart_name, signification)
            else:
                return self._generate_divisional_chart(chart_type, chart_name, signification)
        
        except Exception as e:
            return {'error': f'Failed to generate {chart_type} chart: {str(e)}'}
    
    def _generate_d1_chart(self, chart_name: str, signification: str) -> Dict:
        """Generate D1 (Rasi) chart data"""
        if not self.current_chart:
            self.calculate_chart()
        
        # Extract planets from D1 chart
        planets_list = []
        houses_dict = {i: [] for i in range(12)}
        ascendant_info = None
        
        # Process planets
        planet_names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        
        for i, planet in enumerate(self.current_chart.d1_chart.planets):
            if i < len(planet_names):
                planet_name = planet_names[i]
                
                planet_info = {
                    'id': str(i),  # 0-8 for planets
                    'name': planet_name,
                    'short_name': planet_name[:3],
                    'house': planet.house,
                    'house_name': planet.sign,
                    'longitude': planet.sign_degrees,
                    'longitude_dms': self._degrees_to_dms(planet.sign_degrees),
                    'nakshatra': planet.nakshatra,
                    'nakshatra_lord': self._get_nakshatra_lord(getattr(planet, 'nakshatra', '')),
                    'pada': getattr(planet, 'pada', 1),
                    'shadbala': self._extract_shadbala(planet),
                    'aspects': self._extract_aspects(planet),
                    'dignities': getattr(planet, 'dignities', None),
                    'motion_type': getattr(planet, 'motion_type', 'direct')
                }
                
                planets_list.append(planet_info)
                
                # Add to houses dictionary
                house = planet.house
                if 1 <= house <= 12:
                    houses_dict[house - 1].append(planet_info)
        
        # Process houses
        for house in self.current_chart.d1_chart.houses:
            house_info = {
                'number': house.number,
                'sign': house.sign,
                'lord': house.lord,
                'lord_placed_sign': getattr(house, 'lordPlacedSign', None),
                'lord_placed_house': getattr(house, 'lordPlacedHouse', None),
                'bhava_bala': getattr(house, 'bhavaBala', 0),
                'occupants': [occ.celestialBody if hasattr(occ, 'celestialBody') else str(occ) for occ in getattr(house, 'occupants', [])],
                'aspects_received': [asp.get('aspecting_planet', str(asp)) for asp in getattr(house, 'aspectsReceived', [])],
                'purposes': getattr(house, 'purposes', []),
                'sign_degrees': getattr(house, 'signDegrees', 0),
                'nakshatra': getattr(house, 'nakshatra', ''),
                'pada': getattr(house, 'pada', 1)
            }
            
            # Set ascendant info (House 1)
            if house.number == 1:
                ascendant_info = {
                    'house': house.number,
                    'house_name': house.sign,
                    'longitude': getattr(house, 'signDegrees', 0),
                    'longitude_dms': self._degrees_to_dms(getattr(house, 'signDegrees', 0)),
                    'nakshatra': getattr(house, 'nakshatra', ''),
                    'pada': getattr(house, 'pada', 1),
                    'lord': house.lord
                }
        
        return {
            'chart_type': 'D1',
            'divisional_factor': 1,
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
            },
            'panchanga': self._extract_panchanga(),
            'ayanamsa': self._extract_ayanamsa()
        }
    
    def _generate_divisional_chart(self, chart_type: str, chart_name: str, signification: str) -> Dict:
        """Generate divisional chart data"""
        if not self.current_chart:
            self.calculate_chart()
        
        # Get divisional chart
        chart_key = chart_type.lower()
        if chart_key not in self.current_chart.divisional_charts:
            return {'error': f'Chart {chart_type} not available'}
        
        divisional_chart = self.current_chart.divisional_charts[chart_key]
        
        planets_list = []
        houses_dict = {i: [] for i in range(12)}
        
        # Process planets in divisional chart
        planet_names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        
        # Check if it's a RasiChart object or has planets attribute
        if hasattr(divisional_chart, 'planets'):
            planets_data = divisional_chart.planets
        elif hasattr(divisional_chart, 'houses'):
            # Extract planets from houses
            planets_data = []
            for house in divisional_chart.houses:
                if hasattr(house, 'occupants') and house.occupants:
                    planets_data.extend(house.occupants)
        else:
            return {'error': f'Chart {chart_type} structure not recognized'}
        
        for i, planet in enumerate(planets_data):
            if i < len(planet_names):
                planet_name = planet_names[i]
                
                planet_info = {
                    'id': str(i),
                    'name': planet_name,
                    'short_name': planet_name[:3],
                    'house': getattr(planet, 'house', 1),
                    'house_name': getattr(planet, 'sign', 'Unknown'),
                    'longitude': getattr(planet, 'sign_degrees', 0),
                    'longitude_dms': self._degrees_to_dms(getattr(planet, 'sign_degrees', 0)),
                    'nakshatra': getattr(planet, 'nakshatra', ''),
                    'pada': getattr(planet, 'pada', 1)
                }
                
                planets_list.append(planet_info)
                
                # Add to houses dictionary
                house = planet_info['house']
                if 1 <= house <= 12:
                    houses_dict[house - 1].append(planet_info)
        
        return {
            'chart_type': chart_type,
            'divisional_factor': self.CHART_TYPES[chart_type][0],
            'chart_name': chart_name,
            'signification': signification,
            'planets': planets_list,
            'houses': houses_dict,
            'ascendant': None,  # Divisional charts typically don't show ascendant
            'birth_data': {
                'name': self.current_birth_data['name'],
                'place': self.current_birth_data['place_name'],
                'date': f"{self.current_birth_data['year']}-{self.current_birth_data['month']:02d}-{self.current_birth_data['day']:02d}",
                'time': f"{self.current_birth_data['hour']:02d}:{self.current_birth_data['minute']:02d}:{self.current_birth_data['second']:02d}"
            }
        }
    
    def _extract_shadbala(self, planet) -> Dict[str, Any]:
        """Extract shadbala information"""
        if hasattr(planet, 'shadbala') and 'Shadbala' in planet.shadbala:
            shadbala = planet.shadbala['Shadbala']
            return {
                'total': shadbala.get('Total', 0),
                'rupas': shadbala.get('Rupas', 0),
                'components': {k: v for k, v in shadbala.items() if k not in ['Total', 'Rupas']}
            }
        return {}
    
    def _extract_aspects(self, planet) -> Dict[str, List]:
        """Extract aspect information"""
        aspects = {
            'gives': [],
            'receives': []
        }
        
        if hasattr(planet, 'aspects'):
            if 'gives' in planet.aspects:
                aspects['gives'] = planet.aspects['gives']
            if 'receives' in planet.aspects:
                aspects['receives'] = planet.aspects['receives']
        
        return aspects
    
    def _extract_panchanga(self) -> Dict[str, Any]:
        """Extract panchanga information"""
        if not self.current_chart:
            return {}
        
        panchanga = self.current_chart.panchanga
        return {
            'tithi': getattr(panchanga, 'tithi', ''),
            'nakshatra': getattr(panchanga, 'nakshatra', ''),
            'yoga': getattr(panchanga, 'yoga', ''),
            'karana': getattr(panchanga, 'karana', ''),
            'vaara': getattr(panchanga, 'vaara', '')
        }
    
    def _extract_ayanamsa(self) -> Dict[str, Any]:
        """Extract ayanamsa information"""
        if not self.current_chart:
            return {}
        
        ayanamsa = self.current_chart.ayanamsa
        return {
            'name': getattr(ayanamsa, 'name', 'True Chitra Paksha'),
            'value': getattr(ayanamsa, 'value', 0)
        }
    
    def _get_nakshatra_lord(self, nakshatra: str) -> str:
        """Get nakshatra lord"""
        nakshatra_lords = {
            'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun', 'Rohini': 'Moon',
            'Mrigashira': 'Mars', 'Ardra': 'Rahu', 'Punarvasu': 'Jupiter', 'Pushya': 'Saturn',
            'Ashlesha': 'Mercury', 'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
            'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu', 'Vishakha': 'Jupiter',
            'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury', 'Mula': 'Ketu', 'Purva Ashadha': 'Venus',
            'Uttara Ashadha': 'Sun', 'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
            'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
        }
        return nakshatra_lords.get(nakshatra, 'Unknown')
    
    def _degrees_to_dms(self, degrees: Optional[float]) -> List[int]:
        """Convert decimal degrees to degrees, minutes, seconds"""
        if degrees is None:
            return [0, 0, 0]
        
        try:
            deg = int(degrees)
            minutes = int((degrees - deg) * 60)
            seconds = int(((degrees - deg) * 60 - minutes) * 60)
            return [deg, minutes, seconds]
        except (ValueError, TypeError):
            return [0, 0, 0]
    
    def get_kundli(self) -> Dict:
        """Generate complete kundli data"""
        if not self.current_chart:
            self.calculate_chart()
        
        try:
            # Get complete JSON data
            kundli_json = get_birth_chart_json(self.current_chart)
            
            # Convert datetime objects to strings for JSON serialization
            def convert_datetime(obj):
                if isinstance(obj, datetime):
                    return obj.isoformat()
                elif hasattr(obj, '__dict__'):
                    # Handle objects with datetime attributes
                    return {k: convert_datetime(v) for k, v in obj.__dict__.items()}
                elif isinstance(obj, dict):
                    return {k: convert_datetime(v) for k, v in obj.items()}
                elif isinstance(obj, list):
                    return [convert_datetime(item) for item in obj]
                return obj
            
            # Apply conversion to the JSON data
            import json
            kundli_json_str = json.dumps(kundli_json, default=convert_datetime)
            kundli_json = json.loads(kundli_json_str)
            
            return {
                'metadata': {
                    'generated_at': datetime.now().isoformat(),
                    'engine': 'Jyotishganit',
                    'version': '0.1.2',
                    'calculation_type': 'Professional Vedic Astrology',
                    'ephemeris': 'NASA JPL DE421'
                },
                'birth_details': {
                    'name': self.current_birth_data['name'],
                    'date': f"{self.current_birth_data['year']}-{self.current_birth_data['month']:02d}-{self.current_birth_data['day']:02d}",
                    'time': f"{self.current_birth_data['hour']:02d}:{self.current_birth_data['minute']:02d}:{self.current_birth_data['second']:02d}",
                    'place': self.current_birth_data['place_name'],
                    'latitude': self.current_birth_data['latitude'],
                    'longitude': self.current_birth_data['longitude'],
                    'timezone': self.current_birth_data['timezone_offset']
                },
                'charts': {},  # Empty charts - all data is in jyotishganit_json
                'jyotishganit_json': kundli_json,  # Include original comprehensive JSON
                'ashtakavarga': self._extract_ashtakavarga(),
                'dashas': self._extract_dashas_simple()
            }
            
        except Exception as e:
            return {'error': f'Failed to generate kundli: {str(e)}'}
    
    def _extract_ashtakavarga(self) -> Dict[str, Any]:
        """Extract ashtakavarga data"""
        if not self.current_chart:
            return {}
        
        ashtakavarga = self.current_chart.ashtakavarga
        return {
            'sarvashtakavarga': getattr(ashtakavarga, 'sav', {}),
            'bhinnashktakavarga': getattr(ashtakavarga, 'bhav', {})
        }
    
    def _extract_dashas_simple(self) -> Dict[str, Any]:
        """Extract dasha periods (simplified)"""
        if not self.current_chart:
            return {}
        
        dashas = self.current_chart.dashas
        upcoming = getattr(dashas, 'upcoming', {})
        
        # Convert to simple format
        simple_dashas = {}
        if 'mahadashas' in upcoming:
            simple_dashas['mahadashas'] = {}
            for lord, md in upcoming['mahadashas'].items():
                simple_dashas['mahadashas'][lord] = {
                    'start': md['start'].isoformat() if hasattr(md['start'], 'isoformat') else str(md['start']),
                    'end': md['end'].isoformat() if hasattr(md['end'], 'isoformat') else str(md['end'])
                }
        
        return simple_dashas
    
    def format_chart_text(self, chart_data: Dict) -> str:
        """Format chart data as readable text"""
        if 'error' in chart_data:
            return f"Error: {chart_data['error']}"
        
        text = []
        text.append(f"{chart_data.get('chart_name', 'Chart').upper()}")
        text.append("=" * 50)
        text.append(f"Chart Type: {chart_data.get('chart_type', 'Unknown')}")
        text.append(f"Signification: {chart_data.get('signification', 'Unknown')}")
        text.append("")
        
        if 'planets' in chart_data:
            text.append("PLANETS")
            text.append("-" * 30)
            for planet in chart_data['planets']:
                if isinstance(planet, dict):
                    text.append(f"{planet.get('name', 'Unknown'):10} | House {planet.get('house', '?'):2} | {planet.get('house_name', 'Unknown'):10} | {planet.get('longitude', 0):6.2f}°")
            text.append("")
        
        if chart_data.get('ascendant'):
            asc = chart_data['ascendant']
            text.append("ASCENDANT")
            text.append("-" * 30)
            text.append(f"House: {asc.get('house', '?')}")
            text.append(f"Sign: {asc.get('house_name', 'Unknown')}")
            text.append(f"Longitude: {asc.get('longitude', 0):.2f}°")
            text.append("")
        
        return "\n".join(text)
    
    def format_kundli_text(self) -> str:
        """Format kundli data as readable text"""
        kundli_data = self.get_kundli()
        
        if 'error' in kundli_data:
            return f"Error: {kundli_data['error']}"
        
        text = []
        text.append("KUNDLI REPORT")
        text.append("=" * 50)
        text.append(f"Name: {kundli_data['birth_details']['name']}")
        text.append(f"Date: {kundli_data['birth_details']['date']}")
        text.append(f"Time: {kundli_data['birth_details']['time']}")
        text.append(f"Place: {kundli_data['birth_details']['place']}")
        text.append(f"Engine: {kundli_data['metadata']['engine']} {kundli_data['metadata']['version']}")
        text.append(f"Ephemeris: {kundli_data['metadata']['ephemeris']}")
        text.append("")
        
        # D1 Chart
        if 'D1' in kundli_data['charts']:
            d1_chart = kundli_data['charts']['D1']
            text.append("D1 CHART (RASI)")
            text.append("-" * 30)
            for planet in d1_chart['planets']:
                text.append(f"{planet['name']:10} | House {planet['house']:2} | {planet['house_name']:10} | {planet['longitude']:6.2f}°")
            text.append("")
        
        # Panchanga
        if 'panchanga' in kundli_data:
            panchanga = kundli_data['panchanga']
            text.append("PANCHANGA")
            text.append("-" * 30)
            text.append(f"Tithi: {panchanga.get('tithi', 'Unknown')}")
            text.append(f"Nakshatra: {panchanga.get('nakshatra', 'Unknown')}")
            text.append(f"Yoga: {panchanga.get('yoga', 'Unknown')}")
            text.append(f"Karana: {panchanga.get('karana', 'Unknown')}")
            text.append(f"Vaara: {panchanga.get('vaara', 'Unknown')}")
            text.append("")
        
        return "\n".join(text)


# For backward compatibility, create an alias
AstroChartAPI = JyotishganitChartAPI