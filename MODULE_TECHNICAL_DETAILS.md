# PyJHora Module Technical Details

## 1. Horoscope Class (main.py) - Core Engine

### Class Structure

```python
class Horoscope:
    def __init__(self, place_with_country_code=None, latitude=None, longitude=None,
                 timezone_offset=None, date_in=None, birth_time=None,
                 calculation_type='drik', years=1, months=1, sixty_hours=1,
                 pravesha_type=0, bhava_madhya_method=const.bhaava_madhya_method,
                 language='en'):
```

### Key Attributes

| Attribute | Type | Purpose |
|-----------|------|---------|
| `place_name` | str | Birth location name |
| `latitude` | float | Birth location latitude (-90 to 90) |
| `longitude` | float | Birth location longitude (-180 to 180) |
| `timezone_offset` | float | UTC offset in hours |
| `Date` | drik.Date | Birth date object (year, month, day) |
| `birth_time` | tuple | Birth time (hour, minute, second) |
| `Place` | drik.Place | Place object with coordinates |
| `julian_day` | float | Julian Day Number at birth |
| `julian_years` | float | Julian Day Number for annual chart |
| `ayanamsa_mode` | str | Ayanamsa method (Lahiri, Raman, etc.) |
| `ayanamsa_value` | float | Ayanamsa value in degrees |
| `calculation_type` | str | 'drik' or 'ss' (Surya Siddhanta) |
| `calendar_info` | dict | Panchanga information |
| `bhava_chart` | dict | House cusps and planets in houses |
| `bhava_chart_info` | dict | Detailed house information |
| `years`, `months`, `sixty_hours` | int | For annual/monthly charts |

### Initialization Flow

```python
def __init__(self, ...):
    # 1. Set language and load resources
    self._language = language
    utils.set_language(language)
    self.cal_key_list = utils.resource_strings
    
    # 2. Store location information
    self.place_name = place_with_country_code
    self.latitude = latitude
    self.longitude = longitude
    self.timezone_offset = timezone_offset
    
    # 3. Resolve location if needed (using Nominatim)
    if self.place_name is None:
        if self.latitude is None or self.longitude is None or self.timezone_offset is None:
            raise ValueError('Provide place_with_country_code or lat/long/tz')
    else:
        if self.latitude is None or self.longitude is None or self.timezone_offset is None:
            [_, self.latitude, self.longitude, self.timezone_offset] = \
                utils.get_location_using_nominatim(place_with_country_code)
    
    # 4. Create Date and Place objects
    self.Date = drik.Date(date_in.year, date_in.month, date_in.day)
    self.Place = drik.Place(self.place_name, self.latitude, self.longitude, 
                           self.timezone_offset)
    
    # 5. Convert birth time to Julian Day
    self.julian_utc = utils.gregorian_to_jd(self.Date)
    if birth_time is not None:
        # Parse HH:MM:SS format
        btArr = birth_time.split(':')
        self.julian_day = swe.julday(self.Date.year, self.Date.month, self.Date.day,
                                     int(btArr[0]) + int(btArr[1])/60 + int(btArr[2])/3600)
        self.birth_time = (int(btArr[0]), int(btArr[1]), int(btArr[2]))
    else:
        self.julian_day = utils.gregorian_to_jd(self.Date)
    
    # 6. Set ayanamsa mode
    if calculation_type.lower() == 'ss':
        drik.set_ayanamsa_mode('SURYASIDDHANTA')
    self.ayanamsa_mode = const._DEFAULT_AYANAMSA_MODE
    self.ayanamsa_value = drik.get_ayanamsa_value(self.julian_day)
    
    # 7. Store annual/monthly parameters
    self.years = years
    self.months = months
    self.sixty_hours = sixty_hours
    
    # 8. Calculate annual/monthly chart date
    self.julian_years = drik.next_solar_date(self.julian_day, self.Place, 
                                             years, months, sixty_hours)
    
    # 9. Get calendar information
    self.calendar_info = self.get_calendar_information()
    
    # 10. Calculate bhava chart
    self.bhava_chart, self.bhava_chart_info, self._bhava_ascendant_house = \
        self.get_bhava_chart_information(self.julian_years, self.Place, 
                                         bhava_madhya_method)
```

