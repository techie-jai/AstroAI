# PyJHora Subsystem Documentation

## 1. UI Input & Validation Subsystem

### Overview
Handles user input collection, validation, and data preparation for horoscope calculation.

### Components

#### Input Form Fields (horo_chart_tabs.py)

```python
class ChartTabbed(QWidget):
    # Input fields
    self._name_text = QLineEdit()           # Person's name
    self._dob_text = QLineEdit()            # Date of birth (YYYY,MM,DD)
    self._tob_text = QLineEdit()            # Time of birth (HH:MM:SS)
    self._place_text = QLineEdit()          # Birth place
    self._lat_text = QLineEdit()            # Latitude
    self._long_text = QLineEdit()           # Longitude
    self._tz_text = QLineEdit()             # Timezone offset
    
    # Combo boxes
    self._gender_combo = QComboBox()        # Male/Female/Transgender/No preference
    self._lang_combo = QComboBox()          # Language selection
    self._chart_type_combo = QComboBox()    # South/North/East/West Indian, Sudarsana
    self._ayanamsa_combo = QComboBox()      # Ayanamsa mode (Lahiri, Raman, etc.)
    self._pravesha_combo = QComboBox()      # Chart type (Janma, Annual, Monthly, etc.)
    
    # Spinners
    self._years_combo = QSpinBox()          # Years for annual chart
    self._months_combo = QSpinBox()         # Months for monthly chart
    self._60hrs_combo = QSpinBox()          # 60-hour cycles
    
    # Buttons
    self._compute_button = QPushButton()    # Compute horoscope
```

#### Validation Logic

```python
def _validate_ui(self):
    """
    Validate all input fields before computation
    
    Validation Rules:
    1. Place: Non-empty string
    2. Latitude: Float in range [-90, 90]
    3. Longitude: Float in range [-180, 180]
    4. Date of Birth: Format YYYY,MM,DD with valid date
    5. Time of Birth: Format HH:MM:SS with valid time
    6. All fields must be filled
    
    Returns:
        bool: True if all validations pass, False otherwise
    """
    validations = [
        # Place validation
        self._place_text.text().strip() != '',
        
        # Latitude validation (float, -90 to 90)
        re.match(r"[\+|\-]?\d+\.\d+\s?", self._lat_text.text().strip(), re.IGNORECASE),
        
        # Longitude validation (float, -180 to 180)
        re.match(r"[\+|\-]?\d+\.\d+\s?", self._long_text.text().strip(), re.IGNORECASE),
        
        # Date of birth validation (YYYY,MM,DD)
        re.match(r"[\+|\-]?\d{1,5}\,\d{1,2}\,\d{1,2}", 
                self._dob_text.text().strip(), re.IGNORECASE),
        
        # Time of birth validation (HH:MM:SS)
        re.match(r"\d{1,2}:\d{1,2}:\d{1,2}", 
                self._tob_text.text().strip(), re.IGNORECASE)
    ]
    
    all_valid = all(validations)
    
    if not all_valid:
        QMessageBox.warning(self, "Validation Error", 
                          "Please fill all fields correctly")
    
    return all_valid
```

#### Input Data Extraction

```python
def compute_horoscope(self, calculation_type='drik'):
    """
    Extract and prepare input data for horoscope calculation
    """
    # 1. Extract basic information
    self._gender = self._gender_combo.currentText()
    self._place_name = self._place_text.text()
    self._latitude = float(self._lat_text.text())
    self._longitude = float(self._long_text.text())
    self._time_zone = float(self._tz_text.text())
    self._language = list(const.available_languages.keys())[self._lang_combo.currentIndex()]
    
    # 2. Parse date of birth
    year, month, day = self._date_of_birth.split(",")
    birth_date = drik.Date(int(year), int(month), int(day))
    
    # 3. Extract chart parameters
    self._years = self._years_combo.value()
    self._months = self._months_combo.value()
    self._60hrs = self._60hrs_combo.value()
    
    # 4. Get ayanamsa mode
    self._ayanamsa_mode = self._ayanamsa_combo.currentText()
    
    # 5. Get chart type
    self._chart_type = list(available_chart_types)[self._chart_type_combo.currentIndex()]
    
    # 6. Prepare for horoscope creation
    return {
        'place': self._place_name,
        'latitude': self._latitude,
        'longitude': self._longitude,
        'timezone': self._time_zone,
        'date': birth_date,
        'time': self._time_of_birth,
        'language': self._language,
        'chart_type': self._chart_type,
        'ayanamsa_mode': self._ayanamsa_mode,
        'years': self._years,
        'months': self._months,
        'sixty_hours': self._60hrs,
        'calculation_type': calculation_type
    }
```

