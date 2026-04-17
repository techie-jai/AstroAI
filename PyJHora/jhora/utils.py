"""
Utility functions for jhora
Extended stub module with proper initialization of constants and language resources
"""

import swisseph as swe
import os
import json

# Planet names and short names
PLANET_NAMES = {
    0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter',
    5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu', 9: 'Uranus',
    10: 'Neptune', 11: 'Pluto'
}

PLANET_SHORT_NAMES = {
    0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju',
    5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke', 9: 'Ur',
    10: 'Ne', 11: 'Pl'
}

# Zodiac signs (Raasi)
RAASI_LIST = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

RAASI_SHORT_LIST = [
    'Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi',
    'Li', 'Sc', 'Sa', 'Cp', 'Aq', 'Pi'
]

# Days of the week
DAYS_LIST = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

# Nakshatras (27 lunar mansions)
NAKSHATRA_LIST = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

# Default resource strings (English)
resource_strings = {
    'place_str': 'Place',
    'latitude_str': 'Latitude',
    'longitude_str': 'Longitude',
    'timezone_offset_str': 'Timezone Offset',
    'report_date_str': 'Report Date',
    'vaaram_str': 'Day',
    'calculation_type_str': 'Calculation Type',
    'drik_panchang_str': 'Drik Panchang',
    'ss_panchang_str': 'Surya Siddhanta',
    'nija_month_str': 'Nija Month',
    'ascendant_str': 'Ascendant'
}

# World cities dictionary (basic)
world_cities_dict = {
    'Delhi,IN': (28.6139, 77.2090, 5.5),
    'Mumbai,IN': (19.0760, 72.8777, 5.5),
    'Bangalore,IN': (12.9716, 77.5946, 5.5),
    'Chennai,IN': (13.0827, 80.2707, 5.5),
    'Kolkata,IN': (22.5726, 88.3639, 5.5),
    'New York,US': (40.7128, -74.0060, -5.0),
    'London,UK': (51.5074, -0.1278, 0.0),
    'Tokyo,JP': (35.6762, 139.6503, 9.0),
    'Sydney,AU': (-33.8688, 151.2093, 10.0),
}

_current_language = 'en'

def set_language(lang_code):
    """Set language for output"""
    global _current_language
    _current_language = lang_code

def get_language():
    """Get current language"""
    return _current_language

def set_flags_for_planet_positions():
    """Set flags for planet position calculations"""
    return swe.FLG_SWIEPH | swe.FLG_SPEED

def set_flags_for_rise_set(flags_for_rise=True):
    """Set flags for rise/set calculations"""
    flags = swe.FLG_SPEED
    if flags_for_rise:
        flags |= swe.FLG_EQUATORIAL
    return flags

def get_planet_name(planet_id):
    """Get planet name from ID"""
    return PLANET_NAMES.get(planet_id, 'Unknown')

def get_sign_name(sign_id):
    """Get zodiac sign name from ID"""
    return RAASI_LIST[sign_id % 12] if 0 <= sign_id < 12 else 'Unknown'

def get_nakshatra_name(nakshatra_id):
    """Get nakshatra name from ID"""
    return NAKSHATRA_LIST[nakshatra_id % 27] if 0 <= nakshatra_id < 27 else 'Unknown'

def julian_day_number(date_obj, time_tuple=None):
    """Calculate Julian Day Number from date and time"""
    # Handle both date objects and tuples
    if isinstance(date_obj, tuple):
        year, month, day = date_obj[0], date_obj[1], date_obj[2]
    else:
        year, month, day = date_obj.year, date_obj.month, date_obj.day
    
    # Handle time tuple
    if time_tuple is None:
        hour, minute, second = 12, 0, 0
    elif isinstance(time_tuple, tuple):
        hour = time_tuple[0]
        minute = time_tuple[1] if len(time_tuple) > 1 else 0
        second = time_tuple[2] if len(time_tuple) > 2 else 0
    else:
        hour, minute, second = 12, 0, 0
    
    return swe.julday(year, month, day, hour + minute/60.0 + second/3600.0)

def gregorian_to_jd(date_obj):
    """Convert Gregorian date to Julian Day"""
    return swe.julday(date_obj.year, date_obj.month, date_obj.day, 12.0)

def jd_to_gregorian(jd):
    """Convert Julian Day to Gregorian date"""
    return swe.revjul(jd)

def julian_day_utc(jd, place):
    """Get Julian Day in UTC"""
    return jd

def to_dms(value, is_lat_long='plong', as_string=False):
    """Convert decimal degrees to DMS format"""
    is_negative = value < 0
    value = abs(value)
    degrees = int(value)
    minutes = int((value - degrees) * 60)
    seconds = ((value - degrees) * 60 - minutes) * 60
    
    if as_string:
        direction = ''
        if is_lat_long == 'lat':
            direction = 'S' if is_negative else 'N'
        elif is_lat_long in ['plong', 'long']:
            direction = 'W' if is_negative else 'E'
        return f"{degrees}°{minutes}'{seconds:.2f}\"{direction}"
    else:
        return (degrees, minutes, seconds)

def get_location_using_nominatim(place_name):
    """Get location coordinates from place name"""
    # Return from world_cities_dict if available
    if place_name in world_cities_dict:
        lat, lon, tz = world_cities_dict[place_name]
        return place_name, lat, lon, tz
    # Default fallback
    return place_name, 0.0, 0.0, 5.5

def _read_resource_messages_from_file(filepath):
    """Read resource messages from file"""
    return resource_strings

def _read_resource_lists_from_file(filepath):
    """Read resource lists from file"""
    return {
        'RAASI_LIST': RAASI_LIST,
        'NAKSHATRA_LIST': NAKSHATRA_LIST,
        'DAYS_LIST': DAYS_LIST
    }

def norm360(value):
    """Normalize angle to 0-360 range"""
    return value % 360

def flatten_list(nested_list):
    """Flatten a nested list"""
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten_list(item))
        else:
            result.append(item)
    return result

def get_house_planet_list(houses_dict):
    """Get list of planets in houses"""
    planet_list = []
    for house_num in range(12):
        if house_num in houses_dict:
            planet_list.extend(houses_dict[house_num])
    return planet_list

def count_stars(from_star, to_star):
    """Count number of stars from one star to another (1-27)"""
    if from_star < 1 or from_star > 27 or to_star < 1 or to_star > 27:
        return 0
    if from_star == to_star:
        return 0
    if to_star > from_star:
        return to_star - from_star
    else:
        return (27 - from_star) + to_star

def count_rasis(from_rasi, to_rasi):
    """Count number of rasis from one rasi to another (1-12)"""
    if from_rasi < 1 or from_rasi > 12 or to_rasi < 1 or to_rasi > 12:
        return 0
    if from_rasi == to_rasi:
        return 0
    if to_rasi > from_rasi:
        return to_rasi - from_rasi
    else:
        return (12 - from_rasi) + to_rasi
