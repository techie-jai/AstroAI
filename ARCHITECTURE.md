# PyJHora Architecture Diagram

## System Overview

PyJHora is a Vedic Astrology horoscope calculation and visualization application built with PyQt6. The system follows a layered architecture with clear separation between UI, business logic, and data processing layers.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE LAYER (PyQt6)                      │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ChartTabbed (Main Widget)                                           │  │
│  │  - Input Form (Name, DOB, TOB, Place, Gender, Language)             │  │
│  │  - Tab Widget with 40+ tabs for different chart types               │  │
│  │  - Chart Display (South/North/East/West Indian, Sudarsana Chakra)   │  │
│  │  - Info Labels & Tables                                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Supporting UI Components                                            │  │
│  │  - Chart Styles (chart_styles.py)                                   │  │
│  │  - Chakra Widgets (chakra.py)                                       │  │
│  │  - Label Grid (label_grid.py)                                       │  │
│  │  - Dialog Windows (options, varga, dhasa, panchangam, etc.)         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ User Input
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA VALIDATION & PROCESSING                         │
│                                                                             │
│  _validate_ui() - Validates all user inputs                                │
│  - Place name, Latitude, Longitude, Timezone                              │
│  - Date of Birth (YYYY,MM,DD), Time of Birth (HH:MM:SS)                  │
│  - Language, Chart Type, Ayanamsa Mode                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Validated Data
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOROSCOPE CALCULATION ENGINE                             │
│                   (jhora/horoscope/main.py)                                │
│                                                                             │
│  Horoscope Class Constructor:                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Input Parameters:                                                   │  │
│  │ - place_with_country_code / (latitude, longitude, timezone)        │  │
│  │ - date_in (drik.Date object)                                       │  │
│  │ - birth_time (HH:MM:SS format)                                     │  │
│  │ - calculation_type ('drik', 'ss')                                  │  │
│  │ - years, months, sixty_hours (for annual/monthly charts)           │  │
│  │ - bhava_madhya_method (house calculation method)                   │  │
│  │ - language                                                          │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Initialization Steps:                                                     │
│  1. Location Resolution                                                    │
│     └─> utils.get_location_using_nominatim() [if needed]                 │
│                                                                             │
│  2. Date/Time Conversion                                                   │
│     └─> drik.Date, swisseph.julday()                                      │
│     └─> Convert to Julian Day Number (JD)                                 │
│                                                                             │
│  3. Ayanamsa Calculation                                                   │
│     └─> drik.get_ayanamsa_value(julian_day)                               │
│                                                                             │
│  4. Calendar Information                                                   │
│     └─> get_calendar_information()                                        │
│     └─> Vaara, Tithi, Nakshatra, Lunar Month, etc.                       │
│                                                                             │
│  5. Bhava Chart Calculation                                                │
│     └─> get_bhava_chart_information()                                     │
│     └─> House cusps & ascendant calculation                               │
│                                                                             │
│  6. Annual/Monthly Chart Calculation                                       │
│     └─> drik.next_solar_date() [for annual charts]                        │
│                                                                             │
│  Key Attributes Created:                                                   │
│  - self.julian_day, self.julian_years                                     │
│  - self.Place, self.Date                                                  │
│  - self.calendar_info                                                     │
│  - self.bhava_chart, self.bhava_chart_info                                │
│  - self.ayanamsa_mode, self.ayanamsa_value                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Horoscope Object Created
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHART CALCULATION MODULES                                │
│                  (jhora/horoscope/chart/)                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 1. DIVISIONAL CHARTS (charts.py)                                   │  │
│  │    - Raasi (D1), Hora (D2), Drekkana (D3), Navamsa (D9), etc.     │  │
│  │    - Mixed Charts (D1xD9, D1xD11, etc.)                            │  │
│  │    - Planet Positions in each divisional chart                     │  │
│  │    - Retrograde & Combustion status                                │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 2. STRENGTH CALCULATIONS (strength.py)                             │  │
│  │    - Harsha Bala                                                   │  │
│  │    - Pancha Vargeeya Bala                                          │  │
│  │    - Dwadhasa Vargeeya Bala                                        │  │
│  │    - Shad Bala (6-fold strength)                                   │  │
│  │    - Bhava Bala (house strength)                                   │  │
│  │    - Vimsopaka Bala                                                │  │
│  │    - Vaiseshikamsa Bala                                            │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 3. YOGAS & DOSHAS (yoga.py, dosha.py, raja_yoga.py)              │  │
│  │    - 100+ Yogas (Gajakesari, Rajayoga, etc.)                       │  │
│  │    - Raja Yogas & subtypes                                         │  │
│  │    - Doshas (Mangal, Nadi, Bhakoot, Kuja, etc.)                   │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 4. ASPECTS & DRISHTI (house.py)                                    │  │
│  │    - Graha Drishti (planet aspects)                                │  │
│  │    - Raasi Drishti (sign aspects)                                  │  │
│  │    - Stronger planets/signs                                        │  │
│  │    - Karakas (significators)                                       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 5. ARUDHAS & ARGALA (arudhas.py)                                   │  │
│  │    - Arudha Padas (A1, A2, A3, etc.)                               │  │
│  │    - Argala (intervention)                                         │  │
│  │    - Virodhargala (counter-intervention)                           │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 6. ASHTAKA VARGA (ashtakavarga.py)                                 │  │
│  │    - Bindus (points) for each planet                               │  │
│  │    - Sodhana (reduction) process                                   │  │
│  │    - Ekadhipatya Sodhana                                           │  │
│  │    - Pinda calculations                                            │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 7. SPHUTAS (sphuta.py)                                             │  │
│  │    - Tithi Sphuta, Yoga Sphuta                                     │  │
│  │    - Tri, Chatu, Pancha Sphutas                                    │  │
│  │    - Prana, Deha, Mrityu Sphutas                                   │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 8. SAHAMS (transit/saham.py)                                       │  │
│  │    - 36 Sahams (Arabic Parts)                                      │  │
│  │    - Saham positions in various charts                             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Chart Data
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DHASA/BHUKTHI CALCULATION                                │
│                  (jhora/horoscope/dhasa/)                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ GRAHA DHASA (Planet-based)                                          │  │
│  │ - Vimsottari (20-year cycle)                                        │  │
│  │ - Ashtottari (8-planet cycle)                                       │  │
│  │ - Yogini (27-year cycle)                                            │  │
│  │ - Shodasottari, Dwadasottari, Dwisatpathi                           │  │
│  │ - Panchottari, Satabdika, Chaturaaseeti Sama                        │  │
│  │ - Karana Chaturaaseeti Sama, Shashtisama, Shattrimsa Sama           │  │
│  │ - Naisargika, Tara, Karaka, Buddhi Gathi                            │  │
│  │ - Kaala, Aayu, Saptharishi Nakshathra                               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ RASI DHASA (Sign-based)                                             │  │
│  │ - Narayana, Kendraadhi Rasi, Sudasa                                 │  │
│  │ - Drig, Nirayana, Shoola, Kendraadhi Karaka                         │  │
│  │ - Chara, Lagnamsaka, Padhanadhamsa                                  │  │
│  │ - Mandooka, Sthira, Tara Lagna                                      │  │
│  │ - Brahma, Varnada, Yogardha                                         │  │
│  │ - Navamsa, Paryaaya, Trikona                                        │  │
│  │ - Kalachakra, Chakra, Sandhya Panchaka                              │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ ANNUAL DHASA                                                        │  │
│  │ - Patyayini, Varsha Vimsottari, Varsha Narayana                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ SUDARSHANA CHAKRA DHASA                                             │  │
│  │ - Chakra-based dhasa calculation                                    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Dhasa Data
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PANCHANGA CALCULATION                                    │
│                  (jhora/panchanga/drik.py)                                 │
│                                                                             │
│  Core Functions:                                                            │
│  - vaara() - Day of week                                                   │
│  - tithi() - Lunar day                                                     │
│  - nakshatra() - Star/constellation                                        │
│  - yoga() - Auspicious combination                                         │
│  - karana() - Half lunar day                                               │
│  - lunar_month() - Lunar month & adhik masa                                │
│  - tamil_solar_month_and_date() - Tamil calendar                           │
│  - sunrise(), sunset() - Daily timings                                     │
│  - planet_positions() - Planetary longitudes                               │
│  - ayanamsa_value() - Precession adjustment                                │
│                                                                             │
│  Ephemeris Data:                                                            │
│  - Swiss Ephemeris (JPL data compressed)                                   │
│  - Located in: jhora/data/ephe/                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ All Calculation Data
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOROSCOPE INFORMATION RETRIEVAL                          │
│                   (jhora/horoscope/main.py methods)                        │
│                                                                             │
│  Public Methods Called by UI:                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ get_horoscope_information_for_chart()                               │  │
│  │ - Returns: (chart_info_dict, chart_1d_list, ascendant_house)        │  │
│  │ - For divisional charts (D1, D2, D3, D9, etc.)                      │  │
│  │ - Accepts: chart_index, chart_method, divisional_chart_factor      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ get_horoscope_information_for_mixed_chart()                         │  │
│  │ - For mixed charts (D1xD9, D1xD11, etc.)                            │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ get_sahams(), get_yogas(), get_doshas()                             │  │
│  │ - Returns specific calculation results                              │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ _get_*_dhasa_bhukthi() / _get_*_dhasa()                             │  │
│  │ - Returns dhasa/bhukthi periods for all dhasa systems               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ _get_*_bala() methods                                               │  │
│  │ - Returns strength calculations                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ get_calendar_information()                                          │  │
│  │ - Returns panchanga details                                         │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Structured Data
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UI DATA PROCESSING & DISPLAY                             │
│                   (horo_chart_tabs.py methods)                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ compute_horoscope()                                                 │  │
│  │ - Main entry point triggered by user clicking "Compute"            │  │
│  │ - Validates input data                                              │  │
│  │ - Creates Horoscope object                                          │  │
│  │ - Calls all calculation methods                                     │  │
│  │ - Stores results in instance variables                             │  │
│  │ - Calls _update_chart_ui_with_info()                                │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ _update_chart_ui_with_info()                                        │  │
│  │ - Populates all 40+ tabs with chart data                            │  │
│  │ - Calls individual tab update methods                               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Tab Update Methods:                                                 │  │
│  │ - _update_panchanga_tab_information()                               │  │
│  │ - _update_bhaava_tab_information()                                  │  │
│  │ - _update_chart_tab_information() [for each divisional chart]       │  │
│  │ - _update_*_bala_table_information()                                │  │
│  │ - _update_*_dhasa_table_information()                               │  │
│  │ - _update_yoga_list_information()                                   │  │
│  │ - _update_dosha_list_information()                                  │  │
│  │ - _update_drishti_table_information()                               │  │
│  │ - _update_saham_table_information()                                 │  │
│  │ - _update_argala_table_information()                                │  │
│  │ - _update_shodhaya_table_information()                              │  │
│  │ - _update_chakra_information()                                      │  │
│  │ - _update_compatibility_information()                               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Chart Rendering:                                                    │  │
│  │ - _get_kundali_chart_widgets() - Creates chart visual              │  │
│  │ - Chart Style Classes (SouthIndianChart, NorthIndianChart, etc.)   │  │
│  │ - Renders planets, signs, houses in appropriate format              │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Table Population:                                                   │  │
│  │ - QTableWidget objects populated with calculation results           │  │
│  │ - Font sizes, colors, formatting applied                            │  │
│  │ - Headers and row/column labels set                                 │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ List Population:                                                    │  │
│  │ - QListWidget objects for yogas, doshas, predictions                │  │
│  │ - QTextEdit for detailed descriptions                               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        VISUAL DISPLAY TO USER                               │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Tab 1: Panchangam                                                  │  │
│  │  - Calendar info, Vaara, Tithi, Nakshatra, Yoga, Karana            │  │
│  │  - Sunrise/Sunset times                                             │  │
│  │  - Lunar month, Tamil calendar                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Tab 2: Bhaava (Houses)                                             │  │
│  │  - House cusps and planets in houses                                │  │
│  │  - House lords and significators                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Tab 3: Pancha Pakshi Sastra                                        │  │
│  │  - Bird omens and predictions                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Tabs 4-28: Divisional Charts (Raasi, Hora, Drekkana, etc.)        │  │
│  │  - Chart visualization (South/North/East/West Indian style)         │  │
│  │  - Planet positions in each sign                                    │  │
│  │  - Chart-specific information                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Tabs 29-50+: Strength, Dhasa, Yogas, Doshas, etc.                 │  │
│  │  - Bala tables (Shad Bala, Bhava Bala, Vimsopaka, etc.)             │  │
│  │  - Dhasa/Bhukthi periods (Vimsottari, Ashtottari, etc.)             │  │
│  │  - Yoga lists with descriptions                                     │  │
│  │  - Dosha lists with descriptions                                    │  │
│  │  - Drishti tables                                                   │  │
│  │  - Ashtaka Varga, Argala, Shodhaya                                  │  │
│  │  - Chakra visualizations                                            │  │
│  │  - Marriage Compatibility (if enabled)                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Sequence Diagram