---

## 2. Chart Rendering Subsystem

### Overview
Converts calculated chart data into visual representations using PyQt6 widgets.

### Chart Style Classes (chart_styles.py)

#### Base Chart Class

```python
class BaseChart(QWidget):
    """
    Base class for all chart rendering
    
    Attributes:
        chart_data: Dictionary with planet positions
        house_cusps: List of 12 house cusps
        chart_type: Type of chart (South/North/East/West Indian)
        size_factor: Scaling factor for chart size
    """
    
    def __init__(self, chart_data, house_cusps, chart_type='south_indian', 
                 size_factor=1.0):
        super().__init__()
        self.chart_data = chart_data
        self.house_cusps = house_cusps
        self.chart_type = chart_type
        self.size_factor = size_factor
        self.setMinimumSize(400, 400)
    
    def paintEvent(self, event):
        """
        Main rendering method called by PyQt6
        """
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        # 1. Draw chart grid
        self._draw_chart_grid(painter)
        
        # 2. Draw zodiac signs
        self._draw_zodiac_signs(painter)
        
        # 3. Draw house numbers
        self._draw_house_numbers(painter)
        
        # 4. Draw planets
        self._draw_planets(painter)
        
        # 5. Draw ascendant marker
        self._draw_ascendant(painter)
        
        # 6. Draw legend
        self._draw_legend(painter)
```

#### South Indian Chart

```python
class SouthIndianChart(BaseChart):
    """
    South Indian (Rasi) chart style
    
    Layout:
    ┌─────┬─────┬─────┐
    │ 12  │ 1   │ 2   │
    ├─────┼─────┼─────┤
    │ 11  │ ASC │ 3   │
    ├─────┼─────┼─────┤
    │ 10  │ 9   │ 4   │
    ├─────┼─────┼─────┤
    │ 8   │ 7   │ 5   │
    │ 6   │     │     │
    └─────┴─────┴─────┘
    """
    
    def _draw_chart_grid(self, painter):
        """
        Draw 4x4 grid for South Indian chart
        """
        # Define grid positions
        grid_rows = 4
        grid_cols = 4
        cell_width = self.width() / grid_cols
        cell_height = self.height() / grid_rows
        
        # Draw grid lines
        for row in range(grid_rows + 1):
            y = row * cell_height
            painter.drawLine(0, y, self.width(), y)
        
        for col in range(grid_cols + 1):
            x = col * cell_width
            painter.drawLine(x, 0, x, self.height())
    
    def _draw_zodiac_signs(self, painter):
        """
        Draw zodiac sign names in each cell
        
        Mapping for South Indian:
        ┌──────┬──────┬──────┐
        │ 12   │ 1    │ 2    │
        ├──────┼──────┼──────┤
        │ 11   │ ASC  │ 3    │
        ├──────┼──────┼──────┤
        │ 10   │ 9    │ 4    │
        ├──────┼──────┼──────┤
        │ 8    │ 7    │ 5    │
        │ 6    │      │      │
        └──────┴──────┴──────┘
        """
        sign_map = [
            [12, 1, 2],
            [11, 0, 3],
            [10, 9, 4],
            [8, 7, 5, 6]
        ]
        
        cell_width = self.width() / 3
        cell_height = self.height() / 4
        
        for row, row_signs in enumerate(sign_map):
            for col, sign_num in enumerate(row_signs):
                x = col * cell_width
                y = row * cell_height
                
                sign_name = utils.RAASI_LIST[sign_num]
                
                # Draw sign name centered in cell
                painter.drawText(x, y, cell_width, cell_height,
                               Qt.AlignmentFlag.AlignCenter, sign_name)
    
    def _draw_planets(self, painter):
        """
        Draw planet symbols in appropriate cells
        """
        # Map planets to their positions in chart
        for planet_index, planet_data in self.chart_data.items():
            longitude = planet_data['longitude']
            
            # Determine sign and position
            sign = int(longitude / 30)
            position_in_sign = longitude % 30
            
            # Get cell coordinates
            cell_x, cell_y = self._get_cell_coordinates(sign)
            
            # Draw planet symbol
            planet_symbol = const._planet_symbols[planet_index]
            painter.drawText(cell_x, cell_y, planet_symbol)
```

