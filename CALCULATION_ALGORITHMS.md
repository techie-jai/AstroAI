# PyJHora Calculation Algorithms - Technical Details

## 1. Vimsottari Dhasa Calculation

### Overview
Vimsottari is the most widely used dhasa system in Vedic astrology. It operates on a 120-year cycle divided among 9 planets.

### Algorithm

```
Input: Birth Nakshatra (0-26), Birth Time (JD)
Output: Vimsottari dhasa periods with dates

Step 1: Determine Birth Nakshatra
  - Calculate Moon's longitude at birth
  - Divide by 13.33° (27 nakshatras in 360°)
  - Identify nakshatra number (0-26)

Step 2: Determine Nakshatra Lord
  nakshatra_lord = (nakshatra_number % 9)
  Mapping:
    0 → Ketu (7 years)
    1 → Venus (20 years)
    2 → Sun (6 years)
    3 → Moon (10 years)
    4 → Mars (7 years)
    5 → Mercury (17 years)
    6 → Jupiter (16 years)
    7 → Saturn (19 years)
    8 → Rahu (18 years)

Step 3: Calculate Balance of Current Dhasa
  - Calculate Moon's position in birth nakshatra (0-1)
  - balance_years = (1 - position) * nakshatra_lord_years
  - Convert to years, months, days

Step 4: Generate Dhasa Sequence
  Start from nakshatra_lord
  Sequence: Ketu → Venus → Sun → Moon → Mars → Mercury → Jupiter → Saturn → Rahu
  
  For each dhasa:
    dhasa_start_date = previous_dhasa_end_date
    dhasa_duration = planet_years (from Step 2 mapping)
    dhasa_end_date = dhasa_start_date + dhasa_duration
    
    For each bhukthi within dhasa:
      bhukthi_lord = next planet in sequence
      bhukthi_duration = (planet_years * dhasa_lord_years) / 120
      bhukthi_start_date = previous_bhukthi_end_date
      bhukthi_end_date = bhukthi_start_date + bhukthi_duration

Step 5: Repeat until 120 years completed
```

### Code Implementation Reference
File: `jhora/horoscope/dhasa/graha/vimsottari.py`

Key functions:
- `get_vimsottari_dhasa_bhukthi(dob, tob, place)` - Main calculation function
- Returns: List of dhasa periods with bhukthi sub-periods

### Example Calculation
```
Birth Nakshatra: Ashwini (0)
Nakshatra Lord: Ketu (7 years)
Moon Position in Ashwini: 0.3 (30% through)
Balance: (1 - 0.3) * 7 = 4.9 years = 4 years 10 months 24 days

Dhasa Sequence:
1. Ketu: 4y 10m 24d to 11y 10m 24d (balance + 7 years)
2. Venus: 11y 10m 24d to 31y 10m 24d (20 years)
3. Sun: 31y 10m 24d to 37y 10m 24d (6 years)
... and so on
```

---

## 2. Ashtottari Dhasa Calculation

### Overview
Ashtottari is an 8-planet dhasa system with a 108-year cycle, used when Moon is in Scorpio to Pisces nakshatras.

### Algorithm

```
Input: Birth Nakshatra, Birth Time (JD)
Output: Ashtottari dhasa periods

Step 1: Check Applicability
  IF birth_nakshatra NOT IN [Vishakha, Anuradha, Jyeshtha, Moola, 
                             Sagittarius, Capricorn, Aquarius, Pisces]:
    Use Vimsottari instead
  ELSE:
    Proceed with Ashtottari

Step 2: Determine Starting Planet
  Planet Sequence: Sun → Moon → Mars → Mercury → Jupiter → Venus → Saturn → Rahu
  
  Nakshatra to Starting Planet Mapping:
    Vishakha (15) → Sun
    Anuradha (16) → Moon
    Jyeshtha (17) → Mars
    Moola (18) → Mercury
    Sagittarius (19) → Jupiter
    Capricorn (20) → Venus
    Aquarius (21) → Saturn
    Pisces (22) → Rahu

Step 3: Calculate Balance
  balance = (1 - moon_position_in_nakshatra) * starting_planet_years
  
  Planet Years: Sun(6), Moon(10), Mars(7), Mercury(17), Jupiter(16), 
                Venus(20), Saturn(19), Rahu(18)

Step 4: Generate Dhasa Periods
  Total cycle: 108 years
  For each dhasa:
    dhasa_duration = planet_years
    bhukthi_duration = (planet_years * dhasa_lord_years) / 108

Step 5: Complete 108-year cycle
```