```
USER INPUT
    │
    ├─> ChartTabbed.__init__()
    │   └─> Creates UI with input fields & tabs
    │
    ├─> User enters: Name, DOB, TOB, Place, Gender, Language, Chart Type
    │
    ├─> User clicks "Compute Horoscope"
    │
    └─> compute_horoscope()
        │
        ├─> _validate_ui()
        │   └─> Validates all input fields
        │
        ├─> Extract & Parse Input Data
        │   ├─> Place: self._place_name
        │   ├─> DOB: year, month, day
        │   ├─> TOB: HH:MM:SS
        │   ├─> Latitude, Longitude, Timezone
        │   ├─> Language, Chart Type, Ayanamsa Mode
        │   └─> Years, Months, 60-hour cycles
        │
        ├─> Create Horoscope Object
        │   │   main.Horoscope(place, lat, long, tz, dob, tob, ...)
        │   │
        │   ├─> Location Resolution
        │   │   └─> utils.get_location_using_nominatim() [if needed]
        │   │
        │   ├─> Date/Time Conversion
        │   │   ├─> drik.Date(year, month, day)
        │   │   ├─> swisseph.julday() → Julian Day Number
        │   │   └─> drik.Place(name, lat, long, tz)
        │   │
        │   ├─> Ayanamsa Calculation
        │   │   └─> drik.get_ayanamsa_value(jd)
        │   │
        │   ├─> Calendar Information
        │   │   ├─> get_calendar_information()
        │   │   ├─> drik.vaara(jd) → Day of week
        │   │   ├─> drik.tithi(jd) → Lunar day
        │   │   ├─> drik.nakshatra(jd) → Star
        │   │   ├─> drik.lunar_month(jd) → Month
        │   │   └─> drik.tamil_solar_month_and_date()
        │   │
        │   ├─> Bhava Chart Calculation
        │   │   └─> get_bhava_chart_information()
        │   │       └─> house.get_house_cusps() → House positions
        │   │
        │   └─> Annual/Monthly Chart Date
        │       └─> drik.next_solar_date() [if years > 1]
        │
        ├─> Retrieve Horoscope Information
        │   │
        │   ├─> For Each Divisional Chart (D1, D2, D3, D9, etc.)
        │   │   │
        │   │   ├─> get_horoscope_information_for_chart()
        │   │   │   │
        │   │   │   ├─> charts.divisional_chart()
        │   │   │   │   └─> Calculate planet positions in divisional chart
        │   │   │   │
        │   │   │   ├─> house.get_house_cusps()
        │   │   │   │   └─> Calculate house positions
        │   │   │   │
        │   │   │   ├─> Compile chart information dictionary
        │   │   │   │
        │   │   │   └─> Return: (chart_info, chart_1d, ascendant_house)
        │   │   │
        │   │   └─> Store in self._kundali_info, self._kundali_chart
        │   │
        │   ├─> Calculate Strengths (if not Western chart)
        │   │   ├─> _get_vimsopaka_bala()
        │   │   ├─> _get_vaiseshikamsa_bala()
        │   │   ├─> _get_other_bala()
        │   │   ├─> _get_shad_bala()
        │   │   └─> _get_bhava_bala()
        │   │
        │   ├─> Calculate Dhasa/Bhukthi (if not Western chart)
        │   │   │
        │   │   ├─> For Each Graha Dhasa System
        │   │   │   └─> _get_vimsottari_dhasa_bhukthi()
        │   │   │   └─> _get_ashtottari_dhasa_bhukthi()
        │   │   │   └─> [etc. for all 20+ dhasa systems]
        │   │   │
        │   │   ├─> For Each Rasi Dhasa System
        │   │   │   └─> _get_narayana_dhasa()
        │   │   │   └─> _get_sudasa_dhasa()
        │   │   │   └─> [etc. for all 16+ rasi dhasa systems]
        │   │   │
        │   │   └─> For Annual Dhasa
        │   │       └─> _get_annual_dhasa_bhukthi()
        │   │
        │   └─> Calculate Arudha Padhas
        │       └─> _get_arudha_padhas()
        │
        ├─> Update Main Window Labels & Tooltips
        │   └─> _update_main_window_label_and_tooltips()
        │
        ├─> Recreate Chart Tab Widgets
        │   └─> _recreate_chart_tab_widgets()
        │
        └─> Update Chart UI with Information
            │
            └─> _update_chart_ui_with_info()
                │
                ├─> _update_panchanga_tab_information()
                │   └─> Fill panchanga_info_dialog with calendar data
                │
                ├─> _update_bhaava_tab_information()
                │   └─> Display house cusps and planets in houses
                │
                ├─> For Each Divisional Chart Tab
                │   │
                │   ├─> _get_kundali_chart_widgets()
                │   │   ├─> Create chart visual (SouthIndianChart, etc.)
                │   │   ├─> Render planets in signs
                │   │   └─> Render ascendant and houses
                │   │
                │   ├─> Populate chart information label
                │   │   └─> Planet longitudes, retrograde status, etc.
                │   │
                │   └─> Add to tab
                │
                ├─> For Each Strength Tab
                │   │
                │   ├─> _update_*_bala_table_information()
                │   │   ├─> Create QTableWidget
                │   │   ├─> Populate with strength values
                │   │   ├─> Format rows/columns
                │   │   └─> Add to tab
                │   │
                │   └─> Repeat for: Vimsopaka, Vaiseshikamsa, Other, Shad, Bhava
                │
                ├─> For Each Dhasa Tab
                │   │
                │   ├─> _update_*_dhasa_table_information()
                │   │   ├─> Create QTableWidget for each period
                │   │   ├─> Populate with dhasa/bhukthi periods
                │   │   ├─> Format with dates and durations
                │   │   └─> Add to tab
                │   │
                │   └─> Repeat for: Vimsottari, Ashtottari, Yogini, etc.
                │
                ├─> _update_yoga_list_information()
                │   ├─> Get yogas from _horo.get_yogas()
                │   ├─> Populate QListWidget with yoga names
                │   ├─> Populate QTextEdit with yoga descriptions
                │   └─> Add to yoga tab
                │
                ├─> _update_dosha_list_information()
                │   ├─> Get doshas from _horo.get_doshas()
                │   ├─> Populate QListWidget with dosha names
                │   ├─> Populate QTextEdit with dosha descriptions
                │   └─> Add to dosha tab
                │
                ├─> _update_drishti_table_information()
                │   ├─> Get drishti data from house.raasi_drishti_from_chart()
                │   ├─> Get drishti data from house.graha_drishti_from_chart()
                │   ├─> Create QTableWidget for drishti
                │   ├─> Populate with aspect information
                │   └─> Add to drishti tab
                │
                ├─> _update_saham_table_information()
                │   ├─> Get sahams from _horo.get_sahams()
                │   ├─> Create QTableWidget
                │   ├─> Populate with saham positions
                │   └─> Add to saham tab
                │
                ├─> _update_argala_table_information()
                │   ├─> Get argala data from arudhas.get_argala()
                │   ├─> Create QTableWidget
                │   ├─> Populate with argala information
                │   └─> Add to argala tab
                │
                ├─> _update_shodhaya_table_information()
                │   ├─> Get ashtaka varga data
                │   ├─> Create QTableWidget
                │   ├─> Populate with sodhana values
                │   └─> Add to shodhaya tab
                │
                ├─> _update_chakra_information()
                │   ├─> Create chakra widgets (Kota, Kaala, Sarvatobadra, etc.)
                │   ├─> Populate with chakra data
                │   └─> Add to chakra tabs
                │
                └─> _update_compatibility_information() [if enabled]
                    ├─> Get compatibility data from compatibility.get_compatibility()
                    ├─> Create compatibility tables
                    ├─> Populate with match scores
                    └─> Add to compatibility tab
```

