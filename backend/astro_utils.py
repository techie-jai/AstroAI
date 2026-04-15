"""
Astrology Utilities Module

Provides defensive string normalization and comparison functions for astrological data.
Handles case-insensitivity, spelling variations, and dictionary payload structures.
"""

from typing import Any, List, Optional


def extract_and_clean_string(value: Any) -> str:
    """
    Safely extract and normalize a string value from various payload types.
    
    Handles:
    - Dictionary payloads: {"name": "value"}
    - List payloads: ["value"]
    - String payloads: "value"
    - None/empty values
    
    Args:
        value: Raw value from API/chart data (can be str, dict, list, None)
        
    Returns:
        Normalized lowercase string with whitespace stripped
    """
    if value is None:
        return ""
    
    # Handle dictionary payloads
    if isinstance(value, dict):
        # Try common field names
        value = value.get("name") or value.get("value") or value.get("id") or ""
    
    # Handle list payloads
    if isinstance(value, list):
        value = value[0] if value else ""
    
    # Convert to string, lowercase, and strip whitespace
    return str(value).lower().strip()


# ============================================================================
# NAKSHATRA NORMALIZATION
# ============================================================================

NAKSHATRA_ALIASES = {
    # Ashwini
    "ashwini": "ashwini",
    
    # Bharani
    "bharani": "bharani",
    
    # Krittika / Kritika
    "krittika": "krittika",
    "kritika": "krittika",
    
    # Rohini
    "rohini": "rohini",
    
    # Mrigashira / Mrigasira
    "mrigashira": "mrigashira",
    "mrigasira": "mrigashira",
    
    # Ardra
    "ardra": "ardra",
    
    # Punarvasu
    "punarvasu": "punarvasu",
    
    # Pushya
    "pushya": "pushya",
    
    # Aslesha / Ashlesha
    "aslesha": "aslesha",
    "ashlesha": "aslesha",
    
    # Magha
    "magha": "magha",
    
    # Purva Phalguni / Poorva Phalguni
    "purva phalguni": "purva phalguni",
    "poorva phalguni": "purva phalguni",
    "purva phalgun": "purva phalguni",
    "poorva phalgun": "purva phalguni",
    
    # Uttara Phalguni / Uttar Phalguni
    "uttara phalguni": "uttara phalguni",
    "uttar phalguni": "uttara phalguni",
    "uttara phalgun": "uttara phalguni",
    "uttar phalgun": "uttara phalguni",
    
    # Hasta
    "hasta": "hasta",
    
    # Chitra
    "chitra": "chitra",
    
    # Swati
    "swati": "swati",
    
    # Vishakha
    "vishakha": "vishakha",
    
    # Anuradha
    "anuradha": "anuradha",
    
    # Jyeshtha / Jyestha / Jyeshta
    "jyeshtha": "jyeshtha",
    "jyestha": "jyeshtha",
    "jyeshta": "jyeshtha",
    
    # Mula / Moola / Mool
    "mula": "mula",
    "moola": "mula",
    "mool": "mula",
    
    # Purva Ashadha / Poorva Ashadha
    "purva ashadha": "purva ashadha",
    "poorva ashadha": "purva ashadha",
    "purva ashad": "purva ashadha",
    "poorva ashad": "purva ashadha",
    
    # Uttara Ashadha / Uttar Ashadha
    "uttara ashadha": "uttara ashadha",
    "uttar ashadha": "uttara ashadha",
    "uttara ashad": "uttara ashadha",
    "uttar ashad": "uttara ashadha",
    
    # Shravana / Sravana
    "shravana": "shravana",
    "sravana": "shravana",
    
    # Dhanishta
    "dhanishta": "dhanishta",
    
    # Shatabhisha / Satabhisha / Shatataraka
    "shatabhisha": "shatabhisha",
    "satabhisha": "shatabhisha",
    "shatataraka": "shatabhisha",
    
    # Purva Bhadrapada / Poorva Bhadrapada
    "purva bhadrapada": "purva bhadrapada",
    "poorva bhadrapada": "purva bhadrapada",
    "purva bhadra": "purva bhadrapada",
    "poorva bhadra": "purva bhadrapada",
    
    # Uttara Bhadrapada / Uttar Bhadrapada
    "uttara bhadrapada": "uttara bhadrapada",
    "uttar bhadrapada": "uttara bhadrapada",
    "uttara bhadra": "uttara bhadrapada",
    "uttar bhadra": "uttara bhadrapada",
    
    # Revati / Revti
    "revati": "revati",
    "revti": "revati",
}

# Gandmool nakshatras (6 specific ones)
GANDMOOL_NAKSHATRAS = {
    "ashwini",
    "aslesha",
    "magha",
    "jyeshtha",
    "mula",
    "revati"
}