### Key Methods

#### `get_horoscope_information_for_chart(chart_index, chart_method, divisional_chart_factor, ...)`

```python
def get_horoscope_information_for_chart(self, chart_index, chart_method=None,
                                       divisional_chart_factor=None, ...):
    """
    Get complete chart information for a divisional chart
    
    Args:
        chart_index: Index of divisional chart (0=D1, 1=D2, 8=D9, etc.)
        chart_method: Calculation method for the chart
        divisional_chart_factor: Custom divisional factor (e.g., 9 for D9)
        
    Returns:
        (chart_info_dict, chart_1d_list, ascendant_house)
        
    chart_info_dict: {
        'planet_name': {
            'longitude': float (0-360),
            'raasi': int (0-11),
            'nakshatra': int (0-26),
            'pada': int (1-4),
            'retrograde': bool,
            'combustion': bool,
            'speed': float,
            'house': int (1-12),
            'house_lord': str,
            'strength': float,
            ...
        },
        ...
    }
    
    chart_1d_list: [
        (house_number, 'planet_indices_as_string'),
        ...
    ]
    """
    # 1. Get planet positions in divisional chart
    if chart_index == mixed_chart_index:
        planet_positions = charts.mixed_chart(self.julian_years, self.Place, ...)
    else:
        planet_positions = charts.divisional_chart(self.julian_years, self.Place,
                                                   divisional_chart_factor=dcf, ...)
    
    # 2. Get house cusps for the chart
    house_cusps = house.get_house_cusps(self.julian_years, self.Place, ...)
    
    # 3. Compile chart information
    chart_info = {}
    for planet_index, (longitude, retrograde, combustion) in planet_positions.items():
        chart_info[planet_name] = {
            'longitude': longitude,
            'raasi': get_sign(longitude),
            'nakshatra': get_nakshatra(longitude),
            'pada': get_pada(longitude),
            'retrograde': retrograde,
            'combustion': combustion,
            'house': get_house(longitude, house_cusps),
            ...
        }
    
    # 4. Create 1D chart representation
    chart_1d = create_1d_chart(planet_positions, house_cusps)
    
    # 5. Get ascendant house
    ascendant_house = get_house(house_cusps[0], house_cusps)
    
    return chart_info, chart_1d, ascendant_house
```

#### `get_calendar_information()`

```python
def get_calendar_information(self):
    """
    Get complete panchanga information for birth date/time
    
    Returns:
        Dictionary with keys:
        - place_str: Birth location
        - latitude_str, longitude_str: Coordinates
        - timezone_offset_str: UTC offset
        - report_date_str: Birth date
        - vaaram_str: Day of week
        - calculation_type_str: Drik or Surya Siddhanta
        - tithi_str, tithi_number: Lunar day
        - paksha_str: Lunar phase
        - nakshatra_str, nakshatra_number: Star
        - yoga_str, yoga_number: Auspicious time
        - karana_str, karana_number: Half lunar day
        - lunar_month_str: Lunar month
        - adhik_maasa_str: Intercalary month
        - tamil_month_str, tamil_date_str: Tamil calendar
        - sunrise_str, sunset_str: Daily timings
        - ayanamsa_str: Precession value
        - ... and many more
    """
    jd = self.julian_day
    place = self.Place
    
    cal_info = {}
    
    # Get all panchanga elements
    cal_info['vaaram'] = drik.vaara(jd)
    cal_info['tithi'] = drik.tithi(jd, place)
    cal_info['nakshatra'] = drik.nakshatra(jd, place)
    cal_info['yoga'] = drik.yoga(jd, place)
    cal_info['karana'] = drik.karana(jd, place)
    cal_info['lunar_month'] = drik.lunar_month(jd, place)
    cal_info['tamil_calendar'] = drik.tamil_solar_month_and_date(self.Date, place)
    cal_info['sunrise_sunset'] = drik.sunrise_sunset(jd, place)
    
    # Format for display
    # ... (convert to string format with resource strings)
    
    return cal_info
```