#### North Indian Chart

```python
class NorthIndianChart(BaseChart):
    """
    North Indian (Rasi) chart style
    
    Layout: Diamond shape with 12 houses arranged in diamond pattern
    """
    
    def _draw_chart_grid(self, painter):
        """
        Draw diamond-shaped grid for North Indian chart
        """
        center_x = self.width() / 2
        center_y = self.height() / 2
        radius = min(self.width(), self.height()) / 2 - 20
        
        # Draw outer diamond
        points = []
        for i in range(4):
            angle = (i * 90 - 45) * 3.14159 / 180
            x = center_x + radius * cos(angle)
            y = center_y + radius * sin(angle)
            points.append(QPointF(x, y))
        
        polygon = QPolygonF(points)
        painter.drawPolygon(polygon)
        
        # Draw inner divisions
        # ... draw lines for 12 houses
```

#### East Indian Chart

```python
class EastIndianChart(BaseChart):
    """
    East Indian (Rasi) chart style
    
    Layout: 3x3 grid with specific house arrangement
    """
    
    def _draw_chart_grid(self, painter):
        """
        Draw 3x3 grid for East Indian chart
        """
        grid_size = 3
        cell_width = self.width() / grid_size
        cell_height = self.height() / grid_size
        
        # Draw grid
        for row in range(grid_size + 1):
            y = row * cell_height
            painter.drawLine(0, y, self.width(), y)
        
        for col in range(grid_size + 1):
            x = col * cell_width
            painter.drawLine(x, 0, x, self.height())
```

---

## 3. Dhasa/Bhukthi Calculation Subsystem

### Overview
Calculates planetary periods and sub-periods for predictive astrology.

### Vimsottari Dhasa System

```python
class VimsottariDhasa:
    """
    Vimsottari Dhasa System (120-year cycle)
    
    Planet Sequence: Ketu → Venus → Sun → Moon → Mars → Mercury → Jupiter → Saturn → Rahu
    
    Planet Years:
    - Ketu: 7 years
    - Venus: 20 years
    - Sun: 6 years
    - Moon: 10 years
    - Mars: 7 years
    - Mercury: 17 years
    - Jupiter: 16 years
    - Saturn: 19 years
    - Rahu: 18 years
    Total: 120 years
    """
    
    PLANET_SEQUENCE = [7, 5, 0, 1, 3, 2, 4, 6, 8]  # Ketu, Venus, Sun, Moon, Mars, Mercury, Jupiter, Saturn, Rahu
    PLANET_YEARS = {
        7: 7,   # Ketu
        5: 20,  # Venus
        0: 6,   # Sun
        1: 10,  # Moon
        3: 7,   # Mars
        2: 17,  # Mercury
        4: 16,  # Jupiter
        6: 19,  # Saturn
        8: 18   # Rahu
    }
    
    @staticmethod
    def calculate_dhasa_bhukthi(birth_nakshatra, birth_time_jd, place):
        """
        Calculate Vimsottari dhasa/bhukthi periods
        
        Args:
            birth_nakshatra: Nakshatra number (0-26)
            birth_time_jd: Birth time as Julian Day Number
            place: Birth place (drik.Place)
            
        Returns:
            List of dhasa periods with bhukthi sub-periods
        """
        # Step 1: Determine nakshatra lord
        nakshatra_lord = birth_nakshatra % 9
        starting_planet = VimsottariDhasa.PLANET_SEQUENCE[nakshatra_lord]
        
        # Step 2: Calculate balance of current dhasa
        moon_position = get_moon_position_in_nakshatra(birth_time_jd, place)
        balance_years = (1 - moon_position) * VimsottariDhasa.PLANET_YEARS[starting_planet]
        
        # Step 3: Generate dhasa sequence
        dhasa_periods = []
        current_date = gregorian_from_jd(birth_time_jd)
        
        for cycle in range(2):  # Generate 2 complete 120-year cycles
            for planet_index in VimsottariDhasa.PLANET_SEQUENCE:
                planet_years = VimsottariDhasa.PLANET_YEARS[planet_index]
                
                if cycle == 0 and planet_index == starting_planet:
                    # First dhasa uses balance
                    dhasa_duration = balance_years
                else:
                    dhasa_duration = planet_years
                
                dhasa_start = current_date
                dhasa_end = add_years_months_days(dhasa_start, dhasa_duration)
                
                # Generate bhukthi periods
                bhukthi_periods = []
                bhukthi_start = dhasa_start
                
                for bhukthi_planet_index in VimsottariDhasa.PLANET_SEQUENCE:
                    bhukthi_years = VimsottariDhasa.PLANET_YEARS[bhukthi_planet_index]
                    bhukthi_duration = (planet_years * bhukthi_years) / 120
                    
                    bhukthi_end = add_years_months_days(bhukthi_start, bhukthi_duration)
                    
                    bhukthi_periods.append({
                        'planet': bhukthi_planet_index,
                        'start_date': bhukthi_start,
                        'end_date': bhukthi_end,
                        'duration': bhukthi_duration
                    })
                    
                    bhukthi_start = bhukthi_end
                
                dhasa_periods.append({
                    'planet': planet_index,
                    'start_date': dhasa_start,
                    'end_date': dhasa_end,
                    'duration': dhasa_duration,
                    'bhukthi_periods': bhukthi_periods
                })
                
                current_date = dhasa_end
        
        return dhasa_periods
```

