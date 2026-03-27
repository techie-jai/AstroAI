# AstroAI

## Goal

**Integrate AI into Astrology** - Using artificial intelligence to understand generated astrological charts and answer questions about them.

AstroAI combines the power of Vedic astrology calculations with modern AI to provide intelligent analysis and interpretation of birth charts, divisional charts, and astrological predictions.

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
pip install pyswisseph    # Swiss ephemeris for accurate calculations
pip install pyqt6         # GUI framework
pip install PyJHora       # Vedic astrology library
```

For additional dependencies, see `PyJHora/requirements.txt`

### Ephemeris Data

From version 3.6.6 onwards, ephemeris data files must be copied separately:

```
Copy files from: https://github.com/naturalstupid/pyjhora/src/jhora/data/ephe
To: <package_installation>/jhora/data/ephe
```

## Quick Start

### Using the GUI

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

### Using the Library

```python
from jhora.horoscope.main import get_horoscope_information
from jhora import utils
from datetime import datetime

# Define birth details
dob = datetime(1990, 5, 15, 14, 30, 0)
place = "Chennai, IN"

# Get horoscope information
horoscope = get_horoscope_information(dob, place)

# Access chart data
print(horoscope['raasi_chart'])
print(horoscope['navamsa_chart'])
```

## Project Structure

```
AstroAI/
├── PyJHora/              # Core Vedic astrology library
│   ├── src/jhora/
│   │   ├── horoscope/    # Chart calculations
│   │   ├── panchanga/    # Panchanga calculations
│   │   ├── ui/           # User interface components
│   │   └── data/         # Ephemeris and reference data
│   └── requirements.txt
├── Docs/                 # Documentation and reference materials
├── ARCHITECTURE.md       # System architecture
└── README.md            # This file
```

## Documentation

- `ARCHITECTURE.md` - System design and architecture
- `ARCHITECTURE_VISUAL_DIAGRAMS.md` - Visual diagrams of system components
- `MODULE_TECHNICAL_DETAILS.md` - Detailed module documentation
- `CALCULATION_ALGORITHMS.md` - Mathematical algorithms used
- `SUBSYSTEM_DOCUMENTATION.md` - Subsystem-specific documentation

## Testing

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

---

**Last Updated:** March 2026