### Code Implementation Reference
File: `jhora/horoscope/dhasa/graha/ashtottari.py`

---

## 3. Yogini Dhasa Calculation

### Overview
Yogini is a 27-year cycle based on 8 yoginis, primarily used for female natives.

### Algorithm

```
Input: Birth Tithi (Lunar Day), Birth Time (JD)
Output: Yogini dhasa periods

Step 1: Determine Birth Tithi
  - Calculate Sun-Moon angle
  - Divide by 12° (30 tithis in 360°)
  - Identify tithi number (0-29)

Step 2: Determine Starting Yogini
  Yogini Sequence: Mangala → Pingala → Dhanya → Bhramari → Bhairavy → Chulika → Mitra → Siddha
  
  yogini_index = tithi_number % 8
  starting_yogini = yogini_sequence[yogini_index]

Step 3: Assign Yogini Years
  Mangala(1) → Pingala(2) → Dhanya(3) → Bhramari(4) → 
  Bhairavy(5) → Chulika(6) → Mitra(7) → Siddha(8)
  
  Total: 1+2+3+4+5+6+7+8 = 36 years (but cycles in 27 years)

Step 4: Calculate Balance
  balance = (1 - tithi_position) * starting_yogini_years

Step 5: Generate Dhasa Periods
  For each yogini:
    dhasa_duration = yogini_years
    bhukthi_duration = (yogini_years * yogini_lord_years) / 36
```

### Code Implementation Reference
File: `jhora/horoscope/dhasa/graha/yogini.py`

---

## 4. Narayana Rasi Dhasa Calculation

### Overview
Narayana is a 12-sign based dhasa system with a 12-year cycle per sign.

### Algorithm

```
Input: Birth Lagna (Ascendant Sign), Birth Time (JD)
Output: Narayana rasi dhasa periods

Step 1: Determine Birth Lagna
  - Calculate Ascendant longitude
  - Divide by 30° (12 signs in 360°)
  - Identify lagna sign (0-11)

Step 2: Determine Starting Sign
  Sign Sequence: Aries → Taurus → Gemini → Cancer → Leo → Virgo → 
                 Libra → Scorpio → Sagittarius → Capricorn → Aquarius → Pisces
  
  starting_sign = lagna_sign

Step 3: Calculate Balance
  balance = (1 - lagna_position_in_sign) * 12 years

Step 4: Generate Dhasa Periods
  For each sign:
    dhasa_duration = 12 years
    bhukthi_duration = (12 * 12) / 12 = 12 years (each bhukthi = 1 year)
    
    For each bhukthi:
      bhukthi_duration = 1 year
      antara_duration = 1 month

Step 5: Complete 144-year cycle (12 signs × 12 years)
```

### Code Implementation Reference
File: `jhora/horoscope/dhasa/rasi/narayana.py`

---

## 5. Divisional Chart Calculation

### Overview
Divisional charts (Vargas) divide the zodiac into different segments to analyze specific life areas.

### Algorithm

```
Input: Planet Longitude (0-360°), Divisional Chart Factor (D)
Output: Planet position in divisional chart

Step 1: Normalize Longitude
  normalized_longitude = planet_longitude % 360

Step 2: Determine Sign Position
  sign_number = floor(normalized_longitude / 30)
  position_in_sign = normalized_longitude % 30

Step 3: Calculate Divisional Position
  For D-chart (D1, D2, D3, D9, etc.):
    division_size = 30 / D
    division_number = floor(position_in_sign / division_size)
    position_in_division = position_in_sign % division_size

Step 4: Determine Divisional Sign
  divisional_sign = (sign_number * D + division_number) % 12

Step 5: Calculate Exact Divisional Longitude
  divisional_longitude = (divisional_sign * 30) + (position_in_division * D)

Example: D9 (Navamsa)
  Planet at 45° (Taurus 15°)
  sign_number = 1 (Taurus)
  position_in_sign = 15°
  division_size = 30/9 = 3.33°
  division_number = floor(15/3.33) = 4
  divisional_sign = (1*9 + 4) % 12 = 1 (Taurus)
  divisional_longitude = 30 + (15%3.33)*9 = 30 + 40° = 70° (Gemini 10°)
```