def normalize_nakshatra(name: Any) -> str:
    """
    Normalize a nakshatra name to canonical form.
    
    Handles case-insensitivity, spelling variations, and dictionary payloads.
    
    Args:
        name: Raw nakshatra name (str, dict, list, or None)
        
    Returns:
        Normalized nakshatra name (lowercase, canonical spelling)
    """
    cleaned = extract_and_clean_string(name)
    return NAKSHATRA_ALIASES.get(cleaned, cleaned)


def is_gandmool_nakshatra(name: Any) -> bool:
    """
    Check if a nakshatra is a Gandmool nakshatra.
    
    Gandmool nakshatras: Ashwini, Aslesha, Magha, Jyeshtha, Mula, Revati
    
    Args:
        name: Raw nakshatra name (str, dict, list, or None)
        
    Returns:
        True if nakshatra is Gandmool, False otherwise
    """
    normalized = normalize_nakshatra(name)
    return normalized in GANDMOOL_NAKSHATRAS


def match_nakshatra(value: Any, target_nakshatras: List[str]) -> bool:
    """
    Check if a nakshatra value matches any in the target list.
    
    Handles case-insensitivity and spelling variations.
    
    Args:
        value: Raw nakshatra value to check
        target_nakshatras: List of target nakshatras (will be normalized)
        
    Returns:
        True if value matches any target nakshatra
    """
    normalized_value = normalize_nakshatra(value)
    normalized_targets = [normalize_nakshatra(n) for n in target_nakshatras]
    return normalized_value in normalized_targets


# ============================================================================
# PLANET NORMALIZATION
# ============================================================================

PLANET_ALIASES = {
    # Sun
    "sun": "sun",
    "surya": "sun",
    
    # Moon
    "moon": "moon",
    "chandra": "moon",
    
    # Mars
    "mars": "mars",
    "mangal": "mars",
    "angaraka": "mars",
    "kuja": "mars",
    
    # Mercury
    "mercury": "mercury",
    "budha": "mercury",
    
    # Jupiter
    "jupiter": "jupiter",
    "guru": "jupiter",
    "brihaspati": "jupiter",
    
    # Venus
    "venus": "venus",
    "shukra": "venus",
    
    # Saturn
    "saturn": "saturn",
    "shani": "saturn",
    
    # Rahu (North Node)
    "rahu": "rahu",
    "north node": "rahu",
    "northnode": "rahu",
    
    # Ketu (South Node)
    "ketu": "ketu",
    "south node": "ketu",
    "southnode": "ketu",
}

# Malefic planets
MALEFIC_PLANETS = {"mars", "saturn", "rahu", "ketu"}

# Benefic planets
BENEFIC_PLANETS = {"jupiter", "venus"}

# Neutral planets
NEUTRAL_PLANETS = {"sun", "moon", "mercury"}


def normalize_planet(name: Any) -> str:
    """
    Normalize a planet name to canonical form.
    
    Handles case-insensitivity, spelling variations, aliases (Rahu/North Node),
    and dictionary payloads.
    
    Args:
        name: Raw planet name (str, dict, list, or None)
        
    Returns:
        Normalized planet name (lowercase, canonical spelling)
    """
    cleaned = extract_and_clean_string(name)
    # Remove symbols like ♂, ♀, ☊, ☋
    cleaned = cleaned.replace("♂", "").replace("♀", "").replace("☊", "").replace("☋", "").strip()
    return PLANET_ALIASES.get(cleaned, cleaned)


def is_malefic_planet(name: Any) -> bool:
    """
    Check if a planet is malefic.
    
    Malefic planets: Mars, Saturn, Rahu, Ketu
    
    Args:
        name: Raw planet name
        
    Returns:
        True if planet is malefic
    """
    normalized = normalize_planet(name)
    return normalized in MALEFIC_PLANETS


def is_benefic_planet(name: Any) -> bool:
    """
    Check if a planet is benefic.
    
    Benefic planets: Jupiter, Venus
    
    Args:
        name: Raw planet name
        
    Returns:
        True if planet is benefic
    """
    normalized = normalize_planet(name)
    return normalized in BENEFIC_PLANETS


def is_neutral_planet(name: Any) -> bool:
    """
    Check if a planet is neutral.
    
    Neutral planets: Sun, Moon, Mercury
    
    Args:
        name: Raw planet name
        
    Returns:
        True if planet is neutral
    """
    normalized = normalize_planet(name)
    return normalized in NEUTRAL_PLANETS