#### `_get_vimsottari_dhasa_bhukthi(dob, tob, place, ...)`

```python
def _get_vimsottari_dhasa_bhukthi(self, dob, tob, place, ...):
    """
    Calculate Vimsottari dhasa/bhukthi periods
    
    Args:
        dob: Birth date (drik.Date)
        tob: Birth time (tuple)
        place: Birth place (drik.Place)
        
    Returns:
        List of dhasa periods with bhukthi sub-periods
    """
    # Delegate to vimsottari module
    return vimsottari.get_vimsottari_dhasa_bhukthi(dob, tob, place)
```

---

## 2. Chart Calculations Module (charts.py)

### Key Functions

#### `divisional_chart(jd, place, divisional_chart_factor, chart_method, ...)`

```python
def divisional_chart(jd, place, divisional_chart_factor=1, chart_method=0, 
                    base_rasi=None, count_from_end_of_sign=None):
    """
    Calculate planet positions in a divisional chart
    
    Args:
        jd: Julian Day Number
        place: Birth place (drik.Place)
        divisional_chart_factor: D-value (1=D1, 2=D2, 9=D9, etc.)
        chart_method: Calculation method (0=standard, 1=alternative, etc.)
        base_rasi: Base sign for calculation (for some methods)
        count_from_end_of_sign: Count from end of sign (for some methods)
        
    Returns:
        Dictionary: {planet_index: (longitude, retrograde, combustion), ...}
    """
    planet_positions = {}
    
    # 1. Get planet positions in D1 (natal chart)
    for planet_index in range(len(drik.planet_list)):
        d1_longitude = drik.get_planet_longitude(jd, planet_index)
        
        # 2. Convert to divisional chart
        if divisional_chart_factor == 1:
            divisional_longitude = d1_longitude
        else:
            divisional_longitude = convert_to_divisional(d1_longitude, 
                                                         divisional_chart_factor,
                                                         chart_method)
        
        # 3. Check retrograde status
        retrograde = drik.is_retrograde(jd, planet_index)
        
        # 4. Check combustion status
        sun_longitude = drik.get_planet_longitude(jd, 0)  # Sun
        combustion = is_combusted(divisional_longitude, sun_longitude, planet_index)
        
        planet_positions[planet_index] = (divisional_longitude, retrograde, combustion)
    
    return planet_positions

def convert_to_divisional(d1_longitude, divisional_factor, chart_method=0):
    """
    Convert D1 longitude to divisional chart longitude
    
    Algorithm:
        1. Normalize longitude to 0-360
        2. Determine sign: sign = floor(longitude / 30)
        3. Position in sign: pos = longitude % 30
        4. Division size: div_size = 30 / divisional_factor
        5. Division number: div_num = floor(pos / div_size)
        6. Divisional sign: div_sign = (sign * divisional_factor + div_num) % 12
        7. Divisional longitude: div_long = (div_sign * 30) + (pos % div_size) * divisional_factor
    """
    normalized = d1_longitude % 360
    sign = int(normalized / 30)
    pos = normalized % 30
    
    div_size = 30.0 / divisional_factor
    div_num = int(pos / div_size)
    
    div_sign = (sign * divisional_factor + div_num) % 12
    div_pos = (pos % div_size) * divisional_factor
    
    divisional_longitude = (div_sign * 30) + div_pos
    
    return divisional_longitude % 360
```

#### `mixed_chart(jd, place, varga_factor_1, chart_method_1, varga_factor_2, chart_method_2)`