### Code Implementation Reference
File: `jhora/horoscope/chart/charts.py`

Key functions:
- `divisional_chart(jd, place, divisional_chart_factor, chart_method)` - Main calculation
- `get_planet_longitude(jd, planet_index)` - Get planet position from ephemeris

---

## 6. House Cusp Calculation (Bhava Madhya)

### Overview
House cusps are calculated using various methods. PyJHora supports multiple bhava madhya (house middle) methods.

### Algorithm - Placidus Method (Most Common)

```
Input: Birth Time (JD), Latitude, Longitude
Output: 12 house cusps (0-360°)

Step 1: Calculate Sidereal Time
  sidereal_time = calculate_sidereal_time(jd, longitude)

Step 2: Calculate Ascendant (House 1)
  ascendant = calculate_ascendant(sidereal_time, latitude)

Step 3: Calculate Midheaven (House 10)
  midheaven = sidereal_time (in ecliptic coordinates)

Step 4: Calculate House Cusps using Placidus
  For each house (1-12):
    IF house == 1:
      cusp = ascendant
    ELIF house == 10:
      cusp = midheaven
    ELSE:
      Use interpolation formula:
      cusp = atan2(tan(declination) * sin(house_angle), cos(house_angle))

Step 5: Normalize all cusps to 0-360°
  cusp = cusp % 360
  if cusp < 0:
    cusp += 360

Step 6: Determine Planets in Houses
  For each planet:
    planet_longitude = get_planet_longitude(jd, planet)
    For each house (1-12):
      IF cusp[house] <= planet_longitude < cusp[house+1]:
        planet_in_house = house
```

### Code Implementation Reference
File: `jhora/horoscope/chart/house.py`

Key functions:
- `get_house_cusps(jd, place, bhava_madhya_method)` - Calculate house cusps
- `get_planets_in_houses(planet_positions, house_cusps)` - Assign planets to houses

---

## 7. Ashtaka Varga Calculation

### Overview
Ashtaka Varga (8-fold strength) assigns bindus (points) to each sign based on planet positions.

### Algorithm

```
Input: Planet Positions (all charts), Ascendant
Output: Bindus for each planet in each sign

Step 1: Define Bindus Rules
  For each planet, define which planets give bindus in which signs:
  
  Sun Bindus: Sun in 1,5,6,8,9 from Sun
  Moon Bindus: Moon in 1,3,6,7,8,9,10,12 from Moon
  Mars Bindus: Mars in 1,2,4,8,12 from Mars
  Mercury Bindus: Mercury in 1,2,4,5,8,9 from Mercury
  Jupiter Bindus: Jupiter in 1,5,6,8,9 from Jupiter
  Venus Bindus: Venus in 1,2,4,5,8,9,12 from Venus
  Saturn Bindus: Saturn in 1,3,6,11 from Saturn
  Rahu Bindus: Rahu in 1,5,9 from Rahu
  Ketu Bindus: Ketu in 1,5,9 from Ketu

Step 2: For Each Sign (0-11)
  For each planet (Sun to Ketu):
    bindus_count = 0
    
    For each other planet:
      other_planet_sign = get_sign(other_planet_longitude)
      house_difference = (other_planet_sign - current_sign) % 12
      
      IF house_difference in planet_bindu_rules:
        bindus_count += 1
    
    ashtaka_varga[planet][sign] = bindus_count

Step 3: Calculate Sodhana (Reduction)
  For each sign:
    total_bindus = sum of all planet bindus in sign
    
    IF total_bindus > 6:
      sodhana_value = total_bindus - 6
    ELSE:
      sodhana_value = 0
    
    sodhana_pinda[sign] = sodhana_value

Step 4: Calculate Pinda
  For each planet:
    pinda = sum of bindus in all 12 signs
    
    IF pinda > 6:
      pinda_sodhana = pinda - 6
    ELSE:
      pinda_sodhana = 0
```

