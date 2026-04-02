# PyJHora Functionalities Analysis

## Overview
PyJHora is a comprehensive Python library implementing Vedic Astrology calculations based on PVR Narasimha Rao's book "Vedic Astrology - An Integrated Approach" and Jagannatha Hora V8.0 software.

---

## 1. VIMSHOTTARI DASHA (विमशोत्तरी दशा)

### Location
`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\dhasa\graha\vimsottari.py`

### Status: ✅ FULLY IMPLEMENTED

### Key Functions
- **`vimsottari_dasha_start_date(jd, place)`** - Calculates start date of mahadasha
- **`vimsottari_mahadasa(jd, place)`** - Lists all mahadashas with start dates and durations
- **`vimsottari_bhukti(maha_lord, start_date)`** - Computes all bhuktis of a mahadasha
- **`vimsottari_antara(maha_lord, bhukti_lord, start_date)`** - Computes antaradasas
- **`vimsottari_dhasa_bhukthi(jd, place, dhasa_level_index)`** - Main function supporting up to Dehaantara level

### Features
- **Depth Control**: Supports 6 levels (Maha → Antara → Pratyantara → Sookshma → Prana → Deha)
- **Duration Calculation**: Uses 120-year cycle with planetary periods
- **Nakshatra Lords**: Follows standard order (Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury)
- **Constants Used**:
  - `vimsottari_adhipati_list` = [8, 5, 0, 1, 2, 7, 4, 6, 3]
  - `vimsottari_dict` = {8:7, 5:20, 0:6, 1:10, 2:7, 7:18, 4:16, 6:19, 3:17} (years)

### Usage Example
```python
from jhora.horoscope.dhasa.graha import vimsottari
from jhora import utils
from jhora.panchanga import drik

jd = utils.julian_day_number((1990, 5, 15), (10, 30, 0))
place = drik.Place('Chennai', 13.0878, 80.2785, 5.5)

# Get Vimshottari dasha with Antara level
dasha_data = vimsottari.vimsottari_dhasa_bhukthi(jd, place, dhasa_level_index=2)
```

### Integration in Charts
- Used in `@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\main.py` for horoscope calculations
- Displayed in UI tabs via `@/e:\25. Codes\15. AstroAI\PyJHora\jhora\ui\horo_chart_tabs.py`

---

## 2. VARSHA VIMSHOTTARI / MUDDA DASHA (वर्ष विमशोत्तरी / मुद्दा दशा)

### Location
`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\dhasa\annual\mudda.py`

### Status: ✅ FULLY IMPLEMENTED

### Key Functions
- **`varsha_vimsottari_dasha_start_date(jd, place, years)`** - Calculates annual dasha start
- **`varsha_vimsottari_mahadasa(jd, place, years)`** - Lists annual mahadashas
- **`varsha_vimsottari_bhukti(maha_lord, start_date)`** - Computes annual bhuktis
- **`varsha_vimsottari_antara(maha_lord, bhukti_lord, start_date)`** - Computes antaradasas
- **`varsha_vimsottari_dhasa_bhukthi(jd, place, years, dhasa_level_index)`** - Main function

### Features
- **360-Day Year**: Uses tropical year (const.tropical_year)
- **9 Planetary Lords**: Different from natal Vimshottari
- **Duration in Days**: 
  - `varsha_vimsottari_days` = {0:18, 1:30, 2:21, 7:54, 4:48, 6:57, 3:51, 8:21, 5:60}
  - Total: 360 days
- **Depth Support**: Up to 6 levels (Maha → Deha)
- **Lunar Year Calculation**: Based on Moon's position in nakshatra

### Usage Example
```python
from jhora.horoscope.dhasa.annual import mudda

jd = utils.julian_day_number((1990, 5, 15), (10, 30, 0))
place = drik.Place('Chennai', 13.0878, 80.2785, 5.5)
years = 35  # 35 years from birth

# Get annual dasha with Antara level
annual_dasha = mudda.mudda_dhasa_bhukthi(jd, place, years, dhasa_level_index=2)
```

### Integration
- Supports both **Mudda Dasha** (annual) and **Varsha Vimshottari** terminology
- Used for yearly predictions and transit analysis

---

## 3. BHAVA / HOUSE CALCULATIONS (भाव)

### Location
`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\chart\charts.py` (lines 109-370)
`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\panchanga\drik.py` (lines 1299-1540)

### Status: ✅ FULLY IMPLEMENTED

### Key Functions
- **`bhava_chart(jd, place, bhava_madhya_method)`** - Main bhava chart calculation
- **`_bhaava_madhya_new(jd, place, divisional_chart_factor, bhava_madhya_method)`** - Advanced bhava calculation
- **`bhava_houses(jd, place)`** - Get house positions
- **`_assign_planets_to_houses(planet_positions, bhava_houses)`** - Assign planets to houses