```python
def mixed_chart(jd, place, varga_factor_1, chart_method_1, 
               varga_factor_2, chart_method_2):
    """
    Calculate planet positions in a mixed divisional chart (e.g., D1xD9)
    
    Args:
        varga_factor_1: First divisional factor (e.g., 1 for D1)
        chart_method_1: Method for first chart
        varga_factor_2: Second divisional factor (e.g., 9 for D9)
        chart_method_2: Method for second chart
        
    Returns:
        Dictionary: {planet_index: (longitude, retrograde, combustion), ...}
    """
    # 1. Get positions in first divisional chart
    chart1_positions = divisional_chart(jd, place, varga_factor_1, chart_method_1)
    
    # 2. Get positions in second divisional chart
    chart2_positions = divisional_chart(jd, place, varga_factor_2, chart_method_2)
    
    # 3. Combine positions
    mixed_positions = {}
    for planet_index in chart1_positions:
        long1 = chart1_positions[planet_index][0]
        long2 = chart2_positions[planet_index][0]
        
        # Average or blend the longitudes
        mixed_longitude = (long1 + long2) / 2
        
        mixed_positions[planet_index] = (mixed_longitude, 
                                        chart1_positions[planet_index][1],
                                        chart1_positions[planet_index][2])
    
    return mixed_positions
```

---

## 3. House Calculation Module (house.py)

### Key Functions

#### `get_house_cusps(jd, place, bhava_madhya_method)`

```python
def get_house_cusps(jd, place, bhava_madhya_method=const.bhaava_madhya_method):
    """
    Calculate 12 house cusps using specified method
    
    Args:
        jd: Julian Day Number
        place: Birth place (drik.Place)
        bhava_madhya_method: House calculation method
                            0=Placidus, 1=Koch, 2=Regiomontanus, etc.
        
    Returns:
        List of 12 house cusps (0-360°)
        [Ascendant, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th]
    """
    # 1. Calculate sidereal time
    sidereal_time = calculate_sidereal_time(jd, place.longitude)
    
    # 2. Calculate Ascendant (1st house)
    ascendant = calculate_ascendant(sidereal_time, place.latitude)
    
    # 3. Calculate Midheaven (10th house)
    midheaven = sidereal_time  # In ecliptic coordinates
    
    # 4. Calculate other house cusps based on method
    house_cusps = [0] * 12
    house_cusps[0] = ascendant
    house_cusps[9] = midheaven
    
    if bhava_madhya_method == 0:  # Placidus
        house_cusps = calculate_placidus_houses(sidereal_time, place.latitude)
    elif bhava_madhya_method == 1:  # Koch
        house_cusps = calculate_koch_houses(sidereal_time, place.latitude)
    # ... other methods
    
    # 5. Normalize all cusps to 0-360
    for i in range(12):
        house_cusps[i] = house_cusps[i] % 360
        if house_cusps[i] < 0:
            house_cusps[i] += 360
    
    return house_cusps

def calculate_placidus_houses(sidereal_time, latitude):
    """
    Calculate house cusps using Placidus method
    
    Placidus is based on dividing the celestial equator into 12 equal parts
    and projecting them onto the ecliptic.
    """
    house_cusps = [0] * 12
    
    # Calculate Ascendant and Midheaven
    asc = calculate_ascendant(sidereal_time, latitude)
    mc = sidereal_time
    
    house_cusps[0] = asc
    house_cusps[9] = mc
    
    # Calculate intermediate houses using interpolation
    for house_num in range(1, 12):
        if house_num == 9:
            continue
        
        # Calculate house angle (30° per house)
        house_angle = (house_num * 30) % 360
        
        # Use Placidus formula with declination
        declination = calculate_declination(sidereal_time, latitude)
        
        # Interpolate cusp position
        cusp = interpolate_placidus_cusp(house_angle, declination, latitude)
        
        house_cusps[house_num] = cusp % 360
    
    return house_cusps
```