### Code Implementation Reference
File: `jhora/horoscope/chart/ashtakavarga.py`

Key functions:
- `get_ashtaka_varga(planet_positions, ascendant)` - Main calculation
- `get_sodhana(ashtaka_varga)` - Calculate sodhana values

---

## 8. Yoga Calculation

### Overview
Yogas are auspicious or inauspicious planetary combinations. PyJHora calculates 100+ yogas.

### Algorithm - Example: Gajakesari Yoga

```
Input: Planet Positions (all charts)
Output: Yoga presence (True/False) and description

Gajakesari Yoga Definition:
  Jupiter and Moon in Kendra (1st, 4th, 7th, 10th house) from each other

Step 1: Get Moon Position
  moon_sign = get_sign(moon_longitude)
  moon_house = get_house(moon_longitude, house_cusps)

Step 2: Get Jupiter Position
  jupiter_sign = get_sign(jupiter_longitude)
  jupiter_house = get_house(jupiter_longitude, house_cusps)

Step 3: Check Kendra Relationship
  house_difference = (jupiter_house - moon_house) % 12
  
  IF house_difference IN [0, 3, 6, 9]:  # 0=same, 3=4th, 6=7th, 9=10th
    gajakesari_yoga = True
    strength = calculate_strength(moon_position, jupiter_position)
  ELSE:
    gajakesari_yoga = False

Step 4: Return Result
  return {
    'name': 'Gajakesari Yoga',
    'present': gajakesari_yoga,
    'strength': strength,
    'description': 'Jupiter-Moon in Kendra gives prosperity and wisdom'
  }
```

### Common Yoga Calculations

**Rajayoga**: Yoga-karaka planets in Kendra or Trikona
```
IF planet_house IN [1, 4, 5, 7, 9, 10]:
  AND planet_is_yoga_karaka:
    rajayoga_present = True
```

**Parivartana Yoga**: Two planets exchange signs
```
IF planet1_sign == planet2_sign_lord AND planet2_sign == planet1_sign_lord:
  parivartana_yoga = True
```

**Neecha Bhanga Yoga**: Debilitated planet gets cancellation
```
IF planet_debilitated:
  IF planet_debilitation_lord_in_kendra_or_trikona:
    OR planet_debilitation_lord_aspected_by_exalted_planet:
      neecha_bhanga_yoga = True
```

### Code Implementation Reference
File: `jhora/horoscope/chart/yoga.py`

Key functions:
- `get_yogas(chart_info, house_cusps)` - Calculate all yogas
- `check_gajakesari_yoga()`, `check_rajayoga()`, etc. - Individual yoga checks

---

## 9. Dosha Calculation

### Overview
Doshas are afflictions that affect marriage compatibility. Main doshas: Mangal, Nadi, Bhakoot, Kuja.

### Algorithm - Mangal Dosha

```
Input: Mars Position, House Cusps
Output: Mangal Dosha presence and severity

Step 1: Check Mars Position
  mars_house = get_house(mars_longitude, house_cusps)

Step 2: Check Dosha Conditions
  mangal_dosha = False
  
  IF mars_house IN [1, 4, 7, 8, 12]:  # Inauspicious houses for Mars
    IF mars_not_in_own_sign AND mars_not_exalted:
      mangal_dosha = True

Step 3: Check Cancellation Conditions
  IF mars_in_own_sign OR mars_exalted:
    mangal_dosha = False
  
  IF jupiter_or_venus_in_same_house_as_mars:
    mangal_dosha = False
  
  IF mars_aspected_by_jupiter_or_venus:
    mangal_dosha = False

Step 4: Determine Severity
  IF mangal_dosha:
    IF mars_in_1st_house:
      severity = 'High'
    ELIF mars_in_4th_or_7th_house:
      severity = 'Medium'
    ELIF mars_in_8th_or_12th_house:
      severity = 'Low'

Step 5: Return Result
  return {
    'name': 'Mangal Dosha',
    'present': mangal_dosha,
    'severity': severity,
    'cancellation': cancellation_reason
  }
```

### Code Implementation Reference
File: `jhora/horoscope/chart/dosha.py`