### Supported House Systems

#### Indian Systems
1. **KN Rao Method** (Method 1) - Parashari Bhava Chalita (cusp-15, cusp, cusp+15)
2. **Parashari/Whole Sign** (Method 2) - Houses 0-30 degrees
3. **KP Method** (Method 3) - Houses start and end at cusps
4. **BV Raman** (Method 4) - Equally divided with sandhi edges
5. **Equal Houses** (Method 5) - Based on nakshatra padas (9 padas each)
6. **Sripathi/Porphyrius** (Method 'O') - Jagannatha Hora compatible
7. **Sripathi/Astrodienst** (Method 'S') - V. Subramanya Sastri padhati

#### Western Systems (via Swiss Ephemeris)
- **Placidus** ('P')
- **Koch** ('K')
- **Regiomontanus** ('R')
- **Campanus** ('C')
- **Equal** ('A', 'E')
- **Vehlow Equal** ('V')
- **Porphyrius** ('O')
- **Morinus** ('M')
- **Alcabitus** ('B')
- **Topocentric** ('T')
- **Axial Rotation** ('X')
- **Azimuthal/Horizontal** ('H')

### Features
- **Divisional Chart Support**: Works with all varga charts (D1, D2, D3, etc.)
- **House Boundaries**: Returns (start, cusp/middle, end) for each house
- **Planet Assignment**: Automatically assigns planets to houses
- **Ascendant Reference**: Can use any planet as reference instead of Ascendant

### Usage Example
```python
from jhora.horoscope.chart import charts
from jhora.panchanga import drik

jd = utils.julian_day_number((1990, 5, 15), (10, 30, 0))
place = drik.Place('Chennai', 13.0878, 80.2785, 5.5)

# Using KP Method
bhava_info = charts._bhaava_madhya_new(jd, place, bhava_madhya_method=3)

# Using Placidus (Western)
bhava_info = charts._bhaava_madhya_new(jd, place, bhava_madhya_method='P')
```

### Output Format
```
[[house_rasi, (start, cusp, end), [planets_in_house]], ...]
Example: [[0, (0.5, 15.2, 30.1), [0, 3, 5]], ...]
```

---

## 4. SHADBALA (षड्बल) - SIX-FOLD STRENGTH

### Location
`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\chart\strength.py`

### Status: ✅ FULLY IMPLEMENTED

### Key Functions
- **`shad_bala(jd, place)`** - Main function returning all 6 strengths
- **`_sthana_bala(jd, place)`** - Positional strength
- **`_kaala_bala(jd, place)`** - Temporal strength
- **`_dig_bala(jd, place)`** - Directional strength
- **`_cheshta_bala_new(jd, place, use_epoch_table)`** - Motional strength
- **`_naisargika_bala(jd, place)`** - Natural strength
- **`_drik_bala(jd, place)`** - Aspectual strength

### The Six Components

#### 1. **Sthana Bala (Positional Strength)** - 5 sub-components
- **Uchcha Bala** (Exaltation strength) - 20 virupas max
- **Sapthavargaja Bala** (7-fold divisional strength) - 45 virupas max
- **Ojayugama Bala** (Even/Odd sign strength) - 30 virupas max
- **Kendra Bala** (Angular house strength) - 60 virupas max
- **Dreshkon Bala** (Decan strength) - 15 virupas max
- **Total**: Up to 170 virupas

#### 2. **Kaala Bala (Temporal Strength)** - 5 sub-components
- **Nathonnath Bala** (Day/Night strength) - 60 virupas max
- **Paksha Bala** (Lunar phase strength) - 60 virupas max
- **Tribhaga Bala** (Tripartite strength) - 60 virupas max
- **Abdadhipathi** (Annual lord strength) - 15 virupas max
- **Masadhipathi** (Monthly lord strength) - 30 virupas max
- **Vaaradhipathi** (Weekly lord strength) - 45 virupas max
- **Hora Bala** (Hourly strength) - 60 virupas max
- **Ayana Bala** (Declination strength) - 60 virupas max
- **Yuddha Bala** (War strength) - 60 virupas max
- **Total**: Up to 390 virupas

#### 3. **Dig Bala (Directional Strength)** - 60 virupas max
- Sun: Maximum at 10th house (MC)
- Moon: Maximum at 4th house (IC)
- Mars: Maximum at 10th house
- Mercury: Maximum at 1st house (Ascendant)
- Jupiter: Maximum at 1st house
- Venus: Maximum at 4th house
- Saturn: Maximum at 7th house (Descendant)