#### `get_planets_in_houses(planet_positions, house_cusps)`

```python
def get_planets_in_houses(planet_positions, house_cusps):
    """
    Assign planets to houses based on their longitudes
    
    Args:
        planet_positions: Dict of planet longitudes
        house_cusps: List of 12 house cusps
        
    Returns:
        Dict: {planet_index: house_number (1-12), ...}
    """
    planets_in_houses = {}
    
    for planet_index, (longitude, _, _) in planet_positions.items():
        # Find which house contains this planet
        for house_num in range(12):
            cusp_start = house_cusps[house_num]
            cusp_end = house_cusps[(house_num + 1) % 12]
            
            # Handle wraparound at 0°
            if cusp_start <= cusp_end:
                if cusp_start <= longitude < cusp_end:
                    planets_in_houses[planet_index] = house_num + 1
                    break
            else:  # Wraparound case
                if longitude >= cusp_start or longitude < cusp_end:
                    planets_in_houses[planet_index] = house_num + 1
                    break
    
    return planets_in_houses

def get_house_lord(house_number, house_cusps):
    """
    Get the lord (ruler) of a house
    
    The lord of a house is the planet that rules the sign on the house cusp
    
    Args:
        house_number: House number (1-12)
        house_cusps: List of 12 house cusps
        
    Returns:
        Planet index (0-8) that rules the house
    """
    cusp_longitude = house_cusps[house_number - 1]
    sign = int(cusp_longitude / 30)
    
    # Sign rulers
    sign_rulers = [
        0,  # Aries → Sun
        1,  # Taurus → Venus
        2,  # Gemini → Mercury
        3,  # Cancer → Moon
        4,  # Leo → Sun
        5,  # Virgo → Mercury
        6,  # Libra → Venus
        7,  # Scorpio → Mars
        8,  # Sagittarius → Jupiter
        6,  # Capricorn → Saturn
        8,  # Aquarius → Saturn
        1   # Pisces → Jupiter
    ]
    
    return sign_rulers[sign]
```

#### `raasi_drishti_from_chart(chart_1d, separator)`

```python
def raasi_drishti_from_chart(chart_1d, separator='\n'):
    """
    Calculate sign aspects (Raasi Drishti) from chart
    
    Raasi Drishti rules:
    - All planets aspect 7th sign
    - Mars aspects 4th and 8th
    - Jupiter aspects 5th and 9th
    - Saturn aspects 3rd and 10th
    
    Args:
        chart_1d: 1D chart representation
        separator: String to separate multiple items
        
    Returns:
        (raasi_aspects_from, raasi_aspects_to, raasi_aspects_planets)
    """
    raasi_aspects_from = []
    raasi_aspects_to = []
    raasi_aspects_planets = []
    
    # For each sign
    for sign_num in range(12):
        # Find planets in this sign
        planets_in_sign = get_planets_in_sign(chart_1d, sign_num)
        
        # Calculate aspects from these planets
        aspects_from = []
        aspects_to = []
        aspects_planets = []
        
        for planet in planets_in_sign:
            # 7th aspect (all planets)
            aspect_sign = (sign_num + 7) % 12
            aspects_to.append(aspect_sign)
            aspects_planets.append(planet)
            
            # Special aspects
            if planet == 3:  # Mars
                aspects_to.extend([(sign_num + 4) % 12, (sign_num + 8) % 12])
                aspects_planets.extend([planet, planet])
            elif planet == 5:  # Jupiter
                aspects_to.extend([(sign_num + 5) % 12, (sign_num + 9) % 12])
                aspects_planets.extend([planet, planet])
            elif planet == 7:  # Saturn
                aspects_to.extend([(sign_num + 3) % 12, (sign_num + 10) % 12])
                aspects_planets.extend([planet, planet])
        
        raasi_aspects_from.append(aspects_from)
        raasi_aspects_to.append(aspects_to)
        raasi_aspects_planets.append(aspects_planets)
    
    return raasi_aspects_from, raasi_aspects_to, raasi_aspects_planets
```