Key functions:
- `get_doshas(chart_info, house_cusps)` - Calculate all doshas
- `check_mangal_dosha()`, `check_nadi_dosha()`, etc. - Individual dosha checks

---

## 10. Arudha Pada Calculation

### Overview
Arudha Padas are derived lagnas calculated from planet positions and their lords.

### Algorithm

```
Input: Planet Positions, House Cusps, Chart Information
Output: Arudha Pada positions (A1, A2, A3, etc.)

Step 1: Get Planet House
  planet_house = get_house(planet_longitude, house_cusps)

Step 2: Get House Lord
  house_lord = get_house_lord(planet_house)
  house_lord_sign = get_sign(house_lord_longitude)

Step 3: Calculate Arudha
  arudha_sign = (planet_house + house_lord_sign) % 12
  
  IF arudha_sign == planet_house:
    arudha_sign = planet_house  # Same house
  ELSE:
    arudha_sign = arudha_sign

Step 4: Calculate Arudha Longitude
  arudha_longitude = (arudha_sign * 30) + planet_position_in_sign

Step 5: Determine Arudha House
  arudha_house = get_house(arudha_longitude, house_cusps)

Example: A1 (Arudha Lagna)
  Lagna = Aries 15°
  Lagna Lord (Sun) = Gemini 20°
  
  Arudha Sign = (1 + 2) % 12 = 3 (Cancer)
  Arudha Longitude = 90° + 15° = 105° (Cancer 15°)
  A1 = Cancer 15°
```

### Code Implementation Reference
File: `jhora/horoscope/chart/arudhas.py`

Key functions:
- `get_arudha_padhas(planet_positions, house_cusps)` - Calculate all arudhas
- `get_argala(arudha_positions)` - Calculate argala (intervention)

---

## 11. Strength (Bala) Calculations

### Algorithm - Shad Bala (6-fold strength)

```
Input: Planet Positions, House Cusps, Birth Time
Output: Strength values for each planet

Shad Bala Components:

1. STHANA BALA (Positional Strength)
   a) Uchcha Bala (Exaltation Strength)
      IF planet_exalted:
        uchcha_bala = 60 (maximum)
      ELSE:
        uchcha_bala = (planet_distance_from_exaltation_point / 180) * 60
   
   b) Saptavargaja Bala (7-fold divisional strength)
      saptavargaja = sum of planet strength in D1, D3, D7, D9, D16, D27, D30
      saptavargaja_bala = (saptavargaja / 7) * 60
   
   c) Ojayugma Bala (Even-Odd strength)
      IF planet_in_even_sign AND planet_in_day_time:
        ojayugma_bala = 60
      ELIF planet_in_odd_sign AND planet_in_night_time:
        ojayugma_bala = 60
      ELSE:
        ojayugma_bala = 0
   
   sthana_bala = (uchcha_bala + saptavargaja_bala + ojayugma_bala) / 3

2. KALA BALA (Temporal Strength)
   a) Hora Bala (Hourly strength)
      IF planet_is_sun_ruled_hour:
        hora_bala = 60
      ELIF planet_is_own_ruled_hour:
        hora_bala = 30
      ELSE:
        hora_bala = 0
   
   b) Dina Bala (Daily strength)
      IF planet_is_day_planet AND birth_during_day:
        dina_bala = 60
      ELSE:
        dina_bala = 0
   
   c) Masa Bala (Monthly strength)
      IF planet_is_month_lord:
        masa_bala = 60
      ELSE:
        masa_bala = 0
   
   d) Varsha Bala (Yearly strength)
      IF planet_is_year_lord:
        varsha_bala = 60
      ELSE:
        varsha_bala = 0
   
   kala_bala = (hora_bala + dina_bala + masa_bala + varsha_bala) / 4

3. DIG BALA (Directional Strength)
   Planets have strength in specific houses:
   Sun/Mars: 10th house (60)
   Moon/Venus: 4th house (60)
   Mercury/Jupiter: 1st house (60)
   Saturn: 7th house (60)
   
   dig_bala = (planet_house_strength / 60) * 60

4. CHESTA BALA (Motional Strength)
   Based on planet's speed relative to mean motion
   chesta_bala = (planet_speed / mean_speed) * 60

5. NAISARGIKA BALA (Natural Strength)
   Inherent strength of planets:
   Sun: 60, Moon: 51, Mars: 17, Mercury: 34, Jupiter: 51, Venus: 42, Saturn: 25
   naisargika_bala = planet_natural_strength

6. DRISHTI BALA (Aspect Strength)
   Aspects from benefic planets increase strength
   drishti_bala = sum of aspect strengths from other planets

TOTAL SHAD BALA = (sthana_bala + kala_bala + dig_bala + chesta_bala + 
                   naisargika_bala + drishti_bala) / 6
```

