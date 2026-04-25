import sys
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import hashlib
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from jyotishganit_chart_api import JyotishganitChartAPI
from jyotishyamitra_d10_service import JyotishyamitraD10Service


class AstrologyService:
    """Service for astrology calculations using Jyotishganit"""
    
    def __init__(self):
        """Initialize astrology service with Jyotishganit"""
        # Don't initialize api here - create fresh instance for each request
        # to avoid singleton state issues with JyotishganitChartAPI
        self.api = None
    
    def _get_fresh_api(self):
        """Get a fresh API instance to avoid state caching issues"""
        print(f"[ASTROLOGY] Creating fresh JyotishganitChartAPI instance to avoid singleton state issues")
        return JyotishganitChartAPI()
    
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
    
    @staticmethod
    def _remove_d10_from_comprehensive_json(jyotishganit_json: Dict) -> Dict:
        """
        Remove D10 chart data from comprehensive jyotishganit JSON
        to ensure LLM uses only accurate jyotishyamitra D10 data
        
        Args:
            jyotishganit_json: Original comprehensive JSON from jyotishganit
        
        Returns:
            Filtered JSON without D10 data
        """
        filtered_json = jyotishganit_json.copy()
        
        # Remove D10 from divisionalCharts if present
        if 'divisionalCharts' in filtered_json:
            divisional_charts = filtered_json['divisionalCharts'].copy()
            # Remove D10/d10 entries (handle both cases)
            removed_d10 = divisional_charts.pop('D10', None)
            removed_d10_lower = divisional_charts.pop('d10', None)
            removed_dasamsa = divisional_charts.pop('dasamsa', None)
            removed_dasamsa_upper = divisional_charts.pop('Dasamsa', None)
            filtered_json['divisionalCharts'] = divisional_charts
            
            print(f"[ASTROLOGY] Removed D10 entries: D10={removed_d10 is not None}, d10={removed_d10_lower is not None}")
        
        # Remove any other D10 related data
        filtered_json.pop('d10Chart', None)
        filtered_json.pop('D10Chart', None)
        filtered_json.pop('dasamsaChart', None)
        filtered_json.pop('DasamsaChart', None)
        filtered_json.pop('d10', None)
        filtered_json.pop('D10', None)
        
        return filtered_json
    
    def generate_kundli(self, birth_data: Dict) -> Dict:
        """
        Generate kundli from birth data using Jyotishganit
        
        Args:
            birth_data: Dictionary with birth information
            
        Returns:
            Dictionary with kundli data
        """
        try:
            # Create a fresh API instance for this request to avoid state caching
            api = self._get_fresh_api()
            
            api.set_birth_data(
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
            
            kundli_data = api.get_kundli()
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
            
            # Generate D10 chart using jyotishyamitra_d10_service
            print(f"[ASTROLOGY] Generating D10 chart using jyotishyamitra_d10_service...")
            try:
                # Map birth_data fields to jyotishyamitra format
                jyotishyamitra_birth_data = {
                    'name': birth_data.get('name', 'Unknown'),
                    'gender': birth_data.get('gender', 'M'),  # Default to Male if not provided
                    'year': str(birth_data.get('year', '')),
                    'month': str(birth_data.get('month', '')),
                    'day': str(birth_data.get('day', '')),
                    'hour': str(birth_data.get('hour', '0')),
                    'min': str(birth_data.get('minute', '0')),
                    'sec': str(birth_data.get('second', '0')),
                    'place': birth_data.get('place_name', 'Unknown'),
                    'longitude': str(birth_data.get('longitude', '0')),
                    'latitude': str(birth_data.get('latitude', '0')),
                    'timezone': str(birth_data.get('timezone_offset', '0'))
                }
                
                d10_service = JyotishyamitraD10Service()
                d10_chart_data = d10_service.generate_d10_chart(jyotishyamitra_birth_data)
                d10_chart_data = self._make_serializable(d10_chart_data)
                d10_result = {
                    'success': True,
                    'd10_chart': d10_chart_data,
                    'raw_data': d10_chart_data
                }
                print(f"[ASTROLOGY] D10 chart generated successfully using jyotishyamitra")
            except Exception as d10_error:
                print(f"[ASTROLOGY] D10 generation failed with jyotishyamitra: {str(d10_error)}")
                print(f"[ASTROLOGY] Falling back to JyotishganitChartAPI...")
                try:
                    d10_chart_data = api.get_chart('D10')
                    d10_chart_data = self._make_serializable(d10_chart_data)
                    d10_result = {
                        'success': True,
                        'd10_chart': d10_chart_data,
                        'raw_data': d10_chart_data
                    }
                    print(f"[ASTROLOGY] D10 chart generated successfully using JyotishganitChartAPI fallback")
                except Exception as fallback_error:
                    print(f"[ASTROLOGY] D10 generation failed with fallback: {str(fallback_error)}")
                    d10_result = {
                        'success': False,
                        'error': str(fallback_error),
                        'd10_chart': {},
                        'raw_data': {}
                    }
            
            # Filter out D10 data from comprehensive jyotishganit JSON
            original_jyotishganit_json = kundli_data.get('jyotishganit_json', {})
            filtered_jyotishganit_json = self._remove_d10_from_comprehensive_json(original_jyotishganit_json)
            
            # Create the final kundli data structure
            final_kundli_data = {
                'horoscope_info': horoscope_info,
                'birth_details': kundli_data.get('birth_details', {}),
                'metadata': kundli_data.get('metadata', {}),
                'jyotishganit_json': filtered_jyotishganit_json,  # Filtered JSON without D10
                'd10_chart': d10_result.get('d10_chart', {}) if d10_result.get('success') else {},
                'd10_raw': d10_result.get('raw_data', {}) if d10_result.get('success') else {}
            }
            
            # Debug: Log the structure and D10 filtering
            print(f"[ASTROLOGY] Kundli data keys: {list(final_kundli_data.keys())}")
            print(f"[ASTROLOGY] horoscope_info keys: {list(horoscope_info.keys())}")
            print(f"[ASTROLOGY] horoscope_info data points: {sum(len(v) if isinstance(v, (list, dict)) else 1 for v in horoscope_info.values())}")
            print(f"[ASTROLOGY] D10 chart generation: {'Success' if d10_result.get('success') else 'Failed'}")
            
            # Log D10 filtering
            original_div_charts = original_jyotishganit_json.get('divisionalCharts', {})
            filtered_div_charts = filtered_jyotishganit_json.get('divisionalCharts', {})
            print(f"[ASTROLOGY] Original divisional charts: {list(original_div_charts.keys())}")
            print(f"[ASTROLOGY] Filtered divisional charts: {list(filtered_div_charts.keys())}")
            print(f"[ASTROLOGY] D10 removed from comprehensive JSON: {'D10' in original_div_charts and 'D10' not in filtered_div_charts}")
            
            return {
                'success': True,
                'kundli_id': self._generate_kundli_id(birth_data),
                'data': final_kundli_data,
                'd10_chart': d10_result,
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
            # Create a fresh API instance for this request to avoid state caching
            api = self._get_fresh_api()
            
            api.set_birth_data(
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
                chart_data = api.get_chart(chart_type)
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
            # Create a fresh API instance for this request to avoid state caching
            api = self._get_fresh_api()
            
            api.set_birth_data(
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
            
            planet = api.get_planet_in_house(chart_type, planet_name)
            
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
            # Create a fresh API instance for this request to avoid state caching
            api = self._get_fresh_api()
            
            api.set_birth_data(
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
            
            planets = api.get_planets_in_house(chart_type, house_number)
            
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
            # Create a fresh API instance for this request to avoid state caching
            api = self._get_fresh_api()
            
            api.set_birth_data(
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
            
            api.get_kundli()
            text = api.format_kundli_text()
            
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
            # Create a fresh API instance for this request to avoid state caching
            api = self._get_fresh_api()
            
            api.set_birth_data(
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
            
            chart_data = api.get_chart(chart_type)
            text = api.format_chart_text(chart_data)
            
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