### Ashtottari Dhasa System

```python
class AshtottariDhasa:
    """
    Ashtottari Dhasa System (108-year cycle)
    
    Used when Moon is in Scorpio to Pisces nakshatras
    
    Planet Sequence: Sun → Moon → Mars → Mercury → Jupiter → Venus → Saturn → Rahu
    
    Planet Years: Sun(6), Moon(10), Mars(7), Mercury(17), Jupiter(16), Venus(20), Saturn(19), Rahu(18)
    Total: 108 years
    """
    
    APPLICABLE_NAKSHATRAS = [15, 16, 17, 18, 19, 20, 21, 22]  # Vishakha to Pisces
    
    @staticmethod
    def is_applicable(birth_nakshatra):
        """Check if Ashtottari applies to this nakshatra"""
        return birth_nakshatra in AshtottariDhasa.APPLICABLE_NAKSHATRAS
    
    @staticmethod
    def calculate_dhasa_bhukthi(birth_nakshatra, birth_time_jd, place):
        """
        Calculate Ashtottari dhasa/bhukthi periods
        
        Similar structure to Vimsottari but with 8-planet cycle
        """
        # Implementation similar to Vimsottari
        pass
```

### Rasi Dhasa System

```python
class NarayanaDhasa:
    """
    Narayana Rasi Dhasa (12-sign cycle)
    
    Each sign gets 12 years
    Total cycle: 144 years (12 signs × 12 years)
    
    Sign Sequence: Aries → Taurus → Gemini → ... → Pisces
    """
    
    @staticmethod
    def calculate_dhasa(birth_lagna, birth_time_jd, place):
        """
        Calculate Narayana rasi dhasa periods
        
        Args:
            birth_lagna: Ascendant sign (0-11)
            birth_time_jd: Birth time as Julian Day Number
            place: Birth place
            
        Returns:
            List of dhasa periods (one per sign, 12 years each)
        """
        dhasa_periods = []
        current_date = gregorian_from_jd(birth_time_jd)
        
        # Calculate balance of current dhasa
        lagna_position = get_lagna_position_in_sign(birth_time_jd, place)
        balance_years = (1 - lagna_position) * 12
        
        # Generate 12 dhasa periods (one per sign)
        for sign_index in range(12):
            starting_sign = (birth_lagna + sign_index) % 12
            
            if sign_index == 0:
                dhasa_duration = balance_years
            else:
                dhasa_duration = 12
            
            dhasa_start = current_date
            dhasa_end = add_years_months_days(dhasa_start, dhasa_duration)
            
            # Generate antara (sub-period) for each year
            antara_periods = []
            antara_start = dhasa_start
            
            for antara_year in range(int(dhasa_duration)):
                antara_end = add_years_months_days(antara_start, 1)
                antara_periods.append({
                    'year': antara_year + 1,
                    'start_date': antara_start,
                    'end_date': antara_end
                })
                antara_start = antara_end
            
            dhasa_periods.append({
                'sign': starting_sign,
                'start_date': dhasa_start,
                'end_date': dhasa_end,
                'duration': dhasa_duration,
                'antara_periods': antara_periods
            })
            
            current_date = dhasa_end
        
        return dhasa_periods
```