### Code Implementation Reference
File: `jhora/horoscope/chart/strength.py`

Key functions:
- `get_shad_bala(planet_positions, house_cusps, birth_time)` - Calculate Shad Bala
- `get_bhava_bala(planet_positions, house_cusps)` - Calculate house strength
- `get_vimsopaka_bala()` - Calculate 20-fold strength

---

## 12. Panchanga Calculation

### Algorithm - Tithi (Lunar Day)

```
Input: Julian Day Number, Place
Output: Tithi number (0-29), Tithi name, Paksha (phase)

Step 1: Calculate Sun Longitude
  sun_longitude = get_planet_longitude(jd, sun_index)

Step 2: Calculate Moon Longitude
  moon_longitude = get_planet_longitude(jd, moon_index)

Step 3: Calculate Lunar Phase Angle
  phase_angle = (moon_longitude - sun_longitude) % 360
  
  IF phase_angle < 0:
    phase_angle += 360

Step 4: Determine Tithi
  tithi_number = floor(phase_angle / 12)  # 360/30 = 12 degrees per tithi
  
  IF tithi_number > 29:
    tithi_number = 29
  
  tithi_position = (phase_angle % 12) / 12  # Position within tithi (0-1)

Step 5: Determine Paksha (Phase)
  IF tithi_number <= 14:
    paksha = 'Shukla' (Waxing)
  ELSE:
    paksha = 'Krishna' (Waning)

Step 6: Get Tithi Name
  tithi_names = ['Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Pournami',
                 'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya']
  
  tithi_name = tithi_names[tithi_number]

Return: {
  'tithi_number': tithi_number,
  'tithi_name': tithi_name,
  'paksha': paksha,
  'position': tithi_position
}
```

### Algorithm - Nakshatra (Star)

```
Input: Julian Day Number, Place
Output: Nakshatra number (0-26), Nakshatra name, Pada (quarter)

Step 1: Calculate Moon Longitude
  moon_longitude = get_planet_longitude(jd, moon_index)

Step 2: Normalize Longitude
  normalized_longitude = moon_longitude % 360

Step 3: Determine Nakshatra
  nakshatra_number = floor(normalized_longitude / 13.333)  # 360/27 = 13.333
  
  IF nakshatra_number > 26:
    nakshatra_number = 26
  
  nakshatra_position = (normalized_longitude % 13.333) / 13.333  # 0-1

Step 4: Determine Pada (Quarter)
  pada_number = floor(nakshatra_position * 4)  # 4 quarters per nakshatra
  
  IF pada_number > 3:
    pada_number = 3

Step 5: Get Nakshatra Name
  nakshatra_names = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
                     'Ardra', 'Punarvasu', 'Pushya', 'Aslesha', 'Magha',
                     'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
                     'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola',
                     'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
                     'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati']
  
  nakshatra_name = nakshatra_names[nakshatra_number]

Return: {
  'nakshatra_number': nakshatra_number,
  'nakshatra_name': nakshatra_name,
  'pada': pada_number + 1,  # 1-4
  'position': nakshatra_position
}
```

### Code Implementation Reference
File: `jhora/panchanga/drik.py`

Key functions:
- `tithi(jd, place)` - Calculate tithi
- `nakshatra(jd, place)` - Calculate nakshatra
- `vaara(jd)` - Calculate day of week
- `yoga(jd, place)` - Calculate yoga
- `karana(jd, place)` - Calculate karana
- `lunar_month(jd, place)` - Calculate lunar month
- `planet_positions(jd, place)` - Get all planet positions

