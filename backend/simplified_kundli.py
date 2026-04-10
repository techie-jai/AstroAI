"""
Simplified Kundli Generation - Single Source of Truth
Generates one comprehensive Kundli file per user and uses it everywhere
"""

import os
import sys
import json
import hashlib
from datetime import datetime
from typing import Dict, Any
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from jyotishganit_chart_api import JyotishganitChartAPI


class SimplifiedKundliGenerator:
    """Generate and manage single comprehensive Kundli file per user"""
    
    def __init__(self):
        self.api = JyotishganitChartAPI()
        self.kundli_base_dir = Path(__file__).parent.parent / "users"
        
    def _make_serializable(self, obj: Any) -> Any:
        """Convert non-JSON-serializable objects to serializable format"""
        if isinstance(obj, dict):
            return {k: self._make_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, (list, tuple)):
            return [self._make_serializable(item) for item in obj]
        elif isinstance(obj, datetime):
            return obj.isoformat()
        elif hasattr(obj, '__dict__'):
            try:
                return str(obj)
            except:
                return repr(obj)
        else:
            return obj
    
    def generate_comprehensive_kundli(self, birth_data: Dict) -> Dict:
        """
        Generate single comprehensive Kundli file with all data
        
        Args:
            birth_data: Dictionary with birth information
            
        Returns:
            Dictionary with complete Kundli data and file path
        """
        try:
            # Set birth data for Jyotishganit
            self.api.set_birth_data(
                name=birth_data.get('name'),
                place_name=birth_data.get('place'),
                latitude=birth_data.get('latitude'),
                longitude=birth_data.get('longitude'),
                timezone_offset=birth_data.get('timezone_offset', 5.5),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute')
            )
            
            # Generate complete kundli data
            kundli_data = self.api.get_kundli()
            
            # Make serializable
            kundli_data = self._make_serializable(kundli_data)
            
            # Extract horoscope info from jyotishganit_json
            jyotishganit_json = kundli_data.get('jyotishganit_json', {})
            horoscope_info = {}
            
            # Extract key astrological information from jyotishganit_json
            if 'd1Chart' in jyotishganit_json:
                d1_chart = jyotishganit_json['d1Chart']
                if 'houses' in d1_chart:
                    houses = d1_chart['houses']
                    # Extract house information and planetary placements
                    for house in houses:
                        if isinstance(house, dict):
                            house_num = house.get('number', 0)
                            house_sign = house.get('sign', 'Unknown')
                            house_lord = house.get('lord', 'Unknown')
                            
                            # Store house information
                            horoscope_info[f'house_{house_num}_sign'] = house_sign
                            horoscope_info[f'house_{house_num}_lord'] = house_lord
                            
                            # Extract planetary placements from occupants
                            occupants = house.get('occupants', [])
                            for occupant in occupants:
                                if isinstance(occupant, dict):
                                    planet_name = occupant.get('celestialBody', occupant.get('name', 'Unknown'))
                                    planet_sign = occupant.get('sign', 'Unknown')
                                    planet_house = occupant.get('house', house_num)
                                    planet_nakshatra = occupant.get('nakshatra', 'Unknown')
                                    
                                    # Store planetary placements
                                    horoscope_info[f'{planet_name}_sign'] = planet_sign
                                    horoscope_info[f'{planet_name}_house'] = planet_house
                                    horoscope_info[f'{planet_name}_nakshatra'] = planet_nakshatra
                                    
                                    # Store detailed planetary info
                                    horoscope_info[f'{planet_name}_degrees'] = occupant.get('signDegrees', 0)
                                    horoscope_info[f'{planet_name}_pada'] = occupant.get('pada', 0)
                                    horoscope_info[f'{planet_name}_motion'] = occupant.get('motion_type', 'direct')
                                    
                                    # Extract planetary aspects (CRITICAL for predictions)
                                    aspects = occupant.get('aspects', {})
                                    if aspects and 'gives' in aspects:
                                        aspect_list = aspects['gives']
                                        for i, aspect in enumerate(aspect_list):
                                            if isinstance(aspect, dict):
                                                target_house = aspect.get('to_house')
                                                target_planet = aspect.get('to_planet')
                                                aspect_type = aspect.get('aspect_type')
                                                
                                                if target_house:
                                                    horoscope_info[f'{planet_name}_aspect_{i+1}_to_house_{target_house}'] = aspect_type
                                                if target_planet:
                                                    horoscope_info[f'{planet_name}_aspect_{i+1}_to_planet_{target_planet}'] = aspect_type
                                    
                                    # Extract planetary conjunctions (Very Important)
                                    conjuncts = occupant.get('conjuncts', [])
                                    if conjuncts:
                                        for i, conjunct_planet in enumerate(conjuncts):
                                            horoscope_info[f'{planet_name}_conjunct_{i+1}'] = conjunct_planet
                                    
                                    # Extract planetary dignities (Essential for strength)
                                    dignities = occupant.get('dignities', {})
                                    if dignities:
                                        horoscope_info[f'{planet_name}_dignity'] = dignities.get('dignity', 'Unknown')
                                        horoscope_info[f'{planet_name}_tattva'] = dignities.get('planetTattva', 'Unknown')
                                        horoscope_info[f'{planet_name}_rashi_tattva'] = dignities.get('rashiTattva', 'Unknown')
                                        friendly_tattvas = dignities.get('friendlyTattvas', [])
                                        if friendly_tattvas:
                                            horoscope_info[f'{planet_name}_friendly_tattvas'] = ', '.join(friendly_tattvas)
                                    
                                    # Extract lordship information
                                    lordship_houses = occupant.get('hasLordshipHouses', [])
                                    if lordship_houses:
                                        horoscope_info[f'{planet_name}_lordship_houses'] = ', '.join(map(str, lordship_houses))
                        
                        # Extract house-level data
                        bhava_bala = house.get('bhavaBala', 0)
                        if bhava_bala:
                            horoscope_info[f'house_{house_num}_bhava_bala'] = bhava_bala
                        
                        # Extract house purposes
                        purposes = house.get('purposes', [])
                        if purposes:
                            horoscope_info[f'house_{house_num}_purposes'] = ', '.join(purposes)
                        
                        # Extract aspects received by house
                        aspects_received = house.get('aspectsReceived', [])
                        if aspects_received:
                            for i, aspect in enumerate(aspects_received):
                                if isinstance(aspect, dict):
                                    aspecting_planet = aspect.get('aspecting_planet')
                                    aspect_type = aspect.get('aspect_type')
                                    if aspecting_planet:
                                        horoscope_info[f'house_{house_num}_aspect_{i+1}_from_{aspecting_planet}'] = aspect_type
                
                # Extract ascendant (Lagna) - first house sign
                if houses and len(houses) > 0:
                    first_house = houses[0]
                    if isinstance(first_house, dict):
                        ascendant_sign = first_house.get('sign', 'Unknown')
                        horoscope_info['ascendant'] = ascendant_sign
                        horoscope_info['lagna'] = ascendant_sign  # Alternative name
                        horoscope_info['ascendant_lord'] = first_house.get('lord', 'Unknown')
            
            # Extract panchanga information
            if 'panchanga' in jyotishganit_json:
                panchanga = jyotishganit_json['panchanga']
                horoscope_info.update({
                    'tithi': panchanga.get('tithi', 'Unknown'),
                    'nakshatra': panchanga.get('nakshatra', 'Unknown'),
                    'yoga': panchanga.get('yoga', 'Unknown'),
                    'karana': panchanga.get('karana', 'Unknown'),
                    'vaara': panchanga.get('vaara', 'Unknown')
                })
            
            # Extract ayanamsa
            if 'ayanamsa' in jyotishganit_json:
                ayanamsa = jyotishganit_json['ayanamsa']
                horoscope_info['ayanamsa_name'] = ayanamsa.get('name', 'Unknown')
                horoscope_info['ayanamsa_value'] = ayanamsa.get('value', 0)
            
            # Add ashtakavarga and dashas if available
            if 'ashtakavarga' in kundli_data:
                horoscope_info['ashtakavarga'] = kundli_data['ashtakavarga']
            if 'dashas' in kundli_data:
                horoscope_info['dashas'] = kundli_data['dashas']
            
            # Extract divisional charts (D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60)
            divisional_charts = jyotishganit_json.get('divisionalCharts', {})
            if divisional_charts:
                for chart_name, chart_data in divisional_charts.items():
                    if isinstance(chart_data, dict):
                        # Extract ascendant for each divisional chart
                        ascendant = chart_data.get('ascendant', {})
                        if ascendant:
                            ascendant_sign = ascendant.get('sign', 'Unknown')
                            d1_placement = ascendant.get('d1HousePlacement', 0)
                            horoscope_info[f'{chart_name}_ascendant'] = ascendant_sign
                            horoscope_info[f'{chart_name}_ascendant_d1_house'] = d1_placement
                        
                        # Extract planetary placements in divisional chart
                        houses = chart_data.get('houses', [])
                        for house in houses:
                            if isinstance(house, dict):
                                house_num = house.get('number', 0)
                                house_sign = house.get('sign', 'Unknown')
                                house_lord = house.get('lord', 'Unknown')
                                d1_placement = house.get('d1HousePlacement', 0)
                                
                                # Store divisional chart house info
                                horoscope_info[f'{chart_name}_house_{house_num}_sign'] = house_sign
                                horoscope_info[f'{chart_name}_house_{house_num}_lord'] = house_lord
                                horoscope_info[f'{chart_name}_house_{house_num}_d1_placement'] = d1_placement
                                
                                # Extract planetary placements in divisional chart
                                occupants = house.get('occupants', [])
                                for occupant in occupants:
                                    if isinstance(occupant, dict):
                                        planet_name = occupant.get('celestialBody', 'Unknown')
                                        planet_sign = occupant.get('sign', 'Unknown')
                                        planet_d1_placement = occupant.get('d1HousePlacement', 0)
                                        
                                        # Store divisional chart planetary placements
                                        horoscope_info[f'{chart_name}_{planet_name}_sign'] = planet_sign
                                        horoscope_info[f'{chart_name}_{planet_name}_d1_house'] = planet_d1_placement
                                        horoscope_info[f'{chart_name}_{planet_name}_divisional_house'] = house_num
            
            # Create comprehensive structure
            comprehensive_kundli = {
                "horoscope_info": horoscope_info,
                "birth_details": kundli_data.get('birth_details', {
                    "name": birth_data.get('name'),
                    "date": f"{birth_data.get('year')}-{birth_data.get('month'):02d}-{birth_data.get('day'):02d}",
                    "time": f"{birth_data.get('hour'):02d}:{birth_data.get('minute'):02d}:00",
                    "place": birth_data.get('place'),
                    "latitude": birth_data.get('latitude'),
                    "longitude": birth_data.get('longitude'),
                    "timezone": birth_data.get('timezone_offset', 5.5)
                }),
                "charts": kundli_data.get('charts', {}),
                "jyotishganit_json": jyotishganit_json,
                "metadata": kundli_data.get('metadata', {
                    "generated_at": datetime.now().isoformat(),
                    "engine": "Jyotishganit",
                    "version": "0.1.2",
                    "calculation_type": "Professional Vedic Astrology"
                })
            }
            
            # Generate unique ID - use same format as will be stored
            id_string = f"{birth_data['name']}_{birth_data['year']}_{birth_data['month']:02d}_{birth_data['day']:02d}_{birth_data['hour']:02d}_{birth_data['minute']:02d}"
            kundli_id = hashlib.md5(id_string.encode()).hexdigest()[:12]
            
            # Create user directory
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = f"{timestamp}_{hashlib.md5(str(birth_data).encode()).hexdigest()[:8]}"
            user_dir = self.kundli_base_dir / f"{unique_id}-{birth_data.get('name', 'user').replace(' ', '_')}"
            user_dir.mkdir(parents=True, exist_ok=True)
            
            # Save comprehensive Kundli file
            kundli_filename = f"{birth_data.get('name', 'user').replace(' ', '_')}_Kundli.json"
            kundli_file_path = user_dir / "kundli" / kundli_filename
            kundli_file_path.parent.mkdir(exist_ok=True)
            
            with open(kundli_file_path, 'w', encoding='utf-8') as f:
                json.dump(comprehensive_kundli, f, indent=2, ensure_ascii=False)
            
            return {
                "success": True,
                "kundli_id": kundli_id,
                "unique_id": unique_id,
                "kundli_file_path": str(kundli_file_path),
                "user_directory": str(user_dir),
                "comprehensive_kundli": comprehensive_kundli
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def load_kundli(self, kundli_id: str) -> Dict:
        """
        Load comprehensive Kundli by ID
        
        Args:
            kundli_id: Unique Kundli identifier
            
        Returns:
            Comprehensive Kundli data or error
        """
        try:
            # Search for Kundli file by ID - check latest files first
            user_dirs = sorted(self.kundli_base_dir.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True)
            
            for user_dir in user_dirs:
                if user_dir.is_dir():
                    kundli_dir = user_dir / "kundli"
                    if kundli_dir.exists():
                        for kundli_file in kundli_dir.glob("*.json"):
                            try:
                                with open(kundli_file, 'r', encoding='utf-8') as f:
                                    kundli_data = json.load(f)
                                
                                # Check if this file contains the expected kundli_id in metadata
                                # or try to match by checking if the file was recently created
                                file_mtime = kundli_file.stat().st_mtime
                                current_time = __import__('time').time()
                                
                                # If file was created in the last 10 minutes, assume it's the one
                                if current_time - file_mtime < 600:  # 10 minutes
                                    # Verify by checking if the birth details match expected pattern
                                    birth_details = kundli_data.get('birth_details', {})
                                    if birth_details:
                                        # Generate ID to verify
                                        name = birth_details.get('name', '')
                                        date_parts = birth_details.get('date', '2000-01-01').split('-')
                                        time_parts = birth_details.get('time', '12:00:00').split(':')
                                        
                                        if len(date_parts) >= 3 and len(time_parts) >= 2:
                                            id_string = f"{name}_{date_parts[0]}_{date_parts[1]}_{date_parts[2]}_{time_parts[0]}_{time_parts[1]}"
                                            generated_id = hashlib.md5(id_string.encode()).hexdigest()[:12]
                                            
                                            if generated_id == kundli_id:
                                                return {
                                                    "success": True,
                                                    "kundli_id": kundli_id,
                                                    "kundli_data": kundli_data,
                                                    "file_path": str(kundli_file)
                                                }
                            except Exception:
                                continue
            
            return {
                "success": False,
                "error": f"Kundli with ID {kundli_id} not found"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_kundli_for_llm(self, kundli_id: str) -> Dict:
        """
        Get Kundli data formatted for LLM consumption
        
        Args:
            kundli_id: Unique Kundli identifier
            
        Returns:
            Formatted Kundli data for LLM
        """
        result = self.load_kundli(kundli_id)
        if not result.get('success'):
            return result
        
        kundli_data = result['kundli_data']
        
        # Extract key information for LLM
        llm_data = {
            "birth_details": kundli_data.get('birth_details', {}),
            "horoscope_info": kundli_data.get('horoscope_info', {}),
            "charts": kundli_data.get('charts', {}),
            "key_insights": {
                "ascendant": kundli_data.get('horoscope_info', {}).get('house_1_sign'),
                "sun_sign": kundli_data.get('horoscope_info', {}).get('sun_sign'),
                "moon_sign": kundli_data.get('horoscope_info', {}).get('moon_sign'),
                "nakshatra": kundli_data.get('horoscope_info', {}).get('nakshatra')
            }
        }
        
        return {
            "success": True,
            "kundli_id": kundli_id,
            "llm_data": llm_data
        }


# Global instance
kundli_generator = SimplifiedKundliGenerator()
