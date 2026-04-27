import json
import logging
import re
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class KundliFactsExtractor:
    """
    Extracts immutable astrological facts from kundli data and AI responses.
    Stores core facts that persist across conversations.
    """
    
    # Core facts to extract (immutable)
    CORE_FACTS = [
        "mahadasha", "antardasha", "doshas_present",
        "sun_sign", "moon_sign", "major_planets"
    ]
    
    def __init__(self):
        """Initialize extractor"""
        pass
    
    def extract_facts_from_kundli(self, kundli_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract core facts directly from kundli data.
        
        Args:
            kundli_data: Complete kundli data
            
        Returns:
            Dictionary with extracted facts
        """
        facts = {
            "mahadasha": None,
            "antardasha": None,
            "doshas_present": [],
            "sun_sign": None,
            "moon_sign": None,
            "major_planets": {},
            "extracted_at": datetime.now().isoformat(),
            "extracted_from_messages": 0
        }
        
        try:
            # Extract current Mahadasha and Antardasha
            horoscope_info = kundli_data.get("horoscope_info", {})
            dashas = horoscope_info.get("dashas", {})
            
            if dashas:
                mahadasha = dashas.get("mahadasha", {})
                antardasha = dashas.get("antardasha", {})
                
                facts["mahadasha"] = f"{mahadasha.get('planet', 'Unknown')} ({mahadasha.get('start_date', '')} to {mahadasha.get('end_date', '')})"
                facts["antardasha"] = f"{antardasha.get('planet', 'Unknown')} ({antardasha.get('start_date', '')} to {antardasha.get('end_date', '')})"
            
            # Extract Sun and Moon signs
            facts["sun_sign"] = horoscope_info.get("sun_sign", None)
            facts["moon_sign"] = horoscope_info.get("moon_sign", None)
            
            # Extract major planet positions
            planets = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"]
            for planet in planets:
                sign_key = f"{planet}_sign"
                house_key = f"{planet}_house"
                
                if sign_key in horoscope_info:
                    sign = horoscope_info.get(sign_key, "Unknown")
                    house = horoscope_info.get(house_key, "Unknown")
                    facts["major_planets"][planet] = f"{sign} (House {house})"
            
            logger.info(f"[FACTS_EXTRACTOR] Extracted facts from kundli: {len(facts['major_planets'])} planets")
            return facts
        
        except Exception as e:
            logger.error(f"[FACTS_EXTRACTOR] Error extracting facts from kundli: {str(e)}")
            return facts
    
    def extract_doshas_from_analysis(self, analysis_response: Dict[str, Any]) -> List[str]:
        """
        Extract doshas from analysis response.
        
        Args:
            analysis_response: Analysis response from dosha analysis endpoint
            
        Returns:
            List of doshas present
        """
        doshas = []
        
        try:
            major_doshas = analysis_response.get("major_doshas", [])
            
            for dosha in major_doshas:
                if dosha.get("is_present", False) and not dosha.get("is_cancelled", False):
                    doshas.append(dosha.get("name", "Unknown"))
            
            logger.debug(f"[FACTS_EXTRACTOR] Extracted {len(doshas)} doshas from analysis")
            return doshas
        
        except Exception as e:
            logger.error(f"[FACTS_EXTRACTOR] Error extracting doshas: {str(e)}")
            return doshas
    
    def extract_facts_from_response(
        self,
        ai_response: str,
        existing_facts: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Extract astrological facts mentioned in AI response.
        Looks for specific patterns and keywords.
        
        Args:
            ai_response: AI response text
            existing_facts: Existing facts to merge with
            
        Returns:
            Updated facts dictionary
        """
        facts = existing_facts or {
            "mahadasha": None,
            "antardasha": None,
            "doshas_present": [],
            "sun_sign": None,
            "moon_sign": None,
            "major_planets": {},
            "extracted_at": datetime.now().isoformat(),
            "extracted_from_messages": 0
        }
        
        try:
            response_lower = ai_response.lower()
            
            # Extract Mahadasha mentions
            mahadasha_pattern = r"(\w+)\s+mahadasha"
            mahadasha_matches = re.findall(mahadasha_pattern, response_lower)
            if mahadasha_matches:
                facts["mahadasha"] = mahadasha_matches[0].capitalize()
            
            # Extract Antardasha mentions
            antardasha_pattern = r"(\w+)\s+antardasha"
            antardasha_matches = re.findall(antardasha_pattern, response_lower)
            if antardasha_matches:
                facts["antardasha"] = antardasha_matches[0].capitalize()
            
            # Extract dosha mentions
            doshas_to_check = [
                "mangal dosha", "kaal sarp dosha", "pitra dosha",
                "guru chandal dosha", "kemadruma dosha", "grahan dosha",
                "vish dosha", "gandmool dosha"
            ]
            
            for dosha in doshas_to_check:
                if dosha in response_lower:
                    dosha_name = " ".join([word.capitalize() for word in dosha.split()])
                    if dosha_name not in facts["doshas_present"]:
                        facts["doshas_present"].append(dosha_name)
            
            # Extract sign mentions
            signs = [
                "aries", "taurus", "gemini", "cancer", "leo", "virgo",
                "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
            ]
            
            for sign in signs:
                if f"sun sign {sign}" in response_lower or f"sun in {sign}" in response_lower:
                    facts["sun_sign"] = sign.capitalize()
                
                if f"moon sign {sign}" in response_lower or f"moon in {sign}" in response_lower:
                    facts["moon_sign"] = sign.capitalize()
            
            # Extract planet mentions
            planets = ["mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"]
            for planet in planets:
                for sign in signs:
                    pattern = f"{planet}.*{sign}|{sign}.*{planet}"
                    if re.search(pattern, response_lower):
                        if planet not in facts["major_planets"]:
                            facts["major_planets"][planet] = sign.capitalize()
            
            facts["extracted_at"] = datetime.now().isoformat()
            
            logger.debug(f"[FACTS_EXTRACTOR] Extracted facts from response: {len(facts['doshas_present'])} doshas, {len(facts['major_planets'])} planets")
            return facts
        
        except Exception as e:
            logger.error(f"[FACTS_EXTRACTOR] Error extracting facts from response: {str(e)}")
            return facts
    
    def merge_facts(
        self,
        existing_facts: Optional[Dict[str, Any]],
        new_facts: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Merge new facts with existing facts, preventing duplicates.
        
        Args:
            existing_facts: Existing facts dictionary
            new_facts: New facts to merge
            
        Returns:
            Merged facts dictionary
        """
        if not existing_facts:
            return new_facts
        
        merged = existing_facts.copy()
        
        # Update scalar values if new ones are not None
        for key in ["mahadasha", "antardasha", "sun_sign", "moon_sign"]:
            if new_facts.get(key):
                merged[key] = new_facts[key]
        
        # Merge lists (remove duplicates)
        if new_facts.get("doshas_present"):
            existing_doshas = set(merged.get("doshas_present", []))
            new_doshas = set(new_facts.get("doshas_present", []))
            merged["doshas_present"] = list(existing_doshas | new_doshas)
        
        # Merge planet positions
        if new_facts.get("major_planets"):
            merged["major_planets"].update(new_facts["major_planets"])
        
        merged["extracted_at"] = datetime.now().isoformat()
        
        return merged