---

## File Structure & Responsibilities

### UI Layer (`jhora/ui/`)

| File | Purpose |
|------|---------|
| **horo_chart_tabs.py** | Main UI widget (ChartTabbed class) - handles all user interaction, input validation, tab management, and chart display |
| **chart_styles.py** | Chart rendering classes (SouthIndianChart, NorthIndianChart, EastIndianChart, WesternChart, SudarsanaChakraChart) |
| **chakra.py** | Chakra visualization widgets (KotaChakra, KaalaChakra, Sarvatobadra, Shoola, etc.) |
| **label_grid.py** | Custom QLabel grid widget for displaying tabular data |
| **options_dialog.py** | Dialog for chart calculation options |
| **varga_chart_dialog.py** | Dialog for selecting divisional charts |
| **dhasa_bhukthi_options_dialog.py** | Dialog for dhasa/bhukthi options |
| **mixed_chart_dialog.py** | Dialog for mixed chart configuration |
| **panchangam.py** | Panchanga information dialog |
| **pancha_pakshi_sastra_widget.py** | Widget for Pancha Pakshi Sastra predictions |
| **conjunction.py** | Dialog for planetary conjunctions, transits, eclipses |
| **vratha_finder.py** | Widget for finding vratha dates |
| **vedic_calendar.py** | Vedic calendar widget |
| **vedic_clock.py** | Vedic clock widget |
| **vakra_gathi_plot.py** | Retrograde planet visualization |
| **horo_chart.py** | Simple horoscope chart display |
| **match_ui.py** | Marriage compatibility UI |

