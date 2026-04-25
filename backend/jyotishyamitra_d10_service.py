#!/usr/bin/env python3
"""
Jyotishyamitra D10 Service - Separate D10 chart generation using jyotishyamitra library
"""

import jyotishyamitra
import json

class JyotishyamitraD10Service:
    """
    Service class to generate D10 charts using jyotishyamitra library
    """
    
    def __init__(self):
        """Initialize the service"""
        pass
    
    def generate_d10_chart(self, birth_data):
        """
        Generate D10 chart using jyotishyamitra library
        
        Args:
            birth_data: Dictionary containing birth information
                Required: name, gender, year, month, day, hour, min, place, longitude, latitude, timezone
                Optional: sec
        
        Returns:
            Dictionary containing D10 chart data in normalized format
        """
        try:
            # Clear any previous birth data
            jyotishyamitra.clear_birthdata()
            
            # Input birth data (all parameters must be strings)
            input_data = jyotishyamitra.input_birthdata(
                name=str(birth_data['name']),
                gender=str(birth_data['gender']),
                year=str(birth_data['year']),
                month=str(birth_data['month']),
                day=str(birth_data['day']),
                hour=str(birth_data['hour']),
                min=str(birth_data['min']),
                sec=str(birth_data.get('sec', '0')),
                place=str(birth_data['place']),
                longitude=str(birth_data['longitude']),
                lattitude=str(birth_data['latitude']),
                timezone=str(birth_data['timezone'])
            )
            
            # Validate birth data
            validation_result = jyotishyamitra.validate_birthdata()
            if validation_result != "SUCCESS":
                return {'error': 'Invalid birth data', 'validation_result': validation_result}
            
            # Get validated birth data
            validated_data = jyotishyamitra.get_birthdata()
            
            # Generate astrological data in dictionary format
            astro_data = jyotishyamitra.generate_astrologicalData(
                birthdata=validated_data,
                returnval="ASTRODATA_DICTIONARY"
            )
            
            if astro_data == "INPUT_ERROR":
                return {'error': 'Input error in birth data'}
            
            # Extract D10 chart data
            d10_data = astro_data.get('D10')
            if not d10_data:
                return {'error': 'D10 chart data not found'}
            
            # Normalize D10 data for consistent API response
            normalized_d10 = self._normalize_d10_data(d10_data)
            
            return {
                'success': True,
                'd10_chart': normalized_d10,
                'raw_data': d10_data
            }
            
        except Exception as e:
            return {'error': f'Error generating D10 chart: {str(e)}'}
    
    def _normalize_d10_data(self, d10_data):
        """
        Normalize jyotishyamitra D10 data to consistent format
        
        Args:
            d10_data: Raw D10 data from jyotishyamitra
        
        Returns:
            Normalized D10 data dictionary
        """
        normalized = {
            'chart_info': {
                'name': d10_data.get('name', 'Dasamsa'),
                'symbol': d10_data.get('symbol', 'D10'),
                'type': 'D10',
                'source': 'jyotishyamitra'
            },
            'ascendant': self._normalize_ascendant(d10_data.get('ascendant', {})),
            'houses': self._normalize_houses(d10_data.get('houses', [])),
            'planets': self._normalize_planets(d10_data.get('houses', []))
        }
        
        return normalized
    
    def _normalize_ascendant(self, ascendant_data):
        """Normalize ascendant data"""
        return {
            'name': ascendant_data.get('name', 'Ascendant'),
            'symbol': ascendant_data.get('symbol', 'Asc'),
            'sign': ascendant_data.get('sign', 'Unknown'),
            'rashi': ascendant_data.get('rashi', 'Unknown'),
            'position': ascendant_data.get('pos', {}),
            'nakshatra': ascendant_data.get('nakshatra', 'Unknown'),
            'pada': ascendant_data.get('pada', 0),
            'nakshatra_lord': ascendant_data.get('nak-ruler', 'Unknown'),
            'sign_lord': ascendant_data.get('lagna-lord', 'Unknown')
        }
    
    def _normalize_houses(self, houses_data):
        """Normalize houses data"""
        normalized_houses = {}
        
        for house in houses_data:
            if isinstance(house, dict):
                house_num = house.get('house-num', 0)
                normalized_houses[house_num] = {
                    'number': house_num,
                    'sign': house.get('sign', 'Unknown'),
                    'sign_num': house.get('sign-num', 0),
                    'rashi': house.get('rashi', 'Unknown'),
                    'sign_lord': house.get('sign-lord', 'Unknown'),
                    'planets': house.get('planets', []),
                    'aspect_planets': house.get('aspect-planets', [])
                }
        
        return normalized_houses
    
    def _normalize_planets(self, houses_data):
        """Normalize planets data by extracting from houses"""
        planets = {}
        
        for house in houses_data:
            if isinstance(house, dict):
                house_num = house.get('house-num', 0)
                sign = house.get('sign', 'Unknown')
                planets_in_house = house.get('planets', [])
                
                for planet in planets_in_house:
                    planets[planet] = {
                        'name': planet,
                        'house': house_num,
                        'sign': sign,
                        'chart_type': 'D10'
                    }
        
        return planets

# Singleton instance
d10_service = JyotishyamitraD10Service()

def generate_d10_json(birth_data):
    """
    Convenience function to generate D10 JSON
    
    Args:
        birth_data: Dictionary containing birth information
    
    Returns:
        Dictionary containing D10 chart data
    """
    return d10_service.generate_d10_chart(birth_data)
