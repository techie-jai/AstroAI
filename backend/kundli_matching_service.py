import sys
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
import json
from pathlib import Path
import uuid

# Add PyJHora to path
pyjhora_path = os.path.join(os.path.dirname(__file__), '..', 'PyJHora')
sys.path.insert(0, pyjhora_path)

# Add parent directory to path for jyotishganit_chart_api
parent_path = os.path.join(os.path.dirname(__file__), '..')
sys.path.insert(0, parent_path)

from jhora.horoscope.match.compatibility import Ashtakoota
from jyotishganit_chart_api import JyotishganitChartAPI


class KundliMatchingService:
    """Service for kundli matching using PyJHora's Ashtakoota system"""
    
    # Scoring descriptions for North Indian method
    SCORE_DESCRIPTIONS = {
        'varna_porutham': {
            'name': 'Varna Porutham',
            'max_score': 1,
            'description': 'Caste/Varna compatibility - Social and cultural harmony',
            'interpretation': {
                0: 'Not Matching - Different social backgrounds',
                1: 'Matching - Compatible social backgrounds'
            }
        },
        'vasiya_porutham': {
            'name': 'Vasiya Porutham',
            'max_score': 2.0,
            'description': 'Nature/Temperament compatibility - Behavioral harmony',
            'interpretation': {
                0.0: 'Poor - Very different temperaments',
                0.5: 'Neutral - Some differences',
                1.0: 'Good - Compatible temperaments',
                2.0: 'Perfect - Excellent temperament match'
            }
        },
        'gana_porutham': {
            'name': 'Gana Porutham',
            'max_score': 6,
            'description': 'Personality/Gana compatibility - Mental and emotional harmony',
            'interpretation': {
                0: 'Very Bad - Incompatible personalities',
                1: 'Bad - Significant personality differences',
                3: 'Average - Some personality differences',
                5: 'Good - Compatible personalities',
                6: 'Perfect - Excellent personality match'
            }
        },
        'nakshathra_porutham': {
            'name': 'Nakshathra/Tara Porutham',
            'max_score': 3.0,
            'description': 'Star/Nakshatra compatibility - Destiny and life path harmony',
            'interpretation': {
                0.0: 'Adhamam (Poor) - Incompatible stars',
                1.5: 'Maddhimam (Moderate) - Moderately compatible',
                3.0: 'Utthamam (Excellent) - Highly compatible stars'
            }
        },
        'yoni_porutham': {
            'name': 'Yoni Porutham',
            'max_score': 4,
            'description': 'Sexual/Physical compatibility - Physical and intimate harmony',
            'interpretation': {
                0: 'Worse - Very incompatible',
                1: 'Bad - Incompatible',
                2: 'Neutral - Moderately compatible',
                3: 'Good - Compatible',
                4: 'Perfect - Excellent physical compatibility'
            }
        },
        'raasi_adhipathi_porutham': {
            'name': 'Raasi Adhipathi Porutham',
            'max_score': 5.0,
            'description': 'Moon sign lord compatibility - Emotional and mental harmony',
            'interpretation': {
                0.0: 'Very Bad - Incompatible moon signs',
                0.5: 'Bad - Poor compatibility',
                1.0: 'Below Average - Moderate compatibility',
                3.0: 'Above Average - Good compatibility',
                4.0: 'Good - Very compatible',
                5.0: 'Perfect - Excellent moon sign compatibility'
            }
        },
        'raasi_porutham': {
            'name': 'Raasi/Bahut Porutham',
            'max_score': 7,
            'description': 'Moon sign compatibility - Emotional and family harmony',
            'interpretation': {
                0: 'Not Matching - Incompatible moon signs',
                7: 'Matching - Compatible moon signs'
            }
        },
        'naadi_porutham': {
            'name': 'Naadi Porutham',
            'max_score': 8,
            'description': 'Pulse/Temperament compatibility - Health and vitality harmony',
            'interpretation': {
                0: 'Not Matching - Different pulse types',
                8: 'Matching - Compatible pulse types'
            }
        }
    }
    
    # Naalu Porutham (4 additional checks)
    NAALU_PORUTHAM = {
        'mahendra_porutham': {
            'name': 'Mahendra Porutham',
            'description': 'Boy\'s star should be 4th, 7th, 10th, 13th, 16th, 19th, 22nd, or 25th from girl\'s star',
            'importance': 'Beneficial for marriage'
        },
        'vedha_porutham': {
            'name': 'Vedha Porutham',
            'description': 'Checks if stars create obstacles in the relationship',
            'importance': 'Should be True for good match'
        },
        'rajju_porutham': {
            'name': 'Rajju Porutham',
            'description': 'Checks if body parts (head, neck, stomach, waist, foot) don\'t match between partners',
            'importance': 'Should be True - same body parts indicate conflict'
        },
        'sthree_dheerga_porutham': {
            'name': 'Sthree Dheerga Porutham',
            'description': 'Boy\'s star should be more than 15 positions from girl\'s star',
            'importance': 'Indicates longevity of marriage'
        }
    }
    
    def __init__(self):
        """Initialize matching service"""
        self.api = None
    
    def generate_kundli_for_matching(self, birth_data: Dict, user_folder: str = None) -> Dict:
        """
        Generate kundli using Jyotishganit API with minimal fields for matching
        
        Args:
            birth_data: Dictionary with birth information
            user_folder: Optional user folder path to save kundli
            
        Returns:
            Dictionary with minimal kundli data needed for PyJHora matching
        """
        try:
            api = self._get_fresh_api()
            
            api.set_birth_data(
                name=birth_data.get('name', 'Unknown'),
                place_name=birth_data.get('place_name', ''),
                latitude=birth_data.get('latitude', 0),
                longitude=birth_data.get('longitude', 0),
                timezone_offset=birth_data.get('timezone_offset', 0),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute'),
                second=birth_data.get('second', 0)
            )
            
            # Generate complete kundli
            kundli_data = api.get_kundli()
            
            if 'error' in kundli_data:
                raise ValueError(f"Failed to generate kundli: {kundli_data['error']}")
            
            # Extract minimal fields needed for matching
            jyotishganit_json = kundli_data.get('jyotishganit_json', {})
            panchanga = jyotishganit_json.get('panchanga', {})
            
            # Extract nakshatra and paadham
            nakshatra_str = panchanga.get('nakshatra', '')
            nakshatra_number = self._get_nakshatra_number(nakshatra_str)
            
            moon_data = jyotishganit_json.get('planets', {}).get('Moon', {})
            moon_longitude = moon_data.get('longitude', 0)
            paadham_number = self._get_paadham_from_longitude(moon_longitude, nakshatra_number)
            
            # Create minimal kundli structure for matching
            minimal_kundli = {
                'birth_details': kundli_data.get('birth_details', {}),
                'panchanga': {
                    'nakshatra': nakshatra_str,
                    'nakshatra_number': nakshatra_number,
                    'paadham': paadham_number,
                    'tithi': panchanga.get('tithi', ''),
                    'yoga': panchanga.get('yoga', ''),
                    'karana': panchanga.get('karana', ''),
                    'vaara': panchanga.get('vaara', '')
                },
                'planets': jyotishganit_json.get('planets', {}),
                'generated_at': datetime.now().isoformat(),
                'engine': 'Jyotishganit'
            }
            
            # Save to user folder if provided
            if user_folder:
                kundli_dir = os.path.join(user_folder, 'kundli_matching')
                os.makedirs(kundli_dir, exist_ok=True)
                
                # Save with person's name
                safe_name = birth_data.get('name', 'person').replace(' ', '_').lower()
                kundli_file = os.path.join(kundli_dir, f"{safe_name}.json")
                
                with open(kundli_file, 'w', encoding='utf-8') as f:
                    json.dump(minimal_kundli, f, indent=2, ensure_ascii=False)
            
            return minimal_kundli
            
        except Exception as e:
            raise ValueError(f"Error generating kundli for matching: {str(e)}")
    
    def _get_fresh_api(self):
        """Get a fresh API instance to avoid state caching issues"""
        return JyotishganitChartAPI()
    
    def get_nakshatra_from_birth_data(self, birth_data: Dict) -> Tuple[int, int]:
        """
        Calculate nakshatra and paadham from birth data using Jyotishganit
        
        Args:
            birth_data: Dictionary with birth information
            
        Returns:
            Tuple of (nakshatra_number, paadham_number) where:
            - nakshatra_number: 1-27 (Ashwini to Revati)
            - paadham_number: 1-4 (quarter of nakshatra)
        """
        try:
            api = self._get_fresh_api()
            
            api.set_birth_data(
                name=birth_data.get('name', 'Unknown'),
                place_name=birth_data.get('place_name', ''),
                latitude=birth_data.get('latitude', 0),
                longitude=birth_data.get('longitude', 0),
                timezone_offset=birth_data.get('timezone_offset', 0),
                year=birth_data.get('year'),
                month=birth_data.get('month'),
                day=birth_data.get('day'),
                hour=birth_data.get('hour'),
                minute=birth_data.get('minute'),
                second=birth_data.get('second', 0)
            )
            
            kundli_data = api.get_kundli()
            
            # Extract nakshatra and paadham from kundli data
            if isinstance(kundli_data, dict):
                jyotishganit_json = kundli_data.get('jyotishganit_json', {})
                
                if isinstance(jyotishganit_json, dict):
                    panchanga = jyotishganit_json.get('panchanga', {})
                    
                    # Get nakshatra number (1-27)
                    nakshatra_str = panchanga.get('nakshatra', '')
                    nakshatra_number = self._get_nakshatra_number(nakshatra_str)
                    
                    # Get paadham (1-4) - typically from moon longitude
                    moon_data = jyotishganit_json.get('planets', {}).get('Moon', {})
                    moon_longitude = moon_data.get('longitude', 0)
                    paadham_number = self._get_paadham_from_longitude(moon_longitude, nakshatra_number)
                    
                    return (nakshatra_number, paadham_number)
            
            raise ValueError("Could not extract nakshatra from birth data")
            
        except Exception as e:
            raise ValueError(f"Error calculating nakshatra: {str(e)}")
    
    def _get_nakshatra_number(self, nakshatra_name: str) -> int:
        """Convert nakshatra name to number (1-27)"""
        nakshatras = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigshira", "Ardra", 
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
            "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", 
            "Jyestha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", 
            "Dhanishta", "Satabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ]
        
        # Clean the input - remove extra spaces and special characters
        clean_name = str(nakshatra_name).strip().lower()
        
        for i, nak in enumerate(nakshatras):
            # Try exact match first
            if clean_name == nak.lower():
                return i + 1
            # Try partial match
            if clean_name in nak.lower() or nak.lower() in clean_name:
                return i + 1
        
        # If still not found, try to extract from string like "Ashwini (1)"
        import re
        match = re.search(r'\((\d+)\)', nakshatra_name)
        if match:
            num = int(match.group(1))
            if 1 <= num <= 27:
                return num
        
        # Default to Ashwini if not found
        print(f"[WARNING] Could not identify nakshatra from: {nakshatra_name}, defaulting to Ashwini")
        return 1
    
    def _get_paadham_from_longitude(self, longitude: float, nakshatra_number: int) -> int:
        """
        Calculate paadham (1-4) from moon longitude and nakshatra
        Each nakshatra is 13.33 degrees, divided into 4 paadhams of 3.33 degrees each
        """
        # Normalize longitude to 0-360
        longitude = longitude % 360
        
        # Calculate position within nakshatra
        nakshatra_start = (nakshatra_number - 1) * (360 / 27)
        position_in_nakshatra = (longitude - nakshatra_start) % (360 / 27)
        
        # Determine paadham (1-4)
        paadham_size = (360 / 27) / 4
        paadham = int(position_in_nakshatra / paadham_size) + 1
        
        # Ensure paadham is in range 1-4
        paadham = max(1, min(4, paadham))
        
        return paadham
    
    def calculate_compatibility(
        self,
        boy_data: Dict,
        girl_data: Dict,
        method: str = "North",
        user_folder: str = None
    ) -> Dict:
        """
        Calculate kundli matching compatibility using Ashtakoota system
        
        Args:
            boy_data: Boy's birth data
            girl_data: Girl's birth data
            method: "North" or "South" Indian style
            user_folder: Optional user folder path to save kundlis
            
        Returns:
            Dictionary with complete compatibility results
        """
        try:
            # Generate kundlis using Jyotishganit
            boy_kundli = self.generate_kundli_for_matching(boy_data, user_folder)
            girl_kundli = self.generate_kundli_for_matching(girl_data, user_folder)
            
            # Extract nakshatra and paadham from generated kundlis
            boy_nak = boy_kundli['panchanga']['nakshatra_number']
            boy_pad = boy_kundli['panchanga']['paadham']
            girl_nak = girl_kundli['panchanga']['nakshatra_number']
            girl_pad = girl_kundli['panchanga']['paadham']
            
            # Create Ashtakoota instance
            ashtakoota = Ashtakoota(
                boy_nakshatra_number=boy_nak,
                boy_paadham_number=boy_pad,
                girl_nakshatra_number=girl_nak,
                girl_paadham_number=girl_pad,
                method=method
            )
            
            # Get compatibility scores
            scores = ashtakoota.compatibility_score()
            
            # Parse results based on method
            if 'south' in method.lower():
                # South Indian returns 14 values
                result = {
                    'varna_porutham': scores[0],
                    'vasiya_porutham': scores[1],
                    'gana_porutham': scores[2],
                    'nakshathra_porutham': scores[3],
                    'yoni_porutham': scores[4],
                    'raasi_adhipathi_porutham': scores[5],
                    'raasi_porutham': scores[6],
                    'naadi_porutham': scores[7],
                    'total_score': scores[8],
                    'mahendra_porutham': scores[9],
                    'vedha_porutham': scores[10],
                    'rajju_porutham': scores[11],
                    'sthree_dheerga_porutham': scores[12],
                    'minimum_porutham': scores[13] if len(scores) > 13 else None
                }
            else:
                # North Indian returns 13 values
                result = {
                    'varna_porutham': scores[0],
                    'vasiya_porutham': scores[1],
                    'gana_porutham': scores[2],
                    'nakshathra_porutham': scores[3],
                    'yoni_porutham': scores[4],
                    'raasi_adhipathi_porutham': scores[5],
                    'raasi_porutham': scores[6],
                    'naadi_porutham': scores[7],
                    'total_score': scores[8],
                    'mahendra_porutham': scores[9],
                    'vedha_porutham': scores[10],
                    'rajju_porutham': scores[11],
                    'sthree_dheerga_porutham': scores[12]
                }
            
            # Add metadata
            result['method'] = method
            result['boy_nakshatra'] = boy_nak
            result['boy_paadham'] = boy_pad
            result['girl_nakshatra'] = girl_nak
            result['girl_paadham'] = girl_pad
            result['boy_name'] = boy_data.get('name', 'Boy')
            result['girl_name'] = girl_data.get('name', 'Girl')
            result['timestamp'] = datetime.now().isoformat()
            
            return result
            
        except Exception as e:
            raise ValueError(f"Error calculating compatibility: {str(e)}")
    
    def format_results_for_display(self, compatibility_result: Dict) -> Dict:
        """
        Format compatibility results with descriptions and interpretations
        
        Args:
            compatibility_result: Raw compatibility scores from calculate_compatibility
            
        Returns:
            Formatted results with descriptions and interpretations
        """
        formatted = {
            'boy_name': compatibility_result.get('boy_name'),
            'girl_name': compatibility_result.get('girl_name'),
            'method': compatibility_result.get('method'),
            'total_score': compatibility_result.get('total_score'),
            'max_score': 36 if 'north' in compatibility_result.get('method', 'north').lower() else 10,
            'timestamp': compatibility_result.get('timestamp'),
            'ashtakoota_scores': [],
            'naalu_porutham_checks': [],
            'overall_verdict': self._get_overall_verdict(compatibility_result.get('total_score', 0))
        }
        
        # Format Ashtakoota scores
        ashtakoota_keys = [
            'varna_porutham', 'vasiya_porutham', 'gana_porutham', 'nakshathra_porutham',
            'yoni_porutham', 'raasi_adhipathi_porutham', 'raasi_porutham', 'naadi_porutham'
        ]
        
        for key in ashtakoota_keys:
            score = compatibility_result.get(key, 0)
            desc = self.SCORE_DESCRIPTIONS.get(key, {})
            
            formatted['ashtakoota_scores'].append({
                'key': key,
                'name': desc.get('name', key),
                'score': score,
                'max_score': desc.get('max_score', 1),
                'description': desc.get('description', ''),
                'interpretation': desc.get('interpretation', {}).get(score, 'Unknown')
            })
        
        # Format Naalu Porutham checks
        naalu_keys = ['mahendra_porutham', 'vedha_porutham', 'rajju_porutham', 'sthree_dheerga_porutham']
        
        for key in naalu_keys:
            value = compatibility_result.get(key, False)
            desc = self.NAALU_PORUTHAM.get(key, {})
            
            formatted['naalu_porutham_checks'].append({
                'key': key,
                'name': desc.get('name', key),
                'status': value,
                'description': desc.get('description', ''),
                'importance': desc.get('importance', '')
            })
        
        return formatted
    
    def _get_overall_verdict(self, total_score: float) -> Dict:
        """
        Get overall verdict based on total score
        
        Args:
            total_score: Total compatibility score out of 36
            
        Returns:
            Dictionary with verdict, color, and message
        """
        if total_score >= 30:
            return {
                'verdict': 'Excellent',
                'color': 'green',
                'message': 'Highly compatible match. Very good prospects for a successful marriage.',
                'percentage': int((total_score / 36) * 100)
            }
        elif total_score >= 24:
            return {
                'verdict': 'Good',
                'color': 'blue',
                'message': 'Good compatibility. Positive prospects for marriage with mutual understanding.',
                'percentage': int((total_score / 36) * 100)
            }
        elif total_score >= 18:
            return {
                'verdict': 'Average',
                'color': 'yellow',
                'message': 'Moderate compatibility. Marriage is possible with adjustments and understanding.',
                'percentage': int((total_score / 36) * 100)
            }
        else:
            return {
                'verdict': 'Poor',
                'color': 'red',
                'message': 'Low compatibility. Significant challenges ahead. Consult an astrologer for remedies.',
                'percentage': int((total_score / 36) * 100)
            }
    
    def save_matching_result(self, result: Dict, output_dir: str = None) -> str:
        """
        Save matching result to local file
        
        Args:
            result: Formatted matching result
            output_dir: Directory to save results (default: backend/kundli_matching_results)
            
        Returns:
            Path to saved file
        """
        if output_dir is None:
            output_dir = os.path.join(os.path.dirname(__file__), 'kundli_matching_results')
        
        # Create directory if it doesn't exist
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        boy_name = result.get('boy_name', 'boy').replace(' ', '_')
        girl_name = result.get('girl_name', 'girl').replace(' ', '_')
        filename = f"match_{boy_name}_{girl_name}_{timestamp}.json"
        filepath = os.path.join(output_dir, filename)
        
        # Save to file
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        return filepath