### Calculation Engine (`jhora/horoscope/`)

| File | Purpose |
|------|---------|
| **main.py** | Horoscope class - main calculation engine, initializes all data, provides methods to retrieve chart information |
| **chart/charts.py** | Divisional chart calculations (D1, D2, D3, D9, etc.) |
| **chart/house.py** | House/bhava calculations, aspects (drishti), karakas |
| **chart/strength.py** | Strength calculations (Harsha, Pancha Vargeeya, Dwadhasa Vargeeya, Shad Bala, Bhava Bala) |
| **chart/yoga.py** | 100+ yoga calculations |
| **chart/raja_yoga.py** | Raja yoga and subtypes |
| **chart/dosha.py** | Dosha calculations (Mangal, Nadi, Bhakoot, etc.) |
| **chart/arudhas.py** | Arudha pada, argala, virodhargala calculations |
| **chart/ashtakavarga.py** | Ashtaka varga, sodhana, pinda calculations |
| **chart/sphuta.py** | Sphuta calculations (tithi, yoga, prana, deha, mrityu, etc.) |

### Dhasa/Bhukthi (`jhora/horoscope/dhasa/`)

| Directory | Purpose |
|-----------|---------|
| **graha/** | 20+ graha dhasa systems (Vimsottari, Ashtottari, Yogini, etc.) |
| **rasi/** | 16+ rasi dhasa systems (Narayana, Sudasa, Chara, etc.) |
| **annual/** | Annual dhasa systems (Patyayini, Varsha Vimsottari, etc.) |
| **sudharsana_chakra.py** | Sudarshana Chakra dhasa calculation |

### Panchanga (`jhora/panchanga/`)

| File | Purpose |
|------|---------|
| **drik.py** | Core panchanga calculations (tithi, nakshatra, vaara, yoga, karana, lunar month, sunrise/sunset, planet positions) |
| **vratha.py** | Special vratha dates (Amavasya, Pournami, Srartha, etc.) |
| **pancha_paksha.py** | Pancha Paksha calculations |

### Supporting Modules

| File | Purpose |
|------|---------|
| **const.py** | Constants (ayanamsa modes, chart factors, house methods, compatibility data, language strings) |
| **utils.py** | Utility functions (coordinate conversions, date/time operations, language handling, location lookup) |
| **data/** | Configuration data (world cities, ephemeris, compatibility tables) |
| **lang/** | Language resource files (English, Hindi, Tamil, Telugu, Kannada) |

---

## Key Data Structures

### Horoscope Object Attributes
```python
self.Place              # drik.Place object (name, lat, long, tz)
self.Date              # drik.Date object (year, month, day)
self.birth_time        # Tuple (hour, minute, second)
self.julian_day        # Julian Day Number at birth time
self.julian_years      # Julian Day Number for annual chart
self.ayanamsa_mode     # Ayanamsa method (Lahiri, Raman, etc.)
self.ayanamsa_value    # Ayanamsa value in degrees
self.calendar_info     # Dictionary of panchanga information
self.bhava_chart       # House cusps and planets in houses
self.bhava_chart_info  # Detailed house information
```

### Chart Information Structure
```python
chart_info = {
    'planet_name': {
        'longitude': float,
        'raasi': int,
        'nakshatra': int,
        'pada': int,
        'retrograde': bool,
        'combustion': bool,
        ...
    },
    ...
}

chart_1d = [
    (house_number, 'planet_indices_as_string'),
    ...
]
```

### Dhasa/Bhukthi Structure
```python
dhasa_data = {
    'dhasas': [
        {
            'name': 'Planet Name',
            'start_date': 'YYYY-MM-DD',
            'end_date': 'YYYY-MM-DD',
            'duration': 'X years Y months',
            'bhuktis': [
                {
                    'name': 'Planet Name',
                    'start_date': 'YYYY-MM-DD',
                    'end_date': 'YYYY-MM-DD',
                    ...
                },
                ...
            ]
        },
        ...
    ]
}
```

---

## Important Questions & Clarifications

Before we proceed further, I have a few questions to ensure the diagram meets your needs:

1. **Depth Level**: Would you like more technical details about specific calculation algorithms (e.g., how Vimsottari dhasa is calculated), or is the current level of abstraction sufficient?

2. **Focus Areas**: Are there specific modules or data flows you'd like me to expand on? For example:
   - Detailed ephemeris data flow
   - Language localization mechanism
   - Chart rendering algorithm details
   - Specific dhasa calculation methods

3. **Format Preference**: Would you prefer:
   - A visual diagram (Mermaid, PlantUML, or similar)?
   - More detailed code flow documentation?
   - Both text and visual representations?

4. **Use Case**: What's the primary use of this architecture document?
   - Understanding the codebase for maintenance?
   - Onboarding new developers?
   - Planning new features?
   - Refactoring/optimization?

5. **Scope**: Should I include:
   - Testing architecture?
   - Data persistence/file I/O?
   - Configuration management?
   - Error handling flows?

<function_calls>
<invoke name="update_plan">
<parameter name="plan">[{"step": "Explore project structure and identify key entry points", "status": "completed"}, {"step": "Trace data flow from user input through processing to UI display", "status": "completed"}, {"step": "Map out file purposes and dependencies", "status": "completed"}, {"step": "Create comprehensive architecture diagram", "status": "completed"}]