#### 4. **Cheshta Bala (Motional Strength)** - 60 virupas max
- Measures planet's motion relative to mean position
- Uses Ujjain Epoch 1900 mean positions and speeds
- Includes correction factors per planet

#### 5. **Naisargika Bala (Natural Strength)** - Fixed values
- Sun: 60 virupas
- Moon: 51.43 virupas
- Mars: 17.14 virupas
- Mercury: 25.71 virupas
- Jupiter: 34.29 virupas
- Venus: 42.86 virupas
- Saturn: 8.57 virupas

#### 6. **Drik Bala (Aspectual Strength)** - ±60 virupas
- Based on planetary aspects (drishti)
- Considers benefic and malefic aspects
- Uses Parashara's aspect rules

### Output Format
```python
[
    [sthana_bala_values],      # Index 0
    [kaala_bala_values],       # Index 1
    [dig_bala_values],         # Index 2
    [cheshta_bala_values],     # Index 3
    [naisargika_bala_values],  # Index 4
    [drik_bala_values],        # Index 5
    [total_virupas],           # Index 6
    [rupas_values],            # Index 7 (total/60)
    [strength_ratio]           # Index 8 (rupas/required)
]
```

### Usage Example
```python
from jhora.horoscope.chart import strength

jd = utils.julian_day_number((1990, 5, 15), (10, 30, 0))
place = drik.Place('Chennai', 13.0878, 80.2785, 5.5)

# Get complete shadbala
shadbala = strength.shad_bala(jd, place)

# Access individual strengths
sthana = shadbala[0]  # Positional
kaala = shadbala[1]   # Temporal
dig = shadbala[2]     # Directional
cheshta = shadbala[3] # Motional
naisargika = shadbala[4] # Natural
drik = shadbala[5]    # Aspectual
total = shadbala[6]   # Total virupas
rupas = shadbala[7]   # Rupas (total/60)
```

### Testing
- Verified against VP Jain book examples
- Verified against BV Raman book examples
- ~7678 unit tests in `@/e:\25. Codes\15. AstroAI\PyJHora\jhora\tests\pvr_tests.py`

---

## 5. OTHER DASHA SYSTEMS

### Location
`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\dhasa\`

### Status: ✅ FULLY IMPLEMENTED

### Available Dasha Systems

1. **Vimshottari Dasha** (Natal) - 120-year cycle
2. **Varsha Vimshottari / Mudda Dasha** (Annual) - 360-day cycle
3. **Drig Dasha** - Based on planetary aspects
   - Location: `@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\dhasa\graha\drig.py`
   - 2 methods: PVR (2007 paper) and PVR per book
   - Supports all varga charts

4. **Padhanadhamsa** - Based on pada positions
   - Location: `@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\dhasa\graha\padhanadhamsa.py`
   - 3 methods: Iranganti Rangacharya, Sanjay Rath, PVR
   - PVR method works for all varga charts

5. **Chara Dasha** - Based on rasi movements
   - Location: `@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\dhasa\raasi\chara.py`
   - Multiple methods including Iranganti Rangacharya and Mind Sutra

6. **Sthira Dasha** - Fixed dasha system
7. **Yogardha Dasha** - Half-way dasha
8. **Kalachakra Dasha** - Wheel of time dasha
9. **Sudarsana Chakra** - 360-degree chakra analysis

### Depth Control
All dasha functions support `dhasa_level_index` parameter:
- `1` = Maha only
- `2` = Maha + Antara (Bhukti)
- `3` = + Pratyantara
- `4` = + Sookshma
- `5` = + Prana
- `6` = + Deha

---

## 6. DIVISIONAL CHARTS (VARGAS)

### Location
`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\chart\charts.py` (lines 45-52)

### Status: ✅ FULLY IMPLEMENTED

### Supported Divisional Charts
```
D1 (Rasi)           - 1 division
D2 (Hora)           - 2 divisions
D3 (Drekkana)       - 3 divisions
D4 (Chaturthamsa)   - 4 divisions
D5 (Panchamsa)      - 5 divisions
D6 (Shashthamsa)    - 6 divisions
D7 (Saptamsa)       - 7 divisions
D8 (Ashtamsa)       - 8 divisions
D9 (Navamsa)        - 9 divisions
D10 (Dasamsa)       - 10 divisions
D11 (Rudramsa)      - 11 divisions
D12 (Dwadasamsa)    - 12 divisions
D16 (Shodasamsa)    - 16 divisions
D20 (Vimsamsa)      - 20 divisions
D24 (Chaturvimsamsa)- 24 divisions
D27 (Nakshatramsa)  - 27 divisions
D30 (Trimsamsa)     - 30 divisions
D40 (Khavedamsa)    - 40 divisions
D45 (Akshavedamsa)  - 45 divisions
D60 (Shashtyamsa)   - 60 divisions
D81 (Nava-Navamsa)  - 81 divisions
D108 (Ashtotharamsa)- 108 divisions
D144 (Dwadas-Dwadasamsa) - 144 divisions
```

### Function
```python
divisional_chart(jd, place, divisional_chart_factor=1, chart_method=None, 
                 base_rasi=None, count_from_end_of_sign=None)
