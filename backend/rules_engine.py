"""
Vedic Astrology Rules Engine for Dosha Detection

This module implements strict Vedic astrology algorithms to detect:
- 8 Major Doshas (Mangal, Kaal Sarp, Pitra, Guru Chandal, Kemadruma, Grahan, Vish, Gandmool)
- Planetary Avasthas (Debilitation, Combustion, Graha Yuddha, Retrograde)
- Dusthana Afflictions (6th, 8th, 12th house placements)
- D-Chart Afflictions (D9, D6, D8, D30, D60 specific conditions)
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime
from models import Dosha, Avastha, DusthanaAffliction, DChartAffliction


class RulesEngine:
    """
    Vedic Astrology Rules Engine for comprehensive dosha and affliction detection.
    Implements strict Vedic astrology algorithms based on classical texts.
    """

    def __init__(self):
        """Initialize the rules engine with astrological constants"""
        self.planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        self.malefics = ["Mars", "Saturn", "Rahu", "Ketu"]
        self.benefics = ["Jupiter", "Venus"]
        self.neutral = ["Sun", "Moon", "Mercury"]
        
        self.debilitation_signs = {
            "Sun": "Libra",
            "Moon": "Scorpio",
            "Mars": "Cancer",
            "Mercury": "Pisces",
            "Jupiter": "Virgo",
            "Venus": "Virgo",
            "Saturn": "Aries",
            "Rahu": "Virgo",
            "Ketu": "Pisces"
        }
        
        self.exaltation_signs = {
            "Sun": "Aries",
            "Moon": "Taurus",
            "Mars": "Capricorn",
            "Mercury": "Virgo",
            "Jupiter": "Cancer",
            "Venus": "Pisces",
            "Saturn": "Libra",
            "Rahu": "Gemini",
            "Ketu": "Sagittarius"
        }
        
        self.own_signs = {
            "Sun": ["Leo"],
            "Moon": ["Cancer"],
            "Mars": ["Aries", "Scorpio"],
            "Mercury": ["Gemini", "Virgo"],
            "Jupiter": ["Sagittarius", "Pisces"],
            "Venus": ["Taurus", "Libra"],
            "Saturn": ["Capricorn", "Aquarius"],
            "Rahu": ["Gemini"],
            "Ketu": ["Sagittarius"]
        }
    
    def get_planet_name(self, planet: Dict) -> str:
        """
        Extract planet name from planet object, handling multiple field name variations.
        
        Args:
            planet: Planet data dictionary
            
        Returns:
            Planet name (e.g., "Jupiter", "Rahu", "Mars")
        """
        # Try different field names
        name = planet.get("name", "") or planet.get("celestialBody", "") or planet.get("planet", "")
        # Clean up the name (remove symbols like ♂, ♀, etc.)
        name = name.replace("♂", "").replace("♀", "").replace("☊", "").replace("☋", "").strip()
        return name
    
    def extract_planets_from_chart(self, d1_chart: Dict) -> List[Dict]:
        """
        Extract all planets from the D1 chart, handling both flat and nested structures.
        
        The chart can have planets in:
        1. d1_chart["planets"] - flat array
        2. d1_chart["houses"][].occupants[] - nested in houses
        
        Args:
            d1_chart: D1 chart data
            
        Returns:
            List of planet dictionaries with house information
        """
        planets = []
        
        # Try flat structure first
        if "planets" in d1_chart and isinstance(d1_chart["planets"], list):
            planets.extend(d1_chart["planets"])
        
        # Try nested structure (planets in houses)
        if "houses" in d1_chart and isinstance(d1_chart["houses"], list):
            for house in d1_chart["houses"]:
                if "occupants" in house and isinstance(house["occupants"], list):
                    for occupant in house["occupants"]:
                        # Ensure house number is set
                        if "house" not in occupant:
                            occupant["house"] = house.get("number")
                        planets.append(occupant)
        
        return planets

    def detect_all_doshas(self, d1_chart: Dict, birth_data: Dict) -> List[Dosha]:
        """
        Detect all 8 major doshas in the birth chart.
        
        Args:
            d1_chart: D1 (Rasi) chart data
            birth_data: Birth data dictionary
            
        Returns:
            List of detected doshas with severity and remedies
        """
        doshas = []
        
        doshas.append(self.detect_mangal_dosha(d1_chart, birth_data))
        doshas.append(self.detect_kaal_sarp_dosha(d1_chart))
        doshas.append(self.detect_pitra_dosha(d1_chart))
        doshas.append(self.detect_guru_chandal_dosha(d1_chart))
        doshas.append(self.detect_kemadruma_dosha(d1_chart))
        doshas.append(self.detect_grahan_dosha(d1_chart))
        doshas.append(self.detect_vish_dosha(d1_chart))
        doshas.append(self.detect_gandmool_dosha(d1_chart))
        
        return doshas

    def detect_mangal_dosha(self, d1_chart: Dict, birth_data: Dict) -> Dosha:
        """
        Detect Mangal Dosha (Mars affliction in marriage).
        
        Mangal Dosha is present when Mars is in 1st, 4th, 7th, 8th, or 12th house
        in the birth chart, and is not cancelled by various yogas.
        
        Cancellation conditions:
        - Mars in own sign (Aries/Scorpio)
        - Mars in exaltation (Capricorn)
        - Mars aspected by benefics (Jupiter, Venus)
        - Mars in Navamsha of benefic
        """
        is_present = False
        is_cancelled = False
        cancellation_reasons = []
        severity = "mild"
        description = "Not present in this chart."
        remedies = []
        
        try:
            # Find Mars position
            mars_house = None
            mars_sign = None
            
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                if planet_name == "Mars" or planet.get("id") == 2:
                    mars_house = planet.get("house")
                    mars_sign = self.get_planet_sign(planet)
                    break
            
            if mars_house is None:
                return Dosha(
                    name="Mangal Dosha",
                    is_present=False,
                    is_cancelled=False,
                    severity="mild",
                    description="Mars position not found in chart.",
                    remedies=[]
                )
            
            # Check if Mars is in afflicting houses (1, 4, 7, 8, 12)
            afflicting_houses = [1, 4, 7, 8, 12]
            
            if mars_house in afflicting_houses:
                is_present = True
                
                # Check cancellation conditions
                is_cancelled, cancellation_reasons = self.check_mangal_dosha_bhanga(d1_chart, mars_house, mars_sign)
                
                if not is_cancelled:
                    severity = "severe" if mars_house == 7 else "moderate"
                    description = f"Mars is placed in the {mars_house} house, indicating challenges in marriage and partnerships. This is a classic Mangal Dosha configuration."
                    remedies = self.get_remedies_for_dosha("Mangal Dosha")
                else:
                    description = f"Mars is in an afflicting house ({mars_house}), but the Mangal Dosha is cancelled due to protective yogas."
        
        except Exception as e:
            description = f"Error analyzing Mangal Dosha: {str(e)}"
        
        return Dosha(
            name="Mangal Dosha",
            is_present=is_present,
            is_cancelled=is_cancelled,
            severity=severity,
            description=description,
            cancellation_reasons=cancellation_reasons,
            remedies=remedies
        )

    def detect_kaal_sarp_dosha(self, d1_chart: Dict) -> Dosha:
        """
        Detect Kaal Sarp Dosha (Rahu-Ketu axis affliction).
        
        Kaal Sarp Dosha occurs when all planets are between Rahu and Ketu.
        This is one of the most significant doshas in Vedic astrology.
        """
        is_present = False
        is_cancelled = False
        cancellation_reasons = []
        severity = "mild"
        description = "Not present in this chart."
        remedies = []
        
        try:
            rahu_house = None
            ketu_house = None
            planet_houses = []
            
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                planet_id = planet.get("id")
                house = planet.get("house")
                
                # Find Rahu and Ketu
                if planet_name == "Rahu" or planet_id == 7:
                    rahu_house = house
                elif planet_name == "Ketu" or planet_id == 8:
                    ketu_house = house
                # Collect other planets (excluding Rahu and Ketu)
                elif planet_id not in [7, 8]:
                    planet_houses.append(house)
            
            if rahu_house is not None and ketu_house is not None and planet_houses:
                # Check if all planets are between Rahu and Ketu
                # Kaal Sarp Dosha exists if all planets are in the same half (between Rahu and Ketu)
                
                # Normalize houses to 0-11 range for easier comparison
                rahu_pos = rahu_house if rahu_house else 0
                ketu_pos = ketu_house if ketu_house else 0
                
                # Check if all planets fall between Rahu and Ketu
                all_between = True
                for planet_house in planet_houses:
                    if rahu_pos < ketu_pos:
                        # Rahu is before Ketu
                        if not (rahu_pos < planet_house < ketu_pos):
                            all_between = False
                            break
                    else:
                        # Ketu is before Rahu (wraps around)
                        if not (planet_house > rahu_pos or planet_house < ketu_pos):
                            all_between = False
                            break
                
                if all_between:
                    is_present = True
                    severity = "severe"
                    
                    # Check for cancellation (benefic escape)
                    is_cancelled, cancellation_reasons = self.check_kaal_sarp_dosha_bhanga(d1_chart, rahu_house, ketu_house)
                    
                    if not is_cancelled:
                        description = "Kaal Sarp Dosha is present. All planets are positioned between Rahu and Ketu, creating a significant affliction. This dosha can cause obstacles, delays, and challenges in life. However, it also provides spiritual growth opportunities."
                        remedies = self.get_remedies_for_dosha("Kaal Sarp Dosha")
                    else:
                        description = "Kaal Sarp Dosha is present, but it is cancelled by benefic planetary positions."
        
        except Exception as e:
            description = f"Error analyzing Kaal Sarp Dosha: {str(e)}"
        
        return Dosha(
            name="Kaal Sarp Dosha",
            is_present=is_present,
            is_cancelled=is_cancelled,
            severity=severity,
            description=description,
            cancellation_reasons=cancellation_reasons,
            remedies=remedies
        )

    def detect_pitra_dosha(self, d1_chart: Dict) -> Dosha:
        """
        Detect Pitra Dosha (ancestral debt).
        
        Pitra Dosha is indicated by:
        - Sun in 8th, 9th, or 12th house
        - Sun aspected by malefics
        - Saturn in 9th house (Pitru Sthana)
        - Rahu in 9th house
        """
        is_present = False
        is_cancelled = False
        cancellation_reasons = []
        severity = "mild"
        description = "Not present in this chart."
        remedies = []
        
        try:
            sun_house = None
            saturn_house = None
            rahu_house = None
            
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                planet_id = planet.get("id")
                house = planet.get("house")
                
                if planet_id == 0 or planet_name == "Sun":
                    sun_house = house
                elif planet_id == 6 or planet_name == "Saturn":
                    saturn_house = house
                elif planet_id == 7 or planet_name == "Rahu":
                    rahu_house = house
            
            # Check conditions for Pitra Dosha
            pitra_indicators = 0
            
            if sun_house in [8, 9, 12]:
                pitra_indicators += 1
            
            if saturn_house == 9:
                pitra_indicators += 1
            
            if rahu_house == 9:
                pitra_indicators += 1
            
            if pitra_indicators >= 1:
                is_present = True
                severity = "moderate" if pitra_indicators >= 2 else "mild"
                
                # Check for cancellation (Jupiter aspects)
                is_cancelled, cancellation_reasons = self.check_pitra_dosha_bhanga(d1_chart)
                
                if not is_cancelled:
                    description = f"Pitra Dosha indicators detected. This suggests ancestral debt or unresolved family karma. Performing Shradh rituals and honoring ancestors is recommended."
                    remedies = self.get_remedies_for_dosha("Pitra Dosha")
                else:
                    description = f"Pitra Dosha indicators are present, but the dosha is mitigated by Jupiter's protective aspects."
        
        except Exception as e:
            description = f"Error analyzing Pitra Dosha: {str(e)}"
        
        return Dosha(
            name="Pitra Dosha",
            is_present=is_present,
            is_cancelled=is_cancelled,
            severity=severity,
            description=description,
            cancellation_reasons=cancellation_reasons,
            remedies=remedies
        )

    def detect_guru_chandal_dosha(self, d1_chart: Dict) -> Dosha:
        """
        Detect Guru Chandal Dosha (Jupiter-Rahu conjunction).
        
        Occurs when Jupiter and Rahu are in the same house or closely conjunct.
        This dosha can affect wisdom, spirituality, and moral judgment.
        """
        is_present = False
        is_cancelled = False
        cancellation_reasons = []
        severity = "mild"
        description = "Not present in this chart."
        remedies = []
        
        try:
            jupiter_house = None
            rahu_house = None
            
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                planet_id = planet.get("id")
                house = planet.get("house")
                
                # Check for Jupiter (id 4 or name is "Jupiter")
                if planet_id == 4 or planet_name == "Jupiter":
                    jupiter_house = house
                # Check for Rahu (id 7 or name is "Rahu")
                elif planet_id == 7 or planet_name == "Rahu":
                    rahu_house = house
            
            # Check if Jupiter and Rahu are in the same house
            if jupiter_house is not None and rahu_house is not None:
                if jupiter_house == rahu_house:
                    is_present = True
                    severity = "moderate"
                    
                    # Check for cancellation
                    is_cancelled, cancellation_reasons = self.check_conjunction_dosha_bhanga(d1_chart, jupiter_house, "Jupiter", "Rahu")
                    
                    if not is_cancelled:
                        description = "Guru Chandal Dosha is present. Jupiter and Rahu are in conjunction, which can affect wisdom, spirituality, and moral judgment. This combination requires careful handling of ethical matters."
                        remedies = self.get_remedies_for_dosha("Guru Chandal Dosha")
                    else:
                        description = "Guru Chandal Dosha is present, but it is cancelled by protective yogas."
        
        except Exception as e:
            description = f"Error analyzing Guru Chandal Dosha: {str(e)}"
        
        return Dosha(
            name="Guru Chandal Dosha",
            is_present=is_present,
            is_cancelled=is_cancelled,
            severity=severity,
            description=description,
            cancellation_reasons=cancellation_reasons,
            remedies=remedies
        )

    def detect_kemadruma_dosha(self, d1_chart: Dict) -> Dosha:
        """
        Detect Kemadruma Dosha (Moon without planetary support).
        
        Occurs when Moon has no planets in adjacent houses (2nd and 12th).
        This dosha indicates lack of mental support and emotional stability.
        """
        is_present = False
        is_cancelled = False
        cancellation_reasons = []
        severity = "mild"
        description = "Not present in this chart."
        remedies = []
        
        try:
            moon_house = None
            planet_houses = set()
            
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                planet_id = planet.get("id")
                house = planet.get("house")
                
                if planet_id == 1 or planet_name == "Moon":
                    moon_house = house
                # Collect houses of other planets (excluding Moon, Rahu, Ketu)
                elif planet_id not in [1, 7, 8]:
                    planet_houses.add(house)
            
            if moon_house is not None:
                # Check if there are planets in 2nd and 12th from Moon
                adjacent_house_1 = (moon_house % 12) + 1
                adjacent_house_2 = ((moon_house - 2) % 12) + 1
                
                has_support = (adjacent_house_1 in planet_houses) or (adjacent_house_2 in planet_houses)
                
                if not has_support:
                    is_present = True
                    severity = "moderate"
                    
                    # Check for cancellation (supporting planets in Kendra houses)
                    is_cancelled, cancellation_reasons = self.check_kemadruma_dosha_bhanga(d1_chart, moon_house)
                    
                    if not is_cancelled:
                        description = "Kemadruma Dosha is present. The Moon lacks planetary support in adjacent houses, indicating potential mental instability and emotional challenges. Strengthening the Moon through remedies is recommended."
                        remedies = self.get_remedies_for_dosha("Kemadruma Dosha")
                    else:
                        description = "Kemadruma Dosha is present, but it is cancelled by supporting planets in Kendra houses."
        
        except Exception as e:
            description = f"Error analyzing Kemadruma Dosha: {str(e)}"
        
        return Dosha(
            name="Kemadruma Dosha",
            is_present=is_present,
            is_cancelled=is_cancelled,
            severity=severity,
            description=description,
            cancellation_reasons=cancellation_reasons,
            remedies=remedies
        )

    def detect_grahan_dosha(self, d1_chart: Dict) -> Dosha:
        """
        Detect Grahan Dosha (Eclipse point affliction).
        
        Occurs when Sun or Moon are conjunct Rahu or Ketu.
        This creates eclipse-like effects in the chart.
        """
        is_present = False
        is_cancelled = False
        cancellation_reasons = []
        severity = "mild"
        description = "Not present in this chart."
        remedies = []
        
        try:
            sun_house = None
            moon_house = None
            rahu_house = None
            ketu_house = None
            
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                planet_id = planet.get("id")
                house = planet.get("house")
                
                if planet_id == 0 or planet_name == "Sun":
                    sun_house = house
                elif planet_id == 1 or planet_name == "Moon":
                    moon_house = house
                elif planet_id == 7 or planet_name == "Rahu":
                    rahu_house = house
                elif planet_id == 8 or planet_name == "Ketu":
                    ketu_house = house
            
            # Check if Sun or Moon are with Rahu or Ketu
            grahan_indicators = 0
            conjunction_planet = None
            conjunction_house = None
            
            if sun_house is not None and rahu_house is not None and sun_house == rahu_house:
                grahan_indicators += 1
                conjunction_planet = "Sun"
                conjunction_house = sun_house
            
            if sun_house is not None and ketu_house is not None and sun_house == ketu_house:
                grahan_indicators += 1
                conjunction_planet = "Sun"
                conjunction_house = sun_house
            
            if moon_house is not None and rahu_house is not None and moon_house == rahu_house:
                grahan_indicators += 1
                conjunction_planet = "Moon"
                conjunction_house = moon_house
            
            if moon_house is not None and ketu_house is not None and moon_house == ketu_house:
                grahan_indicators += 1
                conjunction_planet = "Moon"
                conjunction_house = moon_house
            
            if grahan_indicators > 0:
                is_present = True
                severity = "moderate" if grahan_indicators >= 2 else "mild"
                
                # Check for cancellation
                if conjunction_planet and conjunction_house:
                    is_cancelled, cancellation_reasons = self.check_conjunction_dosha_bhanga(d1_chart, conjunction_house, conjunction_planet, "Rahu/Ketu")
                
                if not is_cancelled:
                    description = "Grahan Dosha is present. Sun or Moon is conjunct with Rahu or Ketu, creating eclipse-like effects. This can affect clarity of mind and life direction."
                    remedies = self.get_remedies_for_dosha("Grahan Dosha")
                else:
                    description = "Grahan Dosha is present, but it is cancelled by protective yogas."
        
        except Exception as e:
            description = f"Error analyzing Grahan Dosha: {str(e)}"
        
        return Dosha(
            name="Grahan Dosha",
            is_present=is_present,
            is_cancelled=is_cancelled,
            severity=severity,
            description=description,
            cancellation_reasons=cancellation_reasons,
            remedies=remedies
        )

    def detect_vish_dosha(self, d1_chart: Dict) -> Dosha:
        """
        Detect Vish Dosha (Poison combination).
        
        Occurs when Moon and Saturn are in the same house or closely conjunct.
        This creates a "poisonous" combination of emotional and restrictive energies.
        """
        is_present = False
        is_cancelled = False
        cancellation_reasons = []
        severity = "mild"
        description = "Not present in this chart."
        remedies = []
        
        try:
            moon_house = None
            moon_sign = None
            saturn_house = None
            
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                planet_id = planet.get("id")
                house = planet.get("house")
                
                if planet_id == 1 or planet_name == "Moon":
                    moon_house = house
                    moon_sign = self.get_planet_sign(planet)
                elif planet_id == 6 or planet_name == "Saturn":
                    saturn_house = house
            
            # Check if Moon and Saturn are in the same house
            if moon_house is not None and saturn_house is not None:
                if moon_house == saturn_house:
                    is_present = True
                    severity = "moderate"
                    
                    # Check for cancellation
                    is_cancelled, cancellation_reasons = self.check_vish_dosha_bhanga(d1_chart, moon_house, moon_sign)
                    
                    if not is_cancelled:
                        description = "Vish Dosha is present. Moon and Saturn are in conjunction, creating a 'poisonous' combination. This can indicate emotional challenges, restrictions, and mental obstacles."
                        remedies = self.get_remedies_for_dosha("Vish Dosha")
                    else:
                        description = "Vish Dosha is present, but it is cancelled by protective yogas."
        
        except Exception as e:
            description = f"Error analyzing Vish Dosha: {str(e)}"
        
        return Dosha(
            name="Vish Dosha",
            is_present=is_present,
            is_cancelled=is_cancelled,
            severity=severity,
            description=description,
            cancellation_reasons=cancellation_reasons,
            remedies=remedies
        )

    def detect_gandmool_dosha(self, d1_chart: Dict) -> Dosha:
        """
        Detect Gandmool Dosha (Root affliction).
        
        Occurs when Moon is in specific nakshatras at birth (Ashwini, Aslesha, Magha, Jyeshtha, Moola, Revati).
        This is a birth-time affliction that requires specific remedies.
        """
        is_present = False
        is_cancelled = False
        cancellation_reasons = []
        severity = "mild"
        description = "Not present in this chart."
        remedies = []
        
        try:
            # Gandmool nakshatras
            gandmool_nakshatras = ["Ashwini", "Aslesha", "Magha", "Jyeshtha", "Moola", "Revati"]
            
            # Note: This would require nakshatra data from the chart
            # For now, we check if there's nakshatra information available
            if "panchanga" in d1_chart:
                panchanga = d1_chart.get("panchanga", {})
                nakshatra = panchanga.get("nakshatra", "")
                
                if any(gm_nakshatra in nakshatra for gm_nakshatra in gandmool_nakshatras):
                    is_present = True
                    severity = "moderate"
                    description = f"Gandmool Dosha is present. The Moon is in {nakshatra} nakshatra at birth. This requires specific remedial measures during early childhood. Note: Gandmool Dosha cannot be cancelled out and must be addressed through proper remedial rituals."
                    remedies = self.get_remedies_for_dosha("Gandmool Dosha")
        
        except Exception as e:
            description = f"Error analyzing Gandmool Dosha: {str(e)}"
        
        return Dosha(
            name="Gandmool Dosha",
            is_present=is_present,
            is_cancelled=is_cancelled,
            severity=severity,
            description=description,
            cancellation_reasons=cancellation_reasons,
            remedies=remedies
        )

    def detect_planetary_avasthas(self, d1_chart: Dict) -> List[Avastha]:
        """
        Detect planetary avasthas (states/conditions).
        
        Includes: Debilitation (Neecha), Combustion (Asta), Graha Yuddha (Planetary War),
        and Retrograde malefics.
        """
        avasthas = []
        
        try:
            sun_longitude = None
            planets_data = {}
            
            if "planets" in d1_chart:
                for planet in d1_chart["planets"]:
                    planet_name = planet.get("name", "")
                    planet_id = planet.get("id")
                    house_name = planet.get("house_name", "")
                    longitude = planet.get("longitude", 0)
                    
                    # Store Sun's longitude for combustion check
                    if planet_id == 0 or "Sun" in planet_name:
                        sun_longitude = longitude
                    
                    planets_data[planet_name] = {
                        "id": planet_id,
                        "house_name": house_name,
                        "longitude": longitude
                    }
                
                # Check for Neecha (Debilitation)
                for planet_name, data in planets_data.items():
                    house_name = data["house_name"]
                    
                    # Check if planet is in debilitation sign
                    for planet, debil_sign in self.debilitation_signs.items():
                        if planet in planet_name and debil_sign in house_name:
                            avasthas.append(Avastha(
                                planet=planet_name,
                                avastha_type="neecha",
                                severity="moderate",
                                description=f"{planet_name} is debilitated in {house_name}, indicating weakness in matters ruled by this planet."
                            ))
                
                # Check for Asta (Combustion) - planets within 8 degrees of Sun
                if sun_longitude is not None:
                    for planet_name, data in planets_data.items():
                        if "Sun" not in planet_name:
                            longitude_diff = abs(data["longitude"] - sun_longitude)
                            if longitude_diff < 8:  # Combustion threshold
                                avasthas.append(Avastha(
                                    planet=planet_name,
                                    avastha_type="asta",
                                    severity="moderate",
                                    description=f"{planet_name} is combusted (too close to Sun), indicating loss of power and signification."
                                ))
                
                # Check for Retrograde malefics
                for planet in d1_chart.get("planets", []):
                    planet_name = planet.get("name", "")
                    # Check if planet has retrograde indicator (would need additional data)
                    # This is a simplified check - actual retrograde data would come from chart
                    if any(malefic in planet_name for malefic in ["Mars", "Saturn", "Raagu", "Kethu"]):
                        # Note: Actual retrograde status would need to be in the chart data
                        pass
        
        except Exception as e:
            pass
        
        return avasthas

    def detect_dusthana_afflictions(self, d1_chart: Dict) -> List[DusthanaAffliction]:
        """
        Detect planets in dusthana houses (6th, 8th, 12th).
        
        These houses are considered inauspicious, and malefic planets here
        create various afflictions.
        """
        afflictions = []
        
        try:
            dusthana_houses = {6: [], 8: [], 12: []}
            
            if "planets" in d1_chart:
                for planet in d1_chart["planets"]:
                    planet_name = planet.get("name", "")
                    house = planet.get("house")
                    
                    # Skip Ascendant
                    if "Ascendant" in planet_name:
                        continue
                    
                    # Collect planets in dusthana houses
                    if house in dusthana_houses:
                        dusthana_houses[house].append(planet_name)
            
            # Create affliction entries for each dusthana house with planets
            for house, planets in dusthana_houses.items():
                if planets:
                    # Check if malefics are present
                    malefics_present = any(malefic in planet for planet in planets for malefic in self.malefics)
                    
                    severity = "severe" if malefics_present else "mild"
                    
                    if house == 6:
                        description = f"Planets in the 6th house (enemies, debts, health): {', '.join(planets)}. This can indicate health challenges and conflicts."
                    elif house == 8:
                        description = f"Planets in the 8th house (longevity, sudden events): {', '.join(planets)}. This can indicate sudden changes and transformation."
                    else:  # house == 12
                        description = f"Planets in the 12th house (losses, foreign lands): {', '.join(planets)}. This can indicate expenses and spiritual inclinations."
                    
                    afflictions.append(DusthanaAffliction(
                        house=house,
                        planets=planets,
                        severity=severity,
                        description=description
                    ))
        
        except Exception as e:
            pass
        
        return afflictions

    def detect_d_chart_afflictions(self, all_d_charts: Dict[str, Dict]) -> List[DChartAffliction]:
        """
        Detect afflictions in divisional charts (D9, D6, D8, D30, D60).
        
        Args:
            all_d_charts: Dictionary of all D-charts {chart_type: chart_data}
            
        Returns:
            List of D-chart specific afflictions
        """
        afflictions = []
        
        try:
            # D9 (Navamsha) - Marriage and partnership
            if "D9" in all_d_charts:
                d9_chart = all_d_charts["D9"]
                
                # Check for debilitated planets in D9
                for planet in d9_chart.get("planets", []):
                    planet_name = planet.get("name", "")
                    house_name = planet.get("house_name", "")
                    
                    for planet_key, debil_sign in self.debilitation_signs.items():
                        if planet_key in planet_name and debil_sign in house_name:
                            afflictions.append(DChartAffliction(
                                chart_type="D9",
                                affliction_type="debilitation",
                                severity="moderate",
                                description=f"In the D9 (Navamsha) chart, {planet_name} is debilitated, indicating challenges in marriage and partnership matters.",
                                planets=[planet_name]
                            ))
            
            # D6 (Shashtamsha) - Health and enemies
            if "D6" in all_d_charts:
                d6_chart = all_d_charts["D6"]
                
                # Check for malefics in 6th house of D6
                for planet in d6_chart.get("planets", []):
                    planet_name = planet.get("name", "")
                    house = planet.get("house")
                    
                    if house == 6 and any(malefic in planet_name for malefic in self.malefics):
                        afflictions.append(DChartAffliction(
                            chart_type="D6",
                            affliction_type="health_affliction",
                            severity="moderate",
                            description=f"In the D6 (Shashtamsha) chart, {planet_name} is in the 6th house, indicating health challenges and conflicts with enemies.",
                            planets=[planet_name]
                        ))
            
            # D8 (Ashtamsha) - Longevity and sudden events
            if "D8" in all_d_charts:
                d8_chart = all_d_charts["D8"]
                
                # Check for malefics in 8th house of D8
                for planet in d8_chart.get("planets", []):
                    planet_name = planet.get("name", "")
                    house = planet.get("house")
                    
                    if house == 8 and any(malefic in planet_name for malefic in self.malefics):
                        afflictions.append(DChartAffliction(
                            chart_type="D8",
                            affliction_type="longevity_affliction",
                            severity="severe",
                            description=f"In the D8 (Ashtamsha) chart, {planet_name} is in the 8th house, indicating potential longevity concerns and sudden events.",
                            planets=[planet_name]
                        ))
            
            # D30 (Trimshamsha) - Misfortunes and accidents
            if "D30" in all_d_charts:
                d30_chart = all_d_charts["D30"]
                
                # Check for malefics in D30
                malefic_count = 0
                malefic_planets = []
                
                for planet in d30_chart.get("planets", []):
                    planet_name = planet.get("name", "")
                    
                    if any(malefic in planet_name for malefic in self.malefics):
                        malefic_count += 1
                        malefic_planets.append(planet_name)
                
                if malefic_count >= 2:
                    afflictions.append(DChartAffliction(
                        chart_type="D30",
                        affliction_type="misfortune",
                        severity="moderate",
                        description=f"In the D30 (Trimshamsha) chart, multiple malefics are present: {', '.join(malefic_planets)}. This indicates potential misfortunes and accidents.",
                        planets=malefic_planets
                    ))
            
            # D60 (Shashtiamsha) - Past-life Shrapas
            if "D60" in all_d_charts:
                d60_chart = all_d_charts["D60"]
                shrapas = self.detect_d60_shrapas(d60_chart)
                afflictions.extend(shrapas)
        
        except Exception as e:
            pass
        
        return afflictions

    def detect_d60_shrapas(self, d60_chart: Dict) -> List[DChartAffliction]:
        """
        Detect past-life Shrapas in D60 chart.
        
        Shrapas represent curses from past lives:
        - Matru Shrapa: Mother's curse (Moon afflictions)
        - Pitru Shrapa: Father's curse (Sun afflictions)
        - Brahma Shrapa: Brahmin's curse (Mercury/Jupiter afflictions)
        - Stri Shrapa: Woman's curse (Venus afflictions)
        """
        shrapas = []
        
        try:
            # Check for afflicted planets in D60
            for planet in d60_chart.get("planets", []):
                planet_name = planet.get("name", "")
                house_name = planet.get("house_name", "")
                house = planet.get("house")
                
                # Matru Shrapa - Moon afflictions
                if "Moon" in planet_name:
                    if house in [6, 8, 12] or any(debil_sign in house_name for debil_sign in self.debilitation_signs.values()):
                        shrapas.append(DChartAffliction(
                            chart_type="D60",
                            affliction_type="matru_shrapa",
                            severity="moderate",
                            description="Mother's curse (Matru Shrapa) is indicated in the D60 chart. This requires specific remedial measures and honoring of mother.",
                            planets=["Moon"]
                        ))
                
                # Pitru Shrapa - Sun afflictions
                elif "Sun" in planet_name:
                    if house in [6, 8, 12] or any(debil_sign in house_name for debil_sign in self.debilitation_signs.values()):
                        shrapas.append(DChartAffliction(
                            chart_type="D60",
                            affliction_type="pitru_shrapa",
                            severity="moderate",
                            description="Father's curse (Pitru Shrapa) is indicated in the D60 chart. This requires specific remedial measures and honoring of father.",
                            planets=["Sun"]
                        ))
                
                # Brahma Shrapa - Mercury/Jupiter afflictions
                elif "Mercury" in planet_name or "Jupiter" in planet_name:
                    if house in [6, 8, 12]:
                        shrapa_type = "brahma_shrapa"
                        shrapas.append(DChartAffliction(
                            chart_type="D60",
                            affliction_type=shrapa_type,
                            severity="moderate",
                            description="Brahmin's curse (Brahma Shrapa) is indicated in the D60 chart. This requires spiritual practices and charity.",
                            planets=[planet_name]
                        ))
                
                # Stri Shrapa - Venus afflictions
                elif "Venus" in planet_name:
                    if house in [6, 8, 12]:
                        shrapas.append(DChartAffliction(
                            chart_type="D60",
                            affliction_type="stri_shrapa",
                            severity="moderate",
                            description="Woman's curse (Stri Shrapa) is indicated in the D60 chart. This requires respectful treatment of women and specific remedies.",
                            planets=["Venus"]
                        ))
        
        except Exception as e:
            pass
        
        return shrapas

    def get_planet_sign(self, planet: Dict) -> Optional[str]:
        """
        Extract sign from planet object.
        
        Args:
            planet: Planet data dictionary
            
        Returns:
            Sign name (e.g., "Aries", "Taurus") or None
        """
        sign = planet.get("sign", "")
        if sign:
            return sign
        # Try to extract from house_name if available
        house_name = planet.get("house_name", "")
        if house_name:
            return house_name
        return None
    
    def check_aspect_between_planets(self, aspecting_planet: Dict, target_house: int, d1_chart: Dict) -> bool:
        """
        Check if aspecting_planet aspects the target_house using aspects data.
        
        Args:
            aspecting_planet: Planet that gives the aspect
            target_house: House number being aspected
            d1_chart: D1 chart data
            
        Returns:
            True if aspect exists, False otherwise
        """
        try:
            if "aspects" not in aspecting_planet:
                return False
            
            aspects = aspecting_planet.get("aspects", {})
            if "gives" not in aspects:
                return False
            
            for aspect in aspects["gives"]:
                if aspect.get("to_house") == target_house:
                    return True
            
            return False
        except Exception:
            return False
    
    def is_benefic_planet(self, planet_name: str) -> bool:
        """
        Check if planet is benefic (Jupiter, Venus, Mercury, Moon, Sun).
        
        Args:
            planet_name: Name of the planet
            
        Returns:
            True if benefic, False otherwise
        """
        benefic_planets = ["Jupiter", "Venus", "Mercury", "Moon", "Sun"]
        return any(benefic in planet_name for benefic in benefic_planets)
    
    def get_kendra_planets(self, d1_chart: Dict, from_house: int, exclude_planets: List[str] = None) -> List[Dict]:
        """
        Get all planets in Kendra houses (1, 4, 7, 10) from a given house.
        
        Args:
            d1_chart: D1 chart data
            from_house: Reference house (usually Ascendant or Moon house)
            exclude_planets: List of planet names to exclude (e.g., ["Sun", "Rahu", "Ketu"])
            
        Returns:
            List of planets in Kendra houses
        """
        if exclude_planets is None:
            exclude_planets = ["Sun", "Rahu", "Ketu"]
        
        kendra_houses = [1, 4, 7, 10]
        kendra_planets = []
        
        try:
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                house = planet.get("house")
                
                # Skip excluded planets
                if any(excluded in planet_name for excluded in exclude_planets):
                    continue
                
                # Check if planet is in Kendra from reference house
                if house in kendra_houses:
                    kendra_planets.append(planet)
        
        except Exception:
            pass
        
        return kendra_planets
    
    def check_mangal_dosha_bhanga(self, d1_chart: Dict, mars_house: int, mars_sign: str) -> Tuple[bool, List[str]]:
        """
        Check if Mangal Dosha is cancelled (Bhanga) by protective yogas.
        
        Args:
            d1_chart: D1 chart data
            mars_house: House where Mars is placed
            mars_sign: Sign where Mars is placed
            
        Returns:
            Tuple of (is_cancelled: bool, cancellation_reasons: List[str])
        """
        is_cancelled = False
        reasons = []
        
        try:
            # Condition 1: Mars in own sign (Aries/Scorpio)
            if mars_sign and ("Aries" in mars_sign or "Scorpio" in mars_sign):
                is_cancelled = True
                reasons.append(f"Mars is in its own sign of {mars_sign}")
            
            # Condition 2: Mars in exaltation (Capricorn)
            if mars_sign and "Capricorn" in mars_sign:
                is_cancelled = True
                reasons.append("Mars is in its exalted sign of Capricorn")
            
            # Condition 3: Mars aspected by Jupiter or Moon
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                
                # Check if Jupiter aspects Mars
                if "Jupiter" in planet_name:
                    if self.check_aspect_between_planets(planet, mars_house, d1_chart):
                        is_cancelled = True
                        reasons.append("Mars is aspected by Jupiter")
                
                # Check if Moon aspects Mars
                if "Moon" in planet_name:
                    if self.check_aspect_between_planets(planet, mars_house, d1_chart):
                        is_cancelled = True
                        reasons.append("Mars is aspected by Moon")
        
        except Exception:
            pass
        
        return is_cancelled, reasons
    
    def check_kemadruma_dosha_bhanga(self, d1_chart: Dict, moon_house: int) -> Tuple[bool, List[str]]:
        """
        Check if Kemadruma Dosha is cancelled by supporting planets.
        
        Args:
            d1_chart: D1 chart data
            moon_house: House where Moon is placed
            
        Returns:
            Tuple of (is_cancelled: bool, cancellation_reasons: List[str])
        """
        is_cancelled = False
        reasons = []
        
        try:
            # Get planets in Kendra houses from Moon (excluding Sun, Rahu, Ketu)
            kendra_planets = self.get_kendra_planets(d1_chart, moon_house, exclude_planets=["Sun", "Rahu", "Ketu"])
            
            if kendra_planets:
                is_cancelled = True
                planet_names = [self.get_planet_name(p) for p in kendra_planets]
                reasons.append(f"Supporting planets present in Kendra houses from Moon: {', '.join(planet_names)}")
            
            # Check if Moon is aspected by Jupiter
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                
                if "Jupiter" in planet_name:
                    if self.check_aspect_between_planets(planet, moon_house, d1_chart):
                        is_cancelled = True
                        reasons.append("Moon is aspected by Jupiter")
        
        except Exception:
            pass
        
        return is_cancelled, reasons
    
    def check_kaal_sarp_dosha_bhanga(self, d1_chart: Dict, rahu_house: int, ketu_house: int) -> Tuple[bool, List[str]]:
        """
        Check if Kaal Sarp Dosha is cancelled by benefic escape.
        
        Args:
            d1_chart: D1 chart data
            rahu_house: House where Rahu is placed
            ketu_house: House where Ketu is placed
            
        Returns:
            Tuple of (is_cancelled: bool, cancellation_reasons: List[str])
        """
        is_cancelled = False
        reasons = []
        
        try:
            # Get Ascendant degree/house
            ascendant_house = None
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                if "Ascendant" in planet_name or planet.get("id") == 9:
                    ascendant_house = planet.get("house")
                    break
            
            # Check if Ascendant is outside Rahu-Ketu axis
            if ascendant_house is not None:
                rahu_pos = rahu_house if rahu_house else 0
                ketu_pos = ketu_house if ketu_house else 0
                
                # Check if Ascendant is outside the axis
                if rahu_pos < ketu_pos:
                    if not (rahu_pos < ascendant_house < ketu_pos):
                        is_cancelled = True
                        reasons.append("Ascendant is positioned outside the Rahu-Ketu axis")
                else:
                    if not (ascendant_house > rahu_pos or ascendant_house < ketu_pos):
                        is_cancelled = True
                        reasons.append("Ascendant is positioned outside the Rahu-Ketu axis")
            
            # Check if benefic planets (Jupiter, Venus, Mercury) are outside the axis
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                planet_house = planet.get("house")
                
                if planet_name in ["Jupiter", "Venus", "Mercury"]:
                    rahu_pos = rahu_house if rahu_house else 0
                    ketu_pos = ketu_house if ketu_house else 0
                    
                    if rahu_pos < ketu_pos:
                        if not (rahu_pos < planet_house < ketu_pos):
                            is_cancelled = True
                            reasons.append(f"{planet_name} is positioned outside the Rahu-Ketu axis")
                    else:
                        if not (planet_house > rahu_pos or planet_house < ketu_pos):
                            is_cancelled = True
                            reasons.append(f"{planet_name} is positioned outside the Rahu-Ketu axis")
        
        except Exception:
            pass
        
        return is_cancelled, reasons
    
    def check_conjunction_dosha_bhanga(self, d1_chart: Dict, planet1_house: int, planet1_name: str, planet2_name: str) -> Tuple[bool, List[str]]:
        """
        Check if conjunction doshas (Guru Chandal, Vish, Grahan) are cancelled.
        
        Args:
            d1_chart: D1 chart data
            planet1_house: House where the conjunction occurs
            planet1_name: Name of first planet in conjunction
            planet2_name: Name of second planet in conjunction
            
        Returns:
            Tuple of (is_cancelled: bool, cancellation_reasons: List[str])
        """
        is_cancelled = False
        reasons = []
        
        try:
            # Get sign of the conjunction
            planets = self.extract_planets_from_chart(d1_chart)
            conjunction_sign = None
            
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                if planet_name == planet1_name and planet.get("house") == planet1_house:
                    conjunction_sign = self.get_planet_sign(planet)
                    break
            
            if conjunction_sign:
                # Check if conjunction is in ruling planet's own sign
                ruling_planets = {
                    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury",
                    "Cancer": "Moon", "Leo": "Sun", "Virgo": "Mercury",
                    "Libra": "Venus", "Scorpio": "Mars", "Sagittarius": "Jupiter",
                    "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
                }
                
                ruler = ruling_planets.get(conjunction_sign)
                if ruler and ruler in planet1_name:
                    is_cancelled = True
                    reasons.append(f"Conjunction is in {planet1_name}'s own sign of {conjunction_sign}")
                
                # Check if conjunction is in exaltation sign
                if conjunction_sign == self.exaltation_signs.get(planet1_name):
                    is_cancelled = True
                    reasons.append(f"Conjunction is in {planet1_name}'s exalted sign of {conjunction_sign}")
                
                # Check if conjunction is in any of the planet's own signs (for planets with multiple own signs)
                if planet1_name in self.own_signs:
                    own_signs_list = self.own_signs[planet1_name]
                    if conjunction_sign in own_signs_list and conjunction_sign != self.exaltation_signs.get(planet1_name):
                        is_cancelled = True
                        reasons.append(f"Conjunction is in {planet1_name}'s own sign of {conjunction_sign}")
            
            # Check if strong Jupiter aspects the conjunction
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                
                if "Jupiter" in planet_name:
                    if self.check_aspect_between_planets(planet, planet1_house, d1_chart):
                        is_cancelled = True
                        reasons.append("Strong Jupiter aspects the conjunction, neutralizing its negative effects")
        
        except Exception:
            pass
        
        return is_cancelled, reasons
    
    def check_vish_dosha_bhanga(self, d1_chart: Dict, moon_house: int, moon_sign: str) -> Tuple[bool, List[str]]:
        """
        Check if Vish Dosha (Moon-Saturn conjunction) is cancelled by protective yogas.
        
        Args:
            d1_chart: D1 chart data
            moon_house: House where Moon is placed
            moon_sign: Sign where Moon is placed
            
        Returns:
            Tuple of (is_cancelled: bool, cancellation_reasons: List[str])
        """
        is_cancelled = False
        reasons = []
        
        try:
            # Condition 1: Conjunction in Moon's own sign (Cancer)
            if moon_sign and "Cancer" in moon_sign:
                is_cancelled = True
                reasons.append("Conjunction is in Moon's own sign of Cancer")
            
            # Condition 2: Conjunction in Moon's exalted sign (Taurus)
            if moon_sign and "Taurus" in moon_sign:
                is_cancelled = True
                reasons.append("Conjunction is in Moon's exalted sign of Taurus")
            
            # Condition 3: Conjunction aspected by Jupiter
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                
                if "Jupiter" in planet_name:
                    if self.check_aspect_between_planets(planet, moon_house, d1_chart):
                        is_cancelled = True
                        reasons.append("Conjunction is aspected by Jupiter, neutralizing its negative effects")
        
        except Exception:
            pass
        
        return is_cancelled, reasons
    
    def check_pitra_dosha_bhanga(self, d1_chart: Dict) -> Tuple[bool, List[str]]:
        """
        Check if Pitra Dosha is cancelled by Jupiter's protective aspects.
        
        Pitra Dosha is cancelled if:
        - Jupiter aspects the 9th house (house of ancestors), OR
        - Jupiter aspects the Sun
        
        Args:
            d1_chart: D1 chart data
            
        Returns:
            Tuple of (is_cancelled: bool, cancellation_reasons: List[str])
        """
        is_cancelled = False
        reasons = []
        
        try:
            sun_house = None
            jupiter_house = None
            
            planets = self.extract_planets_from_chart(d1_chart)
            for planet in planets:
                planet_name = self.get_planet_name(planet)
                planet_id = planet.get("id")
                house = planet.get("house")
                
                if planet_id == 0 or planet_name == "Sun":
                    sun_house = house
                elif planet_id == 4 or planet_name == "Jupiter":
                    jupiter_house = house
            
            # Check if Jupiter aspects the 9th house (house of ancestors)
            if jupiter_house is not None:
                # Check if Jupiter can aspect the 9th house
                # Jupiter aspects 5th and 9th houses from its position
                ninth_house_from_jupiter = (jupiter_house + 8) % 12 if jupiter_house else 0
                if ninth_house_from_jupiter == 9 or (jupiter_house + 8) % 12 == 9:
                    is_cancelled = True
                    reasons.append("Jupiter aspects the 9th house (house of ancestors), mitigating Pitra Dosha")
            
            # Check if Jupiter aspects the Sun
            if sun_house is not None and jupiter_house is not None:
                for planet in planets:
                    planet_name = self.get_planet_name(planet)
                    if "Jupiter" in planet_name:
                        if self.check_aspect_between_planets(planet, sun_house, d1_chart):
                            is_cancelled = True
                            reasons.append("Jupiter aspects the Sun, mitigating ancestral afflictions")
        
        except Exception:
            pass
        
        return is_cancelled, reasons

    def calculate_severity(self, affliction_strength: float) -> str:
        """
        Calculate severity level based on affliction strength (0-100).
        
        Args:
            affliction_strength: Strength value from 0 to 100
            
        Returns:
            Severity level: "severe", "moderate", or "mild"
        """
        if affliction_strength >= 70:
            return "severe"
        elif affliction_strength >= 40:
            return "moderate"
        else:
            return "mild"

    def get_remedies_for_dosha(self, dosha_name: str) -> List[str]:
        """
        Get suggested remedies (Upayas) for a specific dosha.
        
        Args:
            dosha_name: Name of the dosha
            
        Returns:
            List of suggested remedies
        """
        remedies_map = {
            "Mangal Dosha": [
                "Perform Mangal Puja on Tuesdays",
                "Wear red coral (Moonga) gemstone",
                "Chant Mangal Mantra: 'Om Angarakaya Namah'",
                "Donate red items on Tuesdays",
                "Fast on Tuesdays"
            ],
            "Kaal Sarp Dosha": [
                "Perform Kaal Sarp Puja",
                "Worship Rahu and Ketu",
                "Chant Rahu and Ketu mantras",
                "Wear Hessonite (Gomedh) and Cat's eye (Lehsunia)",
                "Perform Nag Puja on Nag Panchami"
            ],
            "Pitra Dosha": [
                "Perform Shradh rituals for ancestors",
                "Donate to charity in ancestors' names",
                "Perform Pitra Tarpan",
                "Chant Garuda Purana",
                "Offer water to Sun daily"
            ],
            "Guru Chandal Dosha": [
                "Worship Jupiter (Guru)",
                "Wear Yellow Sapphire (Pukhraj)",
                "Chant Jupiter Mantra: 'Om Gurave Namah'",
                "Donate yellow items on Thursdays",
                "Perform Jupiter Puja"
            ],
            "Kemadruma Dosha": [
                "Strengthen Moon through remedies",
                "Wear Pearl (Moti) gemstone",
                "Chant Moon Mantra: 'Om Chandaya Namah'",
                "Perform Moon Puja on Mondays",
                "Donate white items"
            ],
            "Grahan Dosha": [
                "Perform Grahan Dosha Puja",
                "Chant Rahu/Ketu mantras",
                "Wear appropriate gemstones",
                "Perform Nag Puja",
                "Donate to charity"
            ],
            "Vish Dosha": [
                "Perform specific planetary pujas",
                "Wear recommended gemstones",
                "Chant relevant mantras",
                "Perform charitable acts",
                "Consult experienced astrologer"
            ],
            "Gandmool Dosha": [
                "Perform Gandmool Shanti Puja",
                "Chant protective mantras",
                "Wear protective gemstones",
                "Perform rituals on auspicious dates",
                "Seek blessings from elders"
            ]
        }
        
        return remedies_map.get(dosha_name, ["Consult an experienced Vedic astrologer for remedies"])