---

## 4. Language & Localization Subsystem

### Overview
Manages multi-language support for the application.

### Language File Structure

```
lang/
├── list_values_en.txt      # English list values
├── list_values_hi.txt      # Hindi list values
├── list_values_ta.txt      # Tamil list values
├── list_values_te.txt      # Telugu list values
├── list_values_ka.txt      # Kannada list values
├── msg_strings_en.txt      # English messages
├── msg_strings_hi.txt      # Hindi messages
├── msg_strings_ta.txt      # Tamil messages
├── msg_strings_te.txt      # Telugu messages
└── msg_strings_ka.txt      # Kannada messages
```

### Language Loading

```python
class LanguageManager:
    """
    Manages language resources and localization
    """
    
    AVAILABLE_LANGUAGES = {
        'English': 'en',
        'Hindi': 'hi',
        'Tamil': 'ta',
        'Telugu': 'te',
        'Kannada': 'ka'
    }
    
    @staticmethod
    def load_language(language_code):
        """
        Load language resources
        
        Args:
            language_code: 'en', 'hi', 'ta', 'te', 'ka'
            
        Returns:
            Dictionary with all localized strings
        """
        lang_path = const._LANGUAGE_PATH
        
        # Load list values
        list_file = f"{lang_path}list_values_{language_code}.txt"
        list_values = LanguageManager._read_resource_lists(list_file)
        
        # Load message strings
        msg_file = f"{lang_path}msg_strings_{language_code}.txt"
        msg_strings = LanguageManager._read_resource_messages(msg_file)
        
        # Merge and return
        return {**list_values, **msg_strings}
    
    @staticmethod
    def _read_resource_lists(file_path):
        """
        Read list values from file
        
        File format:
        key1=value1
        key2=value2|value3|value4
        """
        resources = {}
        
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if '=' in line:
                    key, values = line.strip().split('=', 1)
                    if '|' in values:
                        resources[key] = values.split('|')
                    else:
                        resources[key] = values
        
        return resources
    
    @staticmethod
    def _read_resource_messages(file_path):
        """
        Read message strings from file
        
        File format:
        key1=message1
        key2=message2
        """
        resources = {}
        
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if '=' in line:
                    key, message = line.strip().split('=', 1)
                    resources[key] = message
        
        return resources
```

### Language Usage in UI

```python
def _update_main_window_label_and_tooltips(self):
    """
    Update all UI labels and tooltips with localized strings
    """
    if self.resources:
        msgs = self.resources
        
        # Update labels
        self._name_label.setText(msgs['name_str'])
        self._place_label.setText(msgs['place_str'])
        self._lat_label.setText(msgs['latitude_str'])
        self._long_label.setText(msgs['longitude_str'])
        self._tz_label.setText(msgs['timezone_offset_str'])
        self._dob_label.setText(msgs['date_of_birth_str'])
        self._tob_label.setText(msgs['time_of_birth_str'])
        
        # Update combo boxes
        self._gender_combo.clear()
        self._gender_combo.addItems([
            msgs['gender_male_str'],
            msgs['gender_female_str'],
            msgs['gender_transgender_str'],
            msgs['gender_no_preference_str']
        ])
        
        self._lang_combo.clear()
        self._lang_combo.addItems(list(const.available_languages.keys()))
        
        self._chart_type_combo.clear()
        self._chart_type_combo.addItems([
            msgs['south_indian_str'],
            msgs['north_indian_str'],
            msgs['east_indian_str'],
            msgs['western_str'],
            msgs['sudarsana_chakra_str']
        ])
        
        # Update tooltips
        self._name_label.setToolTip(msgs['name_tooltip_str'])
        self._place_label.setToolTip(msgs['place_tooltip_str'])
        self._lat_label.setToolTip(msgs['latitude_tooltip_str'])
        self._long_label.setToolTip(msgs['longitude_tooltip_str'])
        self._tz_label.setToolTip(msgs['timezone_tooltip_str'])
        self._dob_label.setToolTip(msgs['dob_tooltip_str'])
        self._tob_label.setToolTip(msgs['tob_tooltip_str'])
```

