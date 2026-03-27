# AstroAI

## Goal

**Integrate AI into Astrology** - Using artificial intelligence to understand generated astrological charts and answer questions about them.

AstroAI combines the power of Vedic astrology calculations with modern AI to provide intelligent analysis and interpretation of birth charts, divisional charts, and astrological predictions.

## ✅ API Status: Fully Tested & Production Ready

**All API methods have been comprehensively tested with 58/58 tests passing (100%)**

### Test Coverage Summary

✅ **All 20 Divisional Charts**
- D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D16, D20, D24, D27, D30, D40, D45, D60
- Every chart generates correctly with proper data structure

✅ **All 6 API Methods**
- `set_birth_data()` - Birth data initialization
- `get_chart()` - Single chart generation
- `get_multiple_charts()` - Batch chart generation
- `get_planet_in_house()` - Planet position queries
- `get_planets_in_house()` - House occupancy queries
- `format_chart_text()` - Text formatting

✅ **All 9 Planets**
- Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Raagu, Kethu
- All planets correctly retrieved and positioned

✅ **Data Structure Validation**
- 15 structure checks passed
- All required fields present and correct types

✅ **Error Handling**
- Invalid chart types properly rejected
- Missing birth data properly caught
- Invalid house numbers properly validated
- Non-existent planets return None correctly

✅ **Multiple Calculation Methods**
- D9 methods 1 & 2 tested
- D2 methods 1 & 2 tested

### 🔧 Compatibility Notes

**Rahu/Ketu Naming**: PyJHora uses "Raagu" and "Kethu" internally. The API automatically normalizes both spellings, so you can use either:
```python
# Both work identically
planet = api.get_planet_in_house('D1', 'Rahu')   # ✓ Works
planet = api.get_planet_in_house('D1', 'Raagu')  # ✓ Works
```

## Overview

AstroAI is built on top of **PyJHora**, a comprehensive Python package that implements Vedic astrology calculations based on:

- `Vedic Astrology - An Integrated Approach` by PVR Narasimha Rao
- `Jagannatha Hora V8.0 software` by the same author

The library provides nearly all features described in these authoritative sources, with results verified against the book examples and JHora software outputs.

## Features

### Core Astrology Calculations
- Birth chart (Raasi) and divisional charts (Navamsa, Drekkana, etc.)
- Planetary positions and aspects
- Dasha systems (Vimsottari, Ashtottari, and 30+ other dasha variations)
- Panchanga calculations (Tithi, Nakshatra, Yoga, Karana, Vaara)
- Special lagnas and upagrahas
- Ashtaka Varga and Shodhya Pinda
- Marriage compatibility analysis
- Doshas (Kala Sarpa, Manglik, Pitru, etc.)
- Yogas (284+ yogas from various classical texts)

### AI Integration
- Intelligent chart analysis and interpretation
- Natural language question answering about charts
- Automated predictions and insights
- Pattern recognition in astrological data

### User Interface
- Multi-tab PyQt6 interface with comprehensive chart visualization
- Support for multiple languages (English, Tamil, Telugu, Hindi, Kannada, Malayalam)
- PDF export of detailed horoscope reports
- Real-time chart updates with dynamic input
- Context menus for advanced chart features

## Installation

### Requirements

```bash
# Core dependencies
pip install python-dateutil  # Date utilities (required)
pip install pyswisseph       # Swiss ephemeris for accurate calculations
pip install pyqt6            # GUI framework (optional, for UI)

# Additional dependencies (see PyJHora/requirements.txt)
pip install geocoder geopy img2pdf numpy pyqtgraph pytz Requests setuptools timezonefinder
```

**Minimum for API usage:**
```bash
pip install python-dateutil pyswisseph
```

### Ephemeris Data

From version 3.6.6 onwards, ephemeris data files must be copied separately:

```
Copy files from: https://github.com/naturalstupid/pyjhora/src/jhora/data/ephe
To: <package_installation>/jhora/data/ephe
```

## Quick Start

### Method 1: Using the Ready-Made API (Recommended)

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

# Generate any divisional chart
d1_chart = api.get_chart('D1')   # Birth chart
d9_chart = api.get_chart('D9')   # Navamsa (Marriage)
d10_chart = api.get_chart('D10') # Dasamsa (Career)

# Query specific planets
sun = api.get_planet_in_house('D1', 'Sun')
print(f"Sun is in {sun['house_name']}")

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

# Generate divisional charts
d1_positions = charts.divisional_chart(jd, place, divisional_chart_factor=1)
d9_positions = charts.divisional_chart(jd, place, divisional_chart_factor=9)
d10_positions = charts.divisional_chart(jd, place, divisional_chart_factor=10)
```

### Method 3: Using the GUI

```python
from jhora.ui.horo_chart_tabs import ChartTabbed
from PyQt6.QtWidgets import QApplication
import sys

