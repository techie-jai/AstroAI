import sys
import os
from typing import Dict, List, Optional
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from astro_chart_api import AstroChartAPI


class AstrologyService:
    """Service for astrology calculations"""
    
    def __init__(self):
        """Initialize astrology service"""
        self.api = AstroChartAPI()
    
    def generate_kundli(self, birth_data: Dict) -> Dict:
        """
        Generate kundli from birth data
        
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
            
            return {
                'success': True,
                'kundli_id': self._generate_kundli_id(birth_data),
                'data': kundli_data,
                'generated_at': datetime.now().isoformat()
            }
        except Exception as e:
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
            
            charts = self.api.get_multiple_charts(chart_types)
            
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
            
            text = self.api.format_chart_text(chart_type)
            
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