---

## 4. Strength Calculation Module (strength.py)

### Key Functions

#### `get_shad_bala(planet_positions, house_cusps, birth_time, place, jd)`

```python
def get_shad_bala(planet_positions, house_cusps, birth_time, place, jd):
    """
    Calculate 6-fold strength (Shad Bala) for all planets
    
    Returns:
        Dict: {planet_index: {'sthana_bala': float, 'kala_bala': float, 
                              'dig_bala': float, 'chesta_bala': float,
                              'naisargika_bala': float, 'drishti_bala': float,
                              'total_shad_bala': float}, ...}
    """
    shad_bala = {}
    
    for planet_index in range(len(drik.planet_list)):
        # 1. Calculate Sthana Bala (Positional Strength)
        sthana_bala = calculate_sthana_bala(planet_index, planet_positions, 
                                           house_cusps, jd)
        
        # 2. Calculate Kala Bala (Temporal Strength)
        kala_bala = calculate_kala_bala(planet_index, birth_time, jd, place)
        
        # 3. Calculate Dig Bala (Directional Strength)
        dig_bala = calculate_dig_bala(planet_index, planet_positions, house_cusps)
        
        # 4. Calculate Chesta Bala (Motional Strength)
        chesta_bala = calculate_chesta_bala(planet_index, jd)
        
        # 5. Calculate Naisargika Bala (Natural Strength)
        naisargika_bala = calculate_naisargika_bala(planet_index)
        
        # 6. Calculate Drishti Bala (Aspect Strength)
        drishti_bala = calculate_drishti_bala(planet_index, planet_positions, 
                                             house_cusps)
        
        # Calculate total
        total_shad_bala = (sthana_bala + kala_bala + dig_bala + chesta_bala + 
                          naisargika_bala + drishti_bala) / 6
        
        shad_bala[planet_index] = {
            'sthana_bala': sthana_bala,
            'kala_bala': kala_bala,
            'dig_bala': dig_bala,
            'chesta_bala': chesta_bala,
            'naisargika_bala': naisargika_bala,
            'drishti_bala': drishti_bala,
            'total_shad_bala': total_shad_bala
        }
    
    return shad_bala

def calculate_sthana_bala(planet_index, planet_positions, house_cusps, jd):
    """
    Calculate positional strength (Sthana Bala)
    
    Components:
    1. Uchcha Bala (Exaltation strength)
    2. Saptavargaja Bala (7-fold divisional strength)
    3. Ojayugma Bala (Even-odd strength)
    """
    # 1. Uchcha Bala
    uchcha_bala = calculate_uchcha_bala(planet_index, planet_positions)
    
    # 2. Saptavargaja Bala
    saptavargaja_bala = calculate_saptavargaja_bala(planet_index, planet_positions)
    
    # 3. Ojayugma Bala
    ojayugma_bala = calculate_ojayugma_bala(planet_index, planet_positions, jd)
    
    sthana_bala = (uchcha_bala + saptavargaja_bala + ojayugma_bala) / 3
    
    return sthana_bala

def calculate_uchcha_bala(planet_index, planet_positions):
    """
    Calculate exaltation strength
    
    Maximum strength (60) when planet is at exaltation point
    Decreases as planet moves away from exaltation point
    """
    longitude = planet_positions[planet_index][0]
    
    # Exaltation points for each planet
    exaltation_points = {
        0: 10,    # Sun at 10° Aries
        1: 3,     # Moon at 3° Taurus
        2: 28,    # Mars at 28° Capricorn
        3: 15,    # Mercury at 15° Virgo
        4: 5,     # Jupiter at 5° Cancer
        5: 27,    # Venus at 27° Pisces
        6: 20,    # Saturn at 20° Libra
        7: 15,    # Rahu at 15° Gemini
        8: 15     # Ketu at 15° Sagittarius
    }
    
    exaltation_sign = exaltation_points[planet_index] // 30
    exaltation_longitude = exaltation_points[planet_index]
    
    # Calculate distance from exaltation point
    distance = abs(longitude - exaltation_longitude)
    if distance > 180:
        distance = 360 - distance
    
    # Uchcha bala decreases from 60 at exaltation to 0 at debilitation (180° away)
    uchcha_bala = 60 * (1 - distance / 180)
    
    return max(0, uchcha_bala)
```