app = QApplication(sys.argv)
chart = ChartTabbed()
chart.language('English')
chart.compute_horoscope()
chart.show()
sys.exit(app.exec())
```

## Project Structure

```
AstroAI/
├── PyJHora/                          # Core Vedic astrology library
│   ├── jhora/
│   │   ├── horoscope/                # Chart calculations
│   │   ├── panchanga/                # Panchanga calculations
│   │   ├── ui/                       # User interface components
│   │   └── data/                     # Ephemeris and reference data
│   └── requirements.txt
├── Docs/                             # Documentation and reference materials
├── astro_chart_api.py                # Production API class ⭐
├── test_all_api_methods.py           # API test suite (58/58 passing) ⭐
├── PYJHORA_INTEGRATION_GUIDE.md      # Complete API documentation ⭐
├── ARCHITECTURE.md                   # System architecture
├── ARCHITECTURE_VISUAL_DIAGRAMS.md   # Visual diagrams
├── MODULE_TECHNICAL_DETAILS.md       # Module documentation
├── CALCULATION_ALGORITHMS.md         # Mathematical algorithms
├── SUBSYSTEM_DOCUMENTATION.md        # Subsystem docs
└── README.md                         # This file
```

## Documentation

### API Documentation
- **`PYJHORA_INTEGRATION_GUIDE.md`** - Complete API guide with examples ⭐
- **`astro_chart_api.py`** - Production API class (use this in your code) ⭐
- **`test_all_api_methods.py`** - Test suite to verify API works ⭐

### System Documentation
- `ARCHITECTURE.md` - System design and architecture
- `ARCHITECTURE_VISUAL_DIAGRAMS.md` - Visual diagrams of system components
- `MODULE_TECHNICAL_DETAILS.md` - Detailed module documentation
- `CALCULATION_ALGORITHMS.md` - Mathematical algorithms used
- `SUBSYSTEM_DOCUMENTATION.md` - Subsystem-specific documentation

### Quick Links
- **Getting Started**: See [Quick Start](#quick-start) section above
- **Full API Reference**: See `PYJHORA_INTEGRATION_GUIDE.md`
- **Run Tests**: `python test_all_api_methods.py`
- **Run Examples**: `python astro_chart_api.py`

## Testing

### API Tests (100% Pass Rate)

Run comprehensive API tests to verify all functionality:

```bash
python test_all_api_methods.py
```

**Test Results:** 58/58 tests passing
- ✅ All 20 divisional charts (D1-D60)
- ✅ All 6 API methods
- ✅ All 9 planets retrieval
- ✅ Data structure validation
- ✅ Error handling
- ✅ Multiple calculation methods

### PyJHora Core Tests

PyJHora includes ~6800 unit tests verifying calculations against the reference book and JHora software:

```bash
python -m pytest PyJHora/src/jhora/tests/pvr_tests.py
```

**Note:** Tests assume `const._DEFAULT_AYANAMSA_MODE='LAHIRI'`

## Languages Supported

- English
- Tamil
- Telugu
- Hindi
- Kannada
- Malayalam

You can add custom languages by creating language files in the `lang/` directory.

## Credits

All astrology calculations and algorithms are based on the work of **Shri. P.V.R Narasimha Rao**:
- His comprehensive book on Vedic Astrology
- His Jagannatha Hora software
- Various internet sources and classical texts

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure:
- All calculations are verified against reference sources
- Unit tests pass
- Code follows existing style conventions
- Documentation is updated

## Support

For issues, questions, or contributions, please visit:
https://github.com/techie-jai/AstroAI

## Available Divisional Charts

| Chart | Factor | Name | Signification |
|-------|--------|------|---------------|
| D1 | 1 | Rasi/Lagna | Birth Chart, Overall Life |
| D2 | 2 | Hora | Wealth, Money |
| D3 | 3 | Drekkana | Siblings, Courage |
| D4 | 4 | Chaturthamsa | Property, Assets |
| D5 | 5 | Panchamsa | Fame, Power |
| D6 | 6 | Shashthamsa | Health, Diseases |
| D7 | 7 | Saptamsa | Children, Progeny |
| D8 | 8 | Ashtamsa | Longevity, Obstacles |
| D9 | 9 | Navamsa | Spouse, Marriage |
| D10 | 10 | Dasamsa | Career, Profession |
| D11 | 11 | Rudramsa | Destruction |
| D12 | 12 | Dwadasamsa | Parents |
| D16 | 16 | Shodasamsa | Vehicles, Comforts |
| D20 | 20 | Vimsamsa | Spiritual Progress |
| D24 | 24 | Chaturvimsamsa | Education |
| D27 | 27 | Nakshatramsa | Strengths |
| D30 | 30 | Trimsamsa | Evils, Misfortunes |
| D40 | 40 | Khavedamsa | Effects |
| D45 | 45 | Akshavedamsa | General |
| D60 | 60 | Shashtyamsa | Well-being |

---

**Last Updated:** March 2026
**API Version:** 1.0.0 (Fully Tested & Production Ready)