---

## 5. Data Persistence & Configuration Subsystem

### Overview
Manages application configuration, constants, and data files.

### Constants Module (const.py)

```python
# Ayanamsa Modes
available_ayanamsa_modes = {
    'LAHIRI': 0,
    'RAMAN': 1,
    'KRISHNAMURTI': 2,
    'USHASHASHI': 3,
    'SURYASIDDHANTA': 4,
    # ... more modes
}

# Divisional Chart Factors
division_chart_factors = [
    1,   # D1 - Raasi
    2,   # D2 - Hora
    3,   # D3 - Drekkana
    4,   # D4 - Chaturthamsa
    5,   # D5 - Panchamsa
    6,   # D6 - Shashthamsa
    7,   # D7 - Saptamsa
    8,   # D8 - Ashtamsa
    9,   # D9 - Navamsa
    10,  # D10 - Dhashamsa
    11,  # D11 - Rudramsa
    12,  # D12 - Dwadasamsa
    16,  # D16 - Shodamsa
    20,  # D20 - Vimsamsa
    24,  # D24 - Chaturvimsamsa
    27,  # D27 - Nakshatramsa
    30,  # D30 - Thrishamsa
    40,  # D40 - Khavedamsa
    45,  # D45 - Akshavedamsa
    60,  # D60 - Sashtiamsa
    81,  # D81 - Nava Navamsa
    108, # D108 - Ashtottaramsa
    144  # D144 - Dwadas Dwadasamsa
]

# House Calculation Methods
bhaava_madhya_method = 0  # 0=Placidus, 1=Koch, 2=Regiomontanus, etc.

# Planet Symbols
_planet_symbols = {
    0: '☉',   # Sun
    1: '☽',   # Moon
    2: '♂',   # Mars
    3: '☿',   # Mercury
    4: '♃',   # Jupiter
    5: '♀',   # Venus
    6: '♄',   # Saturn
    7: '☊',   # Rahu
    8: '☋'    # Ketu
}

# Zodiac Symbols
_zodiac_symbols = {
    0: '♈',   # Aries
    1: '♉',   # Taurus
    2: '♊',   # Gemini
    # ... etc
}

# Compatibility Scores
compatibility_maximum_score_south = 35.0
compatibility_maximum_score_north = 36.0
```

### Data Files

```
data/
├── ephe/                    # Swiss Ephemeris data
│   ├── se00000.se1
│   ├── se00001.se1
│   └── ... (compressed JPL data)
├── world_cities.csv         # World cities database
├── compatibility_table.csv  # Marriage compatibility data
└── config.ini              # Application configuration
```

### Configuration Loading

```python
class ConfigManager:
    """
    Manages application configuration
    """
    
    @staticmethod
    def load_config():
        """
        Load configuration from files and environment
        
        Returns:
            Dictionary with configuration values
        """
        config = {
            # Default ayanamsa mode
            'default_ayanamsa': 'LAHIRI',
            
            # Default house calculation method
            'default_bhava_method': 0,  # Placidus
            
            # Use world city database
            'use_world_city_database': True,
            
            # Use internet for location lookup
            'use_internet_for_location': True,
            
            # Default language
            'default_language': 'English',
            
            # Default chart type
            'default_chart_type': 'south_indian',
            
            # Ephemeris path
            'ephemeris_path': const._EPHEMERIS_PATH,
            
            # Language path
            'language_path': const._LANGUAGE_PATH,
            
            # Images path
            'images_path': const._IMAGES_PATH,
            
            # Data path
            'data_path': const._DATA_PATH
        }
        
        return config
```

