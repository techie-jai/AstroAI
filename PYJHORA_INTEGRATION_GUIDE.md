# PyJHora Integration Guide

## Complete Guide to Using PyJHora API for Generating Divisional Charts

This guide provides comprehensive documentation on how to use PyJHora to generate various divisional charts (D1, D7, D9, D10, etc.) programmatically.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
5. [Divisional Charts Reference](#divisional-charts-reference)
6. [Examples](#examples)
7. [Integration Patterns](#integration-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Overview

PyJHora is a comprehensive Vedic astrology library that provides:
- **Divisional Chart Calculations** (D1 through D60 and beyond)
- **Multiple Calculation Methods** (Traditional Parasara, Parivritti, etc.)
- **Special Lagnas** (Bhava Lagna, Hora Lagna, etc.)
- **Arudha Padas** and other advanced features
- **Multi-language Support** (English, Tamil, Telugu, Hindi, Kannada, Malayalam)

### What Are Divisional Charts?

Divisional charts (Vargas) are subdivisions of the zodiac used in Vedic astrology to analyze specific areas of life:

- **D1 (Rasi)**: Birth chart - overall life
- **D7 (Saptamsa)**: Children and progeny
- **D9 (Navamsa)**: Spouse and marriage
- **D10 (Dasamsa)**: Career and profession
- And many more...

---

## Installation & Setup

### Prerequisites

```bash
# Required Python version
Python 3.7+

# Required packages
pip install python-dateutil
pip install geocoder geopy img2pdf numpy PyQt6 pyqtgraph pytz Requests setuptools pyswisseph timezonefinder
```

### Installing PyJHora

PyJHora is already included in your project at `PyJHora/` directory.

### Project Structure

```
AstroAI/
├── PyJHora/                    # PyJHora library
│   └── jhora/
│       ├── horoscope/
│       │   ├── main.py        # Main Horoscope class
│       │   └── chart/
│       │       └── charts.py  # Chart calculation functions
│       ├── panchanga/
│       │   └── drik.py        # Astronomical calculations
│       ├── utils.py           # Utility functions
│       └── const.py           # Constants
├── pyjhora_api_guide.py       # API usage guide with examples
├── astro_chart_api.py         # Ready-to-use API class
└── PYJHORA_INTEGRATION_GUIDE.md  # This file
```

---

## Quick Start

### Method 1: Using the Ready-Made API Class

```python
from astro_chart_api import AstroChartAPI

# Create API instance
api = AstroChartAPI()

# Set birth data
api.set_birth_data(
    name="John Doe",
    place_name="Chennai,IN",
    latitude=13.0827,
    longitude=80.2707,
    timezone_offset=5.5,
    year=1990,
    month=6,
    day=15,
    hour=10,
    minute=30
)

# Generate D1 chart (Birth chart)
d1_chart = api.get_chart('D1')
print(f"Ascendant: {d1_chart['ascendant']['house_name']}")

# Generate D9 chart (Navamsa - Marriage)
d9_chart = api.get_chart('D9')

# Generate D10 chart (Dasamsa - Career)
d10_chart = api.get_chart('D10')

# Get multiple charts at once
charts = api.get_multiple_charts(['D1', 'D7', 'D9', 'D10'])
```

### Method 2: Using PyJHora Directly

```python
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'PyJHora'))

from jhora import const, utils
from jhora.panchanga import drik
from jhora.horoscope.chart import charts

# Initialize language resources
utils.set_language('en')

# Create birth data
birth_date = drik.Date(1990, 6, 15)
birth_time = (10, 30, 0)  # Hour, Minute, Second
place = drik.Place("Chennai,IN", 13.0827, 80.2707, 5.5)

# Calculate Julian Day
jd = utils.julian_day_number(birth_date, birth_time)

# Generate D1 chart
d1_positions = charts.divisional_chart(
    jd, 
    place, 
    divisional_chart_factor=1,
    chart_method=1
)

# Generate D9 chart (Navamsa)
d9_positions = charts.divisional_chart(
    jd, 
    place, 
    divisional_chart_factor=9,
    chart_method=1
)

# Generate D10 chart (Dasamsa)
d10_positions = charts.divisional_chart(
    jd, 
    place, 
    divisional_chart_factor=10,
    chart_method=1
)
```

---

## API Reference

### AstroChartAPI Class

#### Constructor

```python
api = AstroChartAPI()
```

#### Methods

##### `set_birth_data()`

Set birth information for chart calculations.

```python
api.set_birth_data(
    name: str,              # Person's name
    place_name: str,        # Birth place (e.g., "Chennai,IN")
    latitude: float,        # Latitude in decimal degrees
    longitude: float,       # Longitude in decimal degrees
    timezone_offset: float, # Timezone offset from UTC (e.g., 5.5 for IST)
    year: int,             # Birth year
    month: int,            # Birth month (1-12)
    day: int,              # Birth day (1-31)
    hour: int,             # Birth hour (0-23, 24-hour format)
    minute: int,           # Birth minute (0-59)
    second: int = 0        # Birth second (0-59), optional
) -> Dict
```

**Returns:** Dictionary with birth data

##### `get_chart()`

Generate a specific divisional chart.

```python
chart_data = api.get_chart(
    chart_type: str = 'D1',  # Chart type: 'D1', 'D7', 'D9', 'D10', etc.
    chart_method: int = 1     # Calculation method (1 = Traditional Parasara)
) -> Dict
```

**Returns:** Dictionary containing:
```python
{
    'chart_type': 'D1',
    'divisional_factor': 1,
    'chart_name': 'Rasi Chart',
    'signification': 'Birth Chart, Overall Life',
    'planets': [
        {
            'id': 0,  # or 'L' for Ascendant
            'name': 'Sun☉',
            'short_name': 'Su☉',
            'house': 2,  # 0-indexed (0 = Aries, 1 = Taurus, etc.)
            'house_name': '♊︎Gemini',
            'longitude': 24.5,
            'longitude_dms': "24° 30' 0\""
        },
        # ... more planets
    ],
    'houses': {
        0: [],  # Aries
        1: [],  # Taurus
        2: [planet_info, ...],  # Gemini
        # ... 12 houses total
    },
    'ascendant': {
        'house': 4,
        'house_name': '♌︎Leo',
        'longitude': 15.5,
        'longitude_dms': "15° 30' 0\""
    },
    'birth_data': {
        'name': 'John Doe',
        'place': 'Chennai,IN',
        'date': '1990-06-15',
        'time': '10:30:00'
    }
}
```

##### `get_multiple_charts()`

Generate multiple divisional charts at once.

```python
charts = api.get_multiple_charts(
    chart_types: List[str] = None  # e.g., ['D1', 'D9', 'D10']
) -> Dict[str, Dict]
```

**Returns:** Dictionary with chart_type as key and chart data as value

##### `get_planet_in_house()`

Get the house position of a specific planet.

```python
planet_info = api.get_planet_in_house(
    chart_type: str,    # e.g., 'D1'
    planet_name: str    # e.g., 'Sun', 'Moon', 'Mars'
) -> Optional[Dict]
```

##### `get_planets_in_house()`

Get all planets in a specific house.

```python
planets = api.get_planets_in_house(
    chart_type: str,     # e.g., 'D1'
    house_number: int    # 1-12
) -> List[Dict]
```

##### `format_chart_text()`

Get a formatted text representation of the chart.

```python
text = api.format_chart_text(chart_type: str = 'D1') -> str
```

---

## Divisional Charts Reference

### Complete List of Divisional Charts

| Factor | Chart Name | Short Code | Signification |
|--------|------------|------------|---------------|
| 1 | Rasi/Lagna | D1 | Birth Chart, Overall Life |
| 2 | Hora | D2 | Wealth, Money |
| 3 | Drekkana | D3 | Siblings, Courage, Communication |
| 4 | Chaturthamsa | D4 | Property, Assets, Fortune |
| 5 | Panchamsa | D5 | Fame, Power, Authority |
| 6 | Shashthamsa | D6 | Health, Diseases, Enemies, Debts |
| 7 | Saptamsa | D7 | Children, Progeny, Grandchildren |
| 8 | Ashtamsa | D8 | Longevity, Obstacles, Sudden Events |
| 9 | Navamsa | D9 | Spouse, Marriage, Dharma |
| 10 | Dasamsa | D10 | Career, Profession, Status, Honors |
| 11 | Rudramsa | D11 | Destruction, Death, Suffering |
| 12 | Dwadasamsa | D12 | Parents, Ancestors |
| 16 | Shodasamsa | D16 | Vehicles, Comforts, Happiness |
| 20 | Vimsamsa | D20 | Spiritual Progress, Worship |
| 24 | Chaturvimsamsa | D24 | Education, Learning, Knowledge |
| 27 | Nakshatramsa | D27 | Strengths, Weaknesses |
| 30 | Trimsamsa | D30 | Evils, Misfortunes, Suffering |
| 40 | Khavedamsa | D40 | Auspicious/Inauspicious Effects |
| 45 | Akshavedamsa | D45 | General Indications, Character |
| 60 | Shashtyamsa | D60 | General Well-being, Past Life |

### Chart Calculation Methods

Different charts support different calculation methods:

```python
# D1 (Rasi) - Only method 1 (Traditional)
d1 = api.get_chart('D1', chart_method=1)

# D2 (Hora) - Multiple methods available
# 1 = Parasara with parivritti
# 2 = Traditional Parasara (Leo & Cancer only)
# 3 = Raman Method
# 4 = Parivritti Dwaya
# 5 = Kashinatha Hora
# 6 = Somanatha method
d2 = api.get_chart('D2', chart_method=2)

# D9 (Navamsa) - Multiple methods
# 1 = Traditional Parasara
# 2 = Parasara with even sign reversal
# 3 = Kalachakra Navamsa
# 4 = Rangacharya Krishna Mishra
d9 = api.get_chart('D9', chart_method=1)
```

---

## Examples

### Example 1: Basic Chart Generation

```python
from astro_chart_api import AstroChartAPI

api = AstroChartAPI()

# Set birth data
api.set_birth_data(
    name="Example Person",
    place_name="Mumbai,IN",
    latitude=19.0760,
    longitude=72.8777,
    timezone_offset=5.5,
    year=1985,
    month=3,
    day=20,
    hour=14,
    minute=45
)

# Generate birth chart
d1 = api.get_chart('D1')

print(f"Birth Chart for {d1['birth_data']['name']}")
print(f"Ascendant: {d1['ascendant']['house_name']}")
print("\nPlanet Positions:")
for planet in d1['planets']:
    if planet['id'] != 'L':
        print(f"  {planet['name']:15s} in {planet['house_name']}")
```

### Example 2: Analyzing Marriage (D9 - Navamsa)

```python
# Get Navamsa chart for marriage analysis
d9 = api.get_chart('D9')

print("Navamsa Chart (Marriage Analysis)")
print(f"Navamsa Ascendant: {d9['ascendant']['house_name']}")

# Find Venus position (significator of spouse)
venus = api.get_planet_in_house('D9', 'Venus')
print(f"Venus in D9: {venus['house_name']}")

# Find 7th house planets (house of spouse)
seventh_house_planets = api.get_planets_in_house('D9', 7)
print(f"Planets in 7th house: {[p['name'] for p in seventh_house_planets]}")
```

### Example 3: Career Analysis (D10 - Dasamsa)

```python
# Get Dasamsa chart for career analysis
d10 = api.get_chart('D10')

print("Dasamsa Chart (Career Analysis)")
print(f"D10 Ascendant: {d10['ascendant']['house_name']}")

# Find 10th house (house of career)
tenth_house_planets = api.get_planets_in_house('D10', 10)
print(f"Planets in 10th house: {[p['name'] for p in tenth_house_planets]}")

# Find Sun (significator of career/authority)
sun = api.get_planet_in_house('D10', 'Sun')
print(f"Sun in D10: {sun['house_name']}")
```

### Example 4: Children Analysis (D7 - Saptamsa)

```python
# Get Saptamsa chart for children analysis
d7 = api.get_chart('D7')

print("Saptamsa Chart (Children Analysis)")
print(f"D7 Ascendant: {d7['ascendant']['house_name']}")

# Find Jupiter (significator of children)
jupiter = api.get_planet_in_house('D7', 'Jupiter')
print(f"Jupiter in D7: {jupiter['house_name']}")

# Find 5th house (house of children)
fifth_house_planets = api.get_planets_in_house('D7', 5)
print(f"Planets in 5th house: {[p['name'] for p in fifth_house_planets]}")
```

### Example 5: Generating Multiple Charts for Complete Analysis

```python
# Generate all major charts
major_charts = api.get_multiple_charts(['D1', 'D7', 'D9', 'D10'])

for chart_type, chart_data in major_charts.items():
    print(f"\n{chart_data['chart_name']} ({chart_type})")
    print(f"Purpose: {chart_data['signification']}")
    print(f"Ascendant: {chart_data['ascendant']['house_name']}")
    
    # Show planets in each house
    for house_num in range(12):
        planets = chart_data['houses'][house_num]
        if planets:
            house_name = utils.RAASI_LIST[house_num]
            planet_names = ', '.join([p['short_name'] for p in planets])
            print(f"  House {house_num + 1} ({house_name}): {planet_names}")
```

### Example 6: Using Horoscope Object for Advanced Features

```python
from jhora.horoscope import main

# Create horoscope object
horo = main.Horoscope(
    place_with_country_code="Delhi,IN",
    latitude=28.6139,
    longitude=77.2090,
    timezone_offset=5.5,
    date_in=drik.Date(1995, 12, 10),
    birth_time="08:15:00",
    calculation_type='drik',
    language='en'
)

# Get chart with additional information (arudhas, special lagnas, etc.)
info, charts_data, asc_house = horo.get_horoscope_information_for_chart(
    chart_index=0,  # 0 = D1, 8 = D9, 9 = D10, etc.
    chart_method=1
)

# Access special lagnas
print("Special Lagnas:")
for key, value in info.items():
    if 'Lagna' in key:
        print(f"  {key}: {value}")
```

---

## Integration Patterns

### Pattern 1: REST API Integration

```python
from flask import Flask, request, jsonify
from astro_chart_api import AstroChartAPI

app = Flask(__name__)

@app.route('/api/chart', methods=['POST'])
def generate_chart():
    data = request.json
    
    api = AstroChartAPI()
    api.set_birth_data(
        name=data['name'],
        place_name=data['place'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        timezone_offset=data['timezone_offset'],
        year=data['year'],
        month=data['month'],
        day=data['day'],
        hour=data['hour'],
        minute=data['minute']
    )
    
    chart_type = data.get('chart_type', 'D1')
    chart = api.get_chart(chart_type)
    
    return jsonify(chart)

if __name__ == '__main__':
    app.run(debug=True)
```

### Pattern 2: Batch Processing

```python
import json

def process_birth_data_batch(birth_data_list, chart_types=['D1', 'D9', 'D10']):
    """Process multiple birth charts in batch"""
    results = []
    
    for birth_data in birth_data_list:
        api = AstroChartAPI()
        api.set_birth_data(**birth_data)
        
        charts = api.get_multiple_charts(chart_types)
        results.append({
            'name': birth_data['name'],
            'charts': charts
        })
    
    return results

# Example usage
birth_data_list = [
    {
        'name': 'Person 1',
        'place_name': 'Chennai,IN',
        'latitude': 13.0827,
        'longitude': 80.2707,
        'timezone_offset': 5.5,
        'year': 1990,
        'month': 6,
        'day': 15,
        'hour': 10,
        'minute': 30
    },
    # ... more birth data
]

results = process_birth_data_batch(birth_data_list)
```

### Pattern 3: Database Integration

```python
import sqlite3
import json

class ChartDatabase:
    def __init__(self, db_path='charts.db'):
        self.conn = sqlite3.connect(db_path)
        self.create_tables()
    
    def create_tables(self):
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS charts (
                id INTEGER PRIMARY KEY,
                name TEXT,
                birth_data TEXT,
                chart_type TEXT,
                chart_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self.conn.commit()
    
    def save_chart(self, name, birth_data, chart_type, chart_data):
        self.conn.execute('''
            INSERT INTO charts (name, birth_data, chart_type, chart_data)
            VALUES (?, ?, ?, ?)
        ''', (name, json.dumps(birth_data), chart_type, json.dumps(chart_data)))
        self.conn.commit()
    
    def get_charts(self, name):
        cursor = self.conn.execute('''
            SELECT chart_type, chart_data FROM charts WHERE name = ?
        ''', (name,))
        return {row[0]: json.loads(row[1]) for row in cursor.fetchall()}
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: ModuleNotFoundError: No module named 'dateutil'

**Solution:**
```bash
pip install python-dateutil
```

#### Issue 2: Language resources not loaded (AttributeError: 'RAASI_LIST')

**Solution:**
```python
# Always initialize language resources after importing
from jhora import utils
utils.set_language('en')
```

#### Issue 3: Incorrect Julian Day calculation

**Solution:**
```python
# Ensure birth_time is a tuple (hour, minute, second)
birth_time = (10, 30, 0)  # NOT a string "10:30:0"
jd = utils.julian_day_number(birth_date, birth_time)
```

#### Issue 4: Planet not found in chart

**Solution:**
```python
# Planet names may include Unicode symbols
# Use the helper method which handles symbols:
planet = api.get_planet_in_house('D1', 'Sun')  # Works with or without symbols
```

#### Issue 5: Timezone offset confusion

**Solution:**
```python
# Timezone offset should be in hours from UTC
# IST (India Standard Time) = UTC + 5:30 = 5.5
# EST (Eastern Standard Time) = UTC - 5:00 = -5.0
# PST (Pacific Standard Time) = UTC - 8:00 = -8.0

timezone_offset = 5.5  # For India
```

### Debugging Tips

1. **Enable verbose output:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

2. **Validate birth data:**
```python
def validate_birth_data(year, month, day, hour, minute):
    assert 1900 <= year <= 2100, "Invalid year"
    assert 1 <= month <= 12, "Invalid month"
    assert 1 <= day <= 31, "Invalid day"
    assert 0 <= hour <= 23, "Invalid hour"
    assert 0 <= minute <= 59, "Invalid minute"
```

3. **Check chart data structure:**
```python
import json
chart = api.get_chart('D1')
print(json.dumps(chart, indent=2, default=str))
```

---

## Best Practices

1. **Always initialize language resources:**
   ```python
   utils.set_language('en')
   ```

2. **Use try-except for robust error handling:**
   ```python
   try:
       chart = api.get_chart('D1')
   except Exception as e:
       print(f"Error generating chart: {e}")
   ```

3. **Cache frequently used charts:**
   ```python
   chart_cache = {}
   cache_key = f"{name}_{chart_type}"
   if cache_key not in chart_cache:
       chart_cache[cache_key] = api.get_chart(chart_type)
   ```

4. **Validate input data:**
   ```python
   if not (-90 <= latitude <= 90):
       raise ValueError("Latitude must be between -90 and 90")
   if not (-180 <= longitude <= 180):
       raise ValueError("Longitude must be between -180 and 180")
   ```

5. **Use appropriate chart methods:**
   ```python
   # For traditional Vedic astrology, use method 1
   chart = api.get_chart('D9', chart_method=1)
   ```

---

## Additional Resources

### Files in This Project

- **`pyjhora_api_guide.py`**: Comprehensive examples and usage patterns
- **`astro_chart_api.py`**: Ready-to-use API class with examples
- **`PyJHora/jhora/horoscope/chart/charts.py`**: Core chart calculation functions
- **`PyJHora/jhora/horoscope/main.py`**: Main Horoscope class

### Running the Examples

```bash
# Run the API guide examples
python pyjhora_api_guide.py

# Run the API class examples
python astro_chart_api.py
```

### Further Reading

- PyJHora GitHub: https://github.com/naturalstupid/PyJHora
- Vedic Astrology divisional charts: Study classical texts like Brihat Parashara Hora Shastra

---

## Summary

You now have two ways to generate divisional charts:

1. **Quick & Easy**: Use `AstroChartAPI` class from `astro_chart_api.py`
2. **Advanced**: Use PyJHora functions directly for more control

Both methods are fully tested and working. The API provides:
- ✅ All major divisional charts (D1-D60)
- ✅ Planet positions with house placements
- ✅ Ascendant information
- ✅ Multiple calculation methods
- ✅ Easy-to-use interface
- ✅ JSON-compatible output

Start with the `AstroChartAPI` class for most use cases, and dive into PyJHora directly when you need advanced features like special lagnas, arudhas, or custom chart methods.