---

## 5. Panchanga Module (drik.py)

### Key Functions

#### `tithi(jd, place)`

```python
def tithi(jd, place):
    """
    Calculate lunar day (tithi) at given time
    
    Returns:
        (tithi_number, tithi_position)
        tithi_number: 0-29 (0-14 = Shukla paksha, 15-29 = Krishna paksha)
        tithi_position: 0-1 (position within tithi)
    """
    # Get Sun and Moon longitudes
    sun_longitude = get_planet_longitude(jd, 0)  # Sun
    moon_longitude = get_planet_longitude(jd, 1)  # Moon
    
    # Calculate phase angle
    phase_angle = (moon_longitude - sun_longitude) % 360
    
    # Tithi = phase_angle / 12 (360° / 30 tithis = 12° per tithi)
    tithi_number = int(phase_angle / 12)
    tithi_position = (phase_angle % 12) / 12
    
    if tithi_number > 29:
        tithi_number = 29
    
    return (tithi_number, tithi_position)

def nakshatra(jd, place):
    """
    Calculate star (nakshatra) at given time
    
    Returns:
        (nakshatra_number, pada, nakshatra_position)
        nakshatra_number: 0-26
        pada: 1-4 (quarter of nakshatra)
        nakshatra_position: 0-1 (position within nakshatra)
    """
    # Get Moon longitude
    moon_longitude = get_planet_longitude(jd, 1)
    
    # Normalize to 0-360
    normalized = moon_longitude % 360
    
    # Nakshatra = longitude / 13.333 (360° / 27 nakshatras = 13.333° per nakshatra)
    nakshatra_number = int(normalized / 13.333)
    nakshatra_position = (normalized % 13.333) / 13.333
    
    # Pada = position * 4 (4 padas per nakshatra)
    pada = int(nakshatra_position * 4) + 1
    
    if nakshatra_number > 26:
        nakshatra_number = 26
    if pada > 4:
        pada = 4
    
    return (nakshatra_number, pada, nakshatra_position)

def vaara(jd):
    """
    Calculate day of week
    
    Returns:
        Day number: 0=Sunday, 1=Monday, ..., 6=Saturday
    """
    # Convert JD to day of week
    day_of_week = int((jd + 1.5) % 7)
    
    return day_of_week

def lunar_month(jd, place):
    """
    Calculate lunar month
    
    Returns:
        (month_number, is_adhik_maasa, is_nija_maasa)
        month_number: 1-12
        is_adhik_maasa: True if intercalary month
        is_nija_maasa: True if regular month
    """
    # Get tithi
    tithi_num, _ = tithi(jd, place)
    
    # Get Sun's position (for solar month)
    sun_longitude = get_planet_longitude(jd, 0)
    solar_month = int(sun_longitude / 30)
    
    # Lunar month = solar month at new moon
    # Check if this is adhik maasa (intercalary month)
    # ... complex calculation involving new moons
    
    return (lunar_month_number, is_adhik, is_nija)

def sunrise_sunset(jd, place):
    """
    Calculate sunrise and sunset times
    
    Returns:
        (sunrise_jd, sunset_jd)
    """
    # Calculate sunrise/sunset using place coordinates
    # ... astronomical calculations
    
    return (sunrise_jd, sunset_jd)
```