def match_planet(value: Any, target_planets: List[str]) -> bool:
    """
    Check if a planet value matches any in the target list.
    
    Handles case-insensitivity and spelling variations.
    
    Args:
        value: Raw planet value to check
        target_planets: List of target planets (will be normalized)
        
    Returns:
        True if value matches any target planet
    """
    normalized_value = normalize_planet(value)
    normalized_targets = [normalize_planet(p) for p in target_planets]
    return normalized_value in normalized_targets


# ============================================================================
# RASI / ZODIAC SIGN NORMALIZATION
# ============================================================================

RASI_ALIASES = {
    # Aries
    "aries": "aries",
    "mesha": "aries",
    
    # Taurus
    "taurus": "taurus",
    "vrishabha": "taurus",
    
    # Gemini
    "gemini": "gemini",
    "mithuna": "gemini",
    
    # Cancer
    "cancer": "cancer",
    "karka": "cancer",
    "karaka": "cancer",
    
    # Leo
    "leo": "leo",
    "simha": "leo",
    
    # Virgo
    "virgo": "virgo",
    "kanya": "virgo",
    
    # Libra
    "libra": "libra",
    "tula": "libra",
    
    # Scorpio
    "scorpio": "scorpio",
    "vrischika": "scorpio",
    
    # Sagittarius
    "sagittarius": "sagittarius",
    "dhanu": "sagittarius",
    
    # Capricorn
    "capricorn": "capricorn",
    "makara": "capricorn",
    
    # Aquarius
    "aquarius": "aquarius",
    "kumbha": "aquarius",
    
    # Pisces
    "pisces": "pisces",
    "meena": "pisces",
}


def normalize_rasi(name: Any) -> str:
    """
    Normalize a Rasi/Zodiac sign name to canonical form.
    
    Handles case-insensitivity, English/Sanskrit variations, and dictionary payloads.
    
    Args:
        name: Raw Rasi name (str, dict, list, or None)
        
    Returns:
        Normalized Rasi name (lowercase, canonical spelling)
    """
    cleaned = extract_and_clean_string(name)
    return RASI_ALIASES.get(cleaned, cleaned)


def match_rasi(value: Any, target_rasis: List[str]) -> bool:
    """
    Check if a Rasi value matches any in the target list.
    
    Handles case-insensitivity and spelling variations.
    
    Args:
        value: Raw Rasi value to check
        target_rasis: List of target Rasis (will be normalized)
        
    Returns:
        True if value matches any target Rasi
    """
    normalized_value = normalize_rasi(value)
    normalized_targets = [normalize_rasi(r) for r in target_rasis]
    return normalized_value in normalized_targets


# ============================================================================
# HOUSE NORMALIZATION
# ============================================================================

def extract_house_number(house_value: Any) -> Optional[int]:
    """
    Safely extract house number from various payload types.
    
    Handles:
    - Integer: 1, 2, 3, etc.
    - String: "1", "House 1", etc.
    - Dictionary: {"number": 1}, {"house": 1}
    
    Args:
        house_value: Raw house value
        
    Returns:
        House number (1-12) or None if invalid
    """
    if house_value is None:
        return None
    
    # Handle dictionary payloads
    if isinstance(house_value, dict):
        house_value = house_value.get("number") or house_value.get("house") or house_value.get("id")
    
    # Handle string payloads
    if isinstance(house_value, str):
        # Extract digits from strings like "House 1", "1st", etc.
        import re
        match = re.search(r'\d+', house_value)
        if match:
            house_value = int(match.group())
        else:
            return None
    
    # Convert to int and validate
    try:
        house_num = int(house_value)
        if 1 <= house_num <= 12:
            return house_num
    except (ValueError, TypeError):
        pass
    
    return None


# ============================================================================
# DEGREE NORMALIZATION
# ============================================================================

def extract_degree(degree_value: Any) -> Optional[float]:
    """
    Safely extract degree value from various payload types.
    
    Handles:
    - Float/Int: 15.5, 15, etc.
    - String: "15.5°", "15°30'", etc.
    - Dictionary: {"value": 15.5}, {"degree": 15.5}
    
    Args:
        degree_value: Raw degree value
        
    Returns:
        Degree value (0-360) or None if invalid
    """
    if degree_value is None:
        return None
    
    # Handle dictionary payloads
    if isinstance(degree_value, dict):
        degree_value = degree_value.get("value") or degree_value.get("degree") or degree_value.get("amount")
    
    # Handle string payloads
    if isinstance(degree_value, str):
        # Extract numeric value from strings like "15.5°", "15°30'", etc.
        import re
        match = re.search(r'(\d+\.?\d*)', degree_value)
        if match:
            degree_value = float(match.group(1))
        else:
            return None
    
    # Convert to float and validate
    try:
        degree = float(degree_value)
        if 0 <= degree <= 360:
            return degree
    except (ValueError, TypeError):
        pass
    
    return None
