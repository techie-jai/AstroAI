import sys
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import hashlib
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from jyotishganit_chart_api import JyotishganitChartAPI


class AstrologyService:
    """Service for astrology calculations using Jyotishganit"""
    
    def __init__(self):
        """Initialize astrology service with Jyotishganit"""
        self.api = JyotishganitChartAPI()
    
    @staticmethod
    def _make_serializable(obj: Any) -> Any:
        """Convert non-JSON-serializable objects to serializable format"""
        if isinstance(obj, dict):
            return {k: AstrologyService._make_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, (list, tuple)):
            return [AstrologyService._make_serializable(item) for item in obj]
        elif isinstance(obj, datetime):
            return obj.isoformat()
        elif hasattr(obj, '__dict__'):
            # Convert custom objects to dictionaries
            try:
                return str(obj)
            except:
                return repr(obj)
        else:
            return obj
    
    def generate_kundli(self, birth_data: Dict) -> Dict:
        """
        Generate kundli from birth data using Jyotishganit
        
        Args:
            birth_data: Dictionary with birth information
            
        Returns:
            Dictionary with kundli data
        """
        try:
            self.api.set_birth_data(
                name=birth_data.get('name'),
                place_name=birth_data.get('place_name'),
                latitude=birth_data.get('latitude'),
                longitude=birth_data.get('longitude'),
                timezone_offset=birth_data.get('timezone_offset'),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute'),
                second=birth_data.get('second', 0)
            )
            
            kundli_data = self.api.get_kundli()
            # Make kundli data JSON serializable
            kundli_data = self._make_serializable(kundli_data)
            
            # Extract horoscope_info from jyotishganit_json
            horoscope_info = {}
            print(f"[ASTROLOGY] kundli_data type: {type(kundli_data)}")
            print(f"[ASTROLOGY] kundli_data keys: {list(kundli_data.keys()) if isinstance(kundli_data, dict) else 'Not a dict'}")
            
            if isinstance(kundli_data, dict):
                # Get the jyotishganit_json which contains all the astrological data
                jyotishganit_json = kundli_data.get('jyotishganit_json', {})
                print(f"[ASTROLOGY] jyotishganit_json type: {type(jyotishganit_json)}")
                print(f"[ASTROLOGY] jyotishganit_json keys: {list(jyotishganit_json.keys()) if isinstance(jyotishganit_json, dict) else 'Not a dict'}")
                
                # Extract key astrological information from jyotishganit_json
                if isinstance(jyotishganit_json, dict):
                    # Extract panchanga (tithi, nakshatra, yoga, karana, vaara)
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
                    
                    # Extract D1 Chart data (houses and planets)
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
                
                # Also include top-level data if available
                if 'ashtakavarga' in kundli_data:
                    horoscope_info['ashtakavarga'] = kundli_data['ashtakavarga']
                if 'dashas' in kundli_data:
                    horoscope_info['dashas'] = kundli_data['dashas']
            
            # Create the final kundli data structure
            final_kundli_data = {
                'horoscope_info': horoscope_info,
                'birth_details': kundli_data.get('birth_details', {}),
                'metadata': kundli_data.get('metadata', {}),
                'jyotishganit_json': kundli_data.get('jyotishganit_json', {})
            }
            
            # Debug: Log the structure of horoscope_info
            print(f"[ASTROLOGY] Kundli data keys: {list(final_kundli_data.keys())}")
            print(f"[ASTROLOGY] horoscope_info keys: {list(horoscope_info.keys())}")
            print(f"[ASTROLOGY] horoscope_info data points: {sum(len(v) if isinstance(v, (list, dict)) else 1 for v in horoscope_info.values())}")
            
            return {
                'success': True,
                'kundli_id': self._generate_kundli_id(birth_data),
                'data': final_kundli_data,
                'generated_at': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"[ASTROLOGY] Error in generate_kundli: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_charts(self, birth_data: Dict, chart_types: List[str] = None) -> Dict:
        """
        Generate divisional charts
        
        Args:
            birth_data: Dictionary with birth information
            chart_types: List of chart types to generate (e.g., ['D1', 'D9', 'D10'])
            
        Returns:
            Dictionary with chart data
        """
        if chart_types is None:
            chart_types = ['D1', 'D7', 'D9', 'D10']
        
        try:
            self.api.set_birth_data(
                name=birth_data.get('name'),
                place_name=birth_data.get('place_name'),
                latitude=birth_data.get('latitude'),
                longitude=birth_data.get('longitude'),
                timezone_offset=birth_data.get('timezone_offset'),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute'),
                second=birth_data.get('second', 0)
            )
            
            charts = {}
            for chart_type in chart_types:
                chart_data = self.api.get_chart(chart_type)
                # Make chart data JSON serializable
                charts[chart_type] = self._make_serializable(chart_data)
            
            return {
                'success': True,
                'charts': charts,
                'generated_at': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_planet_position(self, birth_data: Dict, chart_type: str, planet_name: str) -> Dict:
        """
        Get specific planet position in a chart
        
        Args:
            birth_data: Dictionary with birth information
            chart_type: Chart type (e.g., 'D1', 'D9')
            planet_name: Planet name (e.g., 'Sun', 'Moon')
            
        Returns:
            Dictionary with planet position
        """
        try:
            self.api.set_birth_data(
                name=birth_data.get('name'),
                place_name=birth_data.get('place_name'),
                latitude=birth_data.get('latitude'),
                longitude=birth_data.get('longitude'),
                timezone_offset=birth_data.get('timezone_offset'),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute'),
                second=birth_data.get('second', 0)
            )
            
            planet = self.api.get_planet_in_house(chart_type, planet_name)
            
            if planet:
                return {
                    'success': True,
                    'planet': planet
                }
            else:
                return {
                    'success': False,
                    'error': f"Planet {planet_name} not found in {chart_type}"
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_planets_in_house(self, birth_data: Dict, chart_type: str, house_number: int) -> Dict:
        """
        Get all planets in a specific house
        
        Args:
            birth_data: Dictionary with birth information
            chart_type: Chart type (e.g., 'D1', 'D9')
            house_number: House number (1-12)
            
        Returns:
            Dictionary with planets in house
        """
        try:
            self.api.set_birth_data(
                name=birth_data.get('name'),
                place_name=birth_data.get('place_name'),
                latitude=birth_data.get('latitude'),
                longitude=birth_data.get('longitude'),
                timezone_offset=birth_data.get('timezone_offset'),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute'),
                second=birth_data.get('second', 0)
            )
            
            planets = self.api.get_planets_in_house(chart_type, house_number)
            
            return {
                'success': True,
                'planets': planets,
                'house': house_number
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def format_kundli_text(self, birth_data: Dict) -> Dict:
        """
        Get formatted kundli text
        
        Args:
            birth_data: Dictionary with birth information
            
        Returns:
            Dictionary with formatted text
        """
        try:
            self.api.set_birth_data(
                name=birth_data.get('name'),
                place_name=birth_data.get('place_name'),
                latitude=birth_data.get('latitude'),
                longitude=birth_data.get('longitude'),
                timezone_offset=birth_data.get('timezone_offset'),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute'),
                second=birth_data.get('second', 0)
            )
            
            self.api.get_kundli()
            text = self.api.format_kundli_text()
            
            return {
                'success': True,
                'text': text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def format_chart_text(self, birth_data: Dict, chart_type: str = 'D1') -> Dict:
        """
        Get formatted chart text
        
        Args:
            birth_data: Dictionary with birth information
            chart_type: Chart type
            
        Returns:
            Dictionary with formatted text
        """
        try:
            self.api.set_birth_data(
                name=birth_data.get('name'),
                place_name=birth_data.get('place_name'),
                latitude=birth_data.get('latitude'),
                longitude=birth_data.get('longitude'),
                timezone_offset=birth_data.get('timezone_offset'),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute'),
                second=birth_data.get('second', 0)
            )
            
            chart_data = self.api.get_chart(chart_type)
            text = self.api.format_chart_text(chart_data)
            
            return {
                'success': True,
                'text': text,
                'chart_type': chart_type
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def _generate_kundli_id(birth_data: Dict) -> str:
        """Generate unique kundli ID from birth data"""
        import hashlib
        key = f"{birth_data['name']}{birth_data['year']}{birth_data['month']}{birth_data['day']}{birth_data['hour']}{birth_data['minute']}"
        return hashlib.md5(key.encode()).hexdigest()[:12]