```

---

## 7. INTEGRATION IN UI

### Main UI Files
- **`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\ui\horo_chart_tabs.py`** - Tabbed interface with all features
- **`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\ui\panchangam.py`** - Single-page panchanga
- **`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\ui\match_ui.py`** - Marriage compatibility

### Core Horoscope Class
- **`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\horoscope\main.py`** - Main horoscope calculations
  - `get_bhava_chart_information()` - Bhava chart with planets
  - `get_dasha_information()` - Dasha calculations
  - `get_strength_information()` - Shadbala calculations

---

## 8. HOW THEY ARE LEVERAGED IN CHART CALCULATIONS

### Chart Computation Flow

```
1. User Input (Birth Date/Time/Place)
   ↓
2. Calculate Julian Day Number (JD)
   ↓
3. Calculate Planetary Positions (Rasi Chart - D1)
   ↓
4. Calculate Divisional Charts (D2-D144)
   ↓
5. Calculate Bhava Houses (7 methods available)
   ↓
6. Assign Planets to Houses
   ↓
7. Calculate Shadbala (6 components)
   ↓
8. Calculate Dasha Systems
   ├─ Vimshottari Dasha (Natal)
   ├─ Varsha Vimshottari (Annual)
   ├─ Drig Dasha
   ├─ Padhanadhamsa
   └─ Chara Dasha
   ↓
9. Generate Predictions/Analysis
```

### Key Integration Points

#### In `main.py`
```python
# Bhava Chart
_bhava_chart = charts._bhaava_madhya_new(jd, place, divisional_chart_factor=1,
                                         bhava_madhya_method=bhaava_madhya_method)

# Shadbala
shab = strength.shad_bala(jd, place)

# Dasha
dasha_bhukthi = vimsottari.vimsottari_dhasa_bhukthi(jd, place, 
                                                     dhasa_level_index=2)
```

#### In `horo_chart_tabs.py`
- Displays Rasi chart with planets
- Shows Navamsa chart
- Displays Bhava chart with house lords
- Shows Dasha periods
- Displays Shadbala strength table
- Shows divisional charts on demand

---

## 9. CONSTANTS AND CONFIGURATION

### Key Constants
- **`const.bhaava_madhya_method`** - Default house system (2 = Parashari)
- **`const._DEFAULT_AYANAMSA_MODE`** - Default ayanamsa (TRUE_PUSHYA)
- **`const.vimsottari_dict`** - Vimshottari period durations
- **`const.varsha_vimsottari_days`** - Annual dasha durations
- **`const.shad_bala_factors`** - Required strength for each planet

### Ayanamsa Modes
- LAHIRI
- TRUE_PUSHYA (default)
- RAMAN
- KRISHNAMURTI (KP)
- FAGAN_BRADLEY
- And 10+ others

---

## 10. TESTING AND VERIFICATION

### Test Coverage
- **~7678 unit tests** in `pvr_tests.py`
- Tests verified against:
  - PVR Narasimha Rao's book examples
  - VP Jain's Shadbala book examples
  - BV Raman's Hindu Predictive Astrology examples
  - Jagannatha Hora V8.0 software outputs

### Test Location
`@/e:\25. Codes\15. AstroAI\PyJHora\jhora\tests\pvr_tests.py`

Key test functions:
- `shadbala_VPJainBook_tests()`
- `shadbala_BVRamanBook_tests()`
- `mudda_varsha_vimsottari_tests()`
- `vimsottari_tests()`

---

## Summary

| Feature | Status | Location | Depth |
|---------|--------|----------|-------|
| Vimshottari Dasha | ✅ | `dhasa/graha/vimsottari.py` | 6 levels |
| Varsha Vimshottari | ✅ | `dhasa/annual/mudda.py` | 6 levels |
| Bhava Charts | ✅ | `chart/charts.py` | 7 Indian + 13 Western |
| Shadbala | ✅ | `chart/strength.py` | 6 components |
| Divisional Charts | ✅ | `chart/charts.py` | 23 charts |
| Drig Dasha | ✅ | `dhasa/graha/drig.py` | 6 levels |
| Padhanadhamsa | ✅ | `dhasa/graha/padhanadhamsa.py` | 6 levels |
| Chara Dasha | ✅ | `dhasa/raasi/chara.py` | 6 levels |

All requested functionalities are **fully implemented and integrated** into the PyJHora system!
