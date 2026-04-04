# AstroAI - Vedic Astrology Meets Artificial Intelligence

> **Intelligent astrological analysis powered by Vedic calculations and AI**

---

## 📑 Table of Contents

1. [About AstroAI](#about-astroai)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [Installation & Setup](#installation--setup)
5. [Getting Started](#getting-started)
6. [Using the New UI](#using-the-new-ui)
7. [Generated Data & Output](#generated-data--output)
8. [How It Works](#how-it-works)
9. [Accuracy & Validation](#accuracy--validation)
10. [Algorithm Improvements](#algorithm-improvements)
11. [API Reference](#api-reference)
12. [Project Structure](#project-structure)
13. [Testing & Verification](#testing--verification)
14. [Documentation](#documentation)
15. [Credits & License](#credits--license)

---

## About AstroAI

**AstroAI** is a comprehensive platform that integrates **Vedic astrology calculations** with **artificial intelligence** to provide intelligent analysis and interpretation of birth charts, divisional charts, and astrological predictions.

### Mission

Combine the ancient wisdom of Vedic astrology with modern AI to:
- Generate accurate astrological charts based on precise astronomical calculations
- Provide intelligent, context-aware interpretations of astrological data
- Enable pattern recognition across multiple divisional charts
- Offer data-driven insights into life predictions and compatibility analysis

### Built On

AstroAI is built on top of **PyJHora**, a comprehensive Python package implementing Vedic astrology calculations based on:
- `Vedic Astrology - An Integrated Approach` by PVR Narasimha Rao
- `Jagannatha Hora V8.0 software` by the same author
- Classical Vedic astrology texts and methodologies

---

## Key Features

### 🔢 Core Astrology Calculations
- **Birth Charts & Divisional Charts**: D1 (Rasi), D2 (Hora), D3 (Drekkana), D9 (Navamsa), D10 (Dasamsa), and 15 more
- **Planetary Positions & Aspects**: Accurate positions of all 9 planets across all divisional charts
- **Dasha Systems**: Vimsottari, Ashtottari, and 30+ other dasha variations
- **Panchanga Calculations**: Tithi, Nakshatra, Yoga, Karana, Vaara
- **Special Lagnas & Upagrahas**: Advanced astrological points
- **Ashtaka Varga & Shodhya Pinda**: Strength analysis
- **Doshas**: Kala Sarpa, Manglik, Pitru, and others
- **Yogas**: 284+ yogas from classical texts
- **Compatibility Analysis**: Marriage and relationship compatibility

### 🤖 AI Integration
- **Gemini-Powered Chat**: Ask questions about your kundli and get AI-powered astrological insights
- **Dashboard Insights**: AI-generated insights with Important Aspects, Good Times, Challenges, and Interesting Facts
- **Context-Aware Responses**: Chat includes complete kundli data (1000+ data points) for accurate analysis
- **Intelligent Analysis**: Pattern recognition across multiple charts
- **Persistent Learning**: Chat history stored for reference
- **Firebase-Backed Data**: Complete kundli data fetched from Firebase for each chat query

### 💻 User Interfaces
- **Web Dashboard** (NEW): Modern React-based dashboard with sidebar navigation
- **Chat Interface** (NEW): Gemini-style chat for astrological queries
- **New Simple UI** (Recommended): Clean, modern PyQt6 interface for quick chart generation
- **Advanced UI**: Multi-tab interface with comprehensive visualization and PDF export

### 📊 Data Export & Management
- **JSON format** for programmatic access
- **Text format** for human-readable reports
- **PNG images** for visual representation
- **PDF reports** with detailed analysis
- **Web Dashboard**: View all calculations, analyses, and insights
- **Download PDFs**: Export AI analysis as professional PDF documents

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      AstroAI Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │   New Simple UI  │  │   Advanced UI    │                 │
│  │   (PyQt6)        │  │   (PyQt6 Tabs)   │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                      │                           │
│           └──────────┬───────────┘                           │
│                      │                                       │
│           ┌──────────▼──────────┐                           │
│           │  AstroChartAPI      │                           │
│           │  (Production API)   │                           │
│           └──────────┬──────────┘                           │
│                      │                                       │
│           ┌──────────▼──────────┐                           │
│           │     PyJHora         │                           │
│           │  (Core Calculations)│                           │
│           └──────────┬──────────┘                           │
│                      │                                       │
│        ┌─────────────┼─────────────┐                        │
│        │             │             │                        │
│   ┌────▼───┐  ┌─────▼────┐  ┌────▼───┐                    │
│   │ Charts │  │Panchanga │  │ Doshas │                    │
│   │Calc.   │  │& Dasha   │  │& Yogas │                    │
│   └────────┘  └──────────┘  └────────┘                    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Ephemeris Data (Swiss Ephemeris)             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation & Setup

### System Requirements

- **Python**: 3.10 or higher
- **OS**: Windows, Linux, or macOS
- **RAM**: 2GB minimum (4GB recommended)
- **Disk Space**: 500MB for dependencies and ephemeris data

### Step 1: Clone the Repository

```bash
git clone https://github.com/techie-jai/AstroAI.git
cd AstroAI
```

### Step 2: Create Virtual Environment

#### On Windows (PowerShell)
```powershell
python -m venv astroai-env
.\astroai-env\Scripts\Activate.ps1
```

#### On Windows (Command Prompt)
```cmd
python -m venv astroai-env
astroai-env\Scripts\activate.bat
```

#### On Linux/macOS
```bash
python3 -m venv astroai-env
source astroai-env/bin/activate
```

### Step 3: Install Dependencies

```bash
# Install core dependencies
pip install python-dateutil pyswisseph

# Install UI dependencies (for new-ui)
pip install PyQt6 Pillow numpy pytz geopy geocoder img2pdf requests setuptools timezonefinder

# Or install all at once
pip install python-dateutil pyswisseph PyQt6 Pillow numpy pytz geopy geocoder img2pdf requests setuptools timezonefinder
```

### Step 4: Verify Installation

```bash
# Test API functionality
python test_all_api_methods.py

# Expected output: 58/58 tests passing ✅
```

---

## Getting Started

### Quick Start: Using the Web Dashboard (NEW - Recommended)

Access the modern web-based dashboard:

```
https://astroai-7.netlify.app
```

**Features:**
- Sign in with Google account
- Professional sidebar navigation
- AI-powered dashboard with insights
- Gemini-style chat interface
- View all your kundlis and analyses
- Download PDF reports
- Responsive design (desktop & mobile)

### Using the New UI (Desktop Application)

The simplest way to generate astrological charts locally:

```bash
# From project root
python run_ui.py
```

Or directly:
```bash
cd new-ui
python main.py
```

**UI Features:**
- Simple form for entering birth details
- Auto-complete for place names with automatic coordinate lookup
- Generates all 20 divisional charts with one click
- Real-time progress tracking
- Organized output folders

### Using the API (For Developers)

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

# Generate charts
d1_chart = api.get_chart('D1')    # Birth chart
d9_chart = api.get_chart('D9')    # Navamsa (Marriage)
d10_chart = api.get_chart('D10')  # Dasamsa (Career)

# Query specific planets
sun = api.get_planet_in_house('D1', 'Sun')
print(f"Sun is in {sun['house_name']}")

# Get multiple charts at once
charts = api.get_multiple_charts(['D1', 'D7', 'D9', 'D10'])

# Get kundli (comprehensive astrological data)
kundli = api.get_kundli()
```

---

## Using the Web Dashboard

### Accessing the Dashboard

1. Visit: https://astroai-7.netlify.app
2. Click "Sign in with Google"
3. Complete authentication
4. Dashboard loads with your data

### Dashboard Features

**Navigation Sidebar**:
- Dashboard - View insights and recent calculations
- Kundli - Manage all your generated kundlis
- Analysis - View and download AI analyses
- Chat - Ask questions about your kundli
- Settings - Account and preferences

**Dashboard Page**:
- Stats cards showing total kundlis, latest kundli, analyses
- AI-generated insights (Important Aspects, Good Times, Challenges, Interesting Facts)
- Recent calculations sidebar
- Quick action buttons
- Refresh insights on demand

**Chat Page** (NEW - v14):
- Gemini-style interface with real-time responses
- Left panel: Kundli information (name, birth date, place)
- Right panel: Chat messages with timestamps
- Quick question suggestions for common queries
- Context-aware AI responses based on complete kundli data
- Fallback UI to select kundli if none provided
- Full kundli JSON context sent to Gemini for accurate analysis

**Kundli Page**:
- View all generated kundlis
- Birth details for each kundli
- Quick links to view or chat

**Analysis Page**:
- View all generated analyses
- Download PDF reports
- Professional formatting

## Using the New UI (Desktop)

### Starting the Application

```bash
python run_ui.py
```

### Workflow

1. **Enter Birth Details**
   - Name
   - Date of Birth (DD/MM/YYYY)
   - Time of Birth (HH:MM)
   - Place of Birth (with auto-complete)

2. **Generate Charts**
   - Click "Generate Charts"
   - Monitor progress in real-time
   - All 20 divisional charts generated automatically

3. **View Results**
   - Charts saved in organized user folder
   - Multiple formats: JSON, Text, PNG
   - Kundli (comprehensive data) also generated

### UI Features

- **Auto-Complete Place Names**: Automatically fills coordinates
- **Progress Tracking**: Real-time status updates
- **Organized Output**: User-specific folders with timestamps
- **Multiple Formats**: JSON, Text, and PNG exports
- **Kundli Generation**: 1000+ astrological data points
- **Error Handling**: Graceful error messages and recovery

---

## Generated Data & Output

### Output Directory Structure

```
users/
└── {timestamp}_{uniqueId}-{name}/
    ├── user_info.json                    # Birth data
    ├── charts_summary.txt                # Summary of all charts
    ├── {UserName}_Kundli.json            # Comprehensive astrological data
    ├── {UserName}_Kundli.txt             # Formatted kundli text
    └── charts/
        ├── D1_Rasi.json                  # Birth chart (JSON)
        ├── D1_Rasi.txt                   # Birth chart (Text)
        ├── D1_Rasi.png                   # Birth chart (Image)
        ├── D9_Navamsa.json               # Navamsa chart (JSON)
        ├── D9_Navamsa.txt
        ├── D9_Navamsa.png
        └── ... (18 more charts)
```

### File Formats

#### JSON Format
```json
{
  "chart_name": "D1",
  "chart_factor": 1,
  "houses": {
    "1": {"sign": "Aries", "degree": 15.5, "planets": ["Sun", "Mercury"]},
    "2": {"sign": "Taurus", "degree": 20.3, "planets": []},
    ...
  },
  "planets": {
    "Sun": {"house": 1, "sign": "Aries", "degree": 15.5, "speed": "direct"},
    ...
  }
}
```

#### Text Format
```
D1 - RASI CHART (Birth Chart)
============================

House 1 (Aries, 15°30')
  - Sun (15°30', Direct)
  - Mercury (18°15', Direct)

House 2 (Taurus, 20°18')
  - (Empty)

...
```

#### Kundli JSON
Contains 1000+ astrological data points including:
- Planetary positions in all divisional charts
- Dasha periods
- Panchanga details
- Doshas and Yogas
- Strength analysis
- And much more

### Accessing Generated Data

**From the UI:**
- All files automatically saved to `users/` directory
- Organized by user and timestamp
- Easy to locate and review

**Programmatically:**
```python
import json

# Read generated chart
with open('users/{folder}/charts/D1_Rasi.json') as f:
    d1_chart = json.load(f)

# Read kundli
with open('users/{folder}/{UserName}_Kundli.json') as f:
    kundli = json.load(f)
```

---

## How It Works

### 1. Birth Data Input

The system requires precise birth information:
- **Date**: Year, Month, Day
- **Time**: Hour, Minute, Second (as accurate as possible)
- **Location**: Latitude, Longitude, Timezone Offset

Accuracy depends on the precision of birth time. Even 1 minute difference can shift planetary positions.

### 2. Ephemeris Calculation

Using **Swiss Ephemeris** (industry standard), the system:
- Calculates exact planetary positions for the given moment
- Accounts for precession and nutation
- Provides positions accurate to within seconds of arc
- Handles all 9 planets: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu

### 3. Chart Generation

For each divisional chart (D1, D2, D9, etc.):
- Multiplies the zodiac by the divisional factor
- Calculates house positions based on Lagna (Ascendant)
- Determines planetary placements in each house
- Computes aspects and relationships

**Example (D9 - Navamsa):**
```
D1 Position: 15° Aries
D9 Position: (15° × 9) mod 360° = 135° = 15° Leo
```

### 4. Multi-Chart Analysis

The system generates **20 divisional charts**, each revealing different life aspects:

| Chart | Signification | Use Case |
|-------|---------------|----------|
| D1 | Overall Life | General personality, life events |
| D2 | Wealth | Financial matters, assets |
| D9 | Marriage | Spouse, marriage compatibility |
| D10 | Career | Profession, public image |
| D7 | Children | Progeny, family matters |
| D12 | Parents | Parental relationships |

### 5. Kundli Generation

The kundli consolidates 1000+ astrological data points:
- Planetary positions in all charts
- Dasha periods (time periods)
- Panchanga (5 elements: Tithi, Nakshatra, Yoga, Karana, Vaara)
- Doshas (afflictions)
- Yogas (combinations)
- Strength analysis
- Compatibility scores

### 6. AI Chat Integration (NEW - v14)

The chat feature enables real-time astrological consultation:

**Chat Workflow:**
1. User navigates to `/chat/{kundliId}` with a selected kundli
2. Backend fetches complete kundli data from Firebase using `FirebaseService.get_kundli()`
3. Extracts birth_data and horoscope_info (1000+ data points)
4. Builds comprehensive context prompt with all kundli information
5. User sends question about their kundli
6. Backend sends complete kundli data + question to Gemini API
7. Gemini analyzes the kundli and provides accurate astrological insights
8. Response returned to frontend with timestamp

**Data Flow:**
```
User Question
    ↓
Firebase Fetch (kundli_id)
    ↓
Extract: birth_data + horoscope_info
    ↓
Build Context: "You are an astrology advisor with this kundli: [complete data]"
    ↓
Gemini API: context + question
    ↓
AI Response (based on actual kundli data)
    ↓
Frontend Display with timestamp
```

**Key Features:**
- Complete kundli data (1000+ data points) sent with each query
- Birth information included in context
- Horoscope information for accurate analysis
- Timestamp tracking for each response
- Fallback UI for kundli selection if none provided
- Error handling for missing kundli data

### 7. AI Analysis (Future Enhancement)

The generated data feeds into AI models for:
- Pattern recognition across charts
- Contextual interpretation
- Prediction generation
- Compatibility analysis
- Personalized insights

---

## Accuracy & Validation

### PyJHora Accuracy

PyJHora is validated against:
- **Reference Book**: "Vedic Astrology - An Integrated Approach" by PVR Narasimha Rao
- **JHora Software**: Jagannatha Hora V8.0 (same author)
- **Classical Texts**: Traditional Vedic astrology methodologies

**Validation Results:**
- ~6800 unit tests in PyJHora test suite
- Results verified against book examples
- Cross-checked with JHora software outputs
- Consistent with classical calculations

### Ephemeris Accuracy

Swiss Ephemeris provides:
- **Accuracy**: ±0.01 arc-seconds for planets
- **Time Range**: 3000 BCE to 3000 CE
- **Standard**: Used by professional astrologers worldwide
- **Validation**: Tested against NASA JPL ephemeris

### Birth Time Sensitivity

**Critical Note**: Accuracy depends heavily on birth time precision:
- ±1 minute error → ±4 minutes in Lagna (Ascendant)
- ±4 minutes error → ±1 house shift possible
- Rectification may be needed for uncertain birth times

### API Test Coverage

**58/58 Tests Passing (100%)**
- ✅ All 20 divisional charts (D1-D60)
- ✅ All 6 API methods
- ✅ All 9 planets retrieval
- ✅ Data structure validation
- ✅ Error handling
- ✅ Multiple calculation methods

---

## Algorithm Improvements

### Current Approach

The system currently:
1. Generates individual divisional charts independently
2. Calculates planetary positions in each chart
3. Consolidates data into kundli format
4. Provides basic chart-specific interpretations

### Planned Enhancements

#### 1. Cross-Chart Correlation Analysis
**Goal**: Understand how charts influence each other

**Implementation:**
- Analyze planetary positions across all 20 charts simultaneously
- Identify consistent patterns (e.g., strong Mars in D1, D3, D10)
- Weight interpretations based on chart strength
- Detect contradictions and harmonies

**Example:**
```
If Mars is strong in:
  - D1 (Birth) → Courage, energy
  - D3 (Siblings) → Competitive siblings
  - D10 (Career) → Leadership potential
  → Interpretation: Natural leader with competitive drive
```

#### 2. Aspect Relationship Analysis
**Goal**: Understand planetary interactions beyond individual positions

**Implementation:**
- Calculate aspects between planets in same chart
- Analyze inter-chart aspects (D1 planets aspecting D9 planets)
- Weight aspects by strength and nature
- Generate aspect-based interpretations

**Example:**
```
If Jupiter aspects Saturn:
  - Benefic-Malefic interaction
  - Creates balance and wisdom
  - Modifies individual interpretations
```

#### 3. Dasha-Chart Integration
**Goal**: Time-based analysis considering current dasha periods

**Implementation:**
- Link dasha periods to divisional chart strengths
- Predict timing of events based on dasha-chart combinations
- Analyze dasha lord's position in relevant charts
- Generate time-specific predictions

**Example:**
```
During Jupiter Dasha:
  - Check Jupiter's position in D10 (Career)
  - Check D9 (Marriage) for relationship timing
  - Correlate with current transits
  → Predict career and marriage timing
```

#### 4. Strength-Based Weighting
**Goal**: Prioritize interpretations based on chart strength

**Implementation:**
- Calculate planetary strength in each chart (Shadbala)
- Weight interpretations by strength scores
- Highlight strong vs. weak placements
- Provide confidence levels for predictions

**Example:**
```
Strong Mars in D1 + Weak Mars in D10
  → Good personal courage, but career challenges
  → Confidence: High for personality, Low for career
```

#### 5. Multi-Factor Doshas
**Goal**: Comprehensive affliction analysis

**Implementation:**
- Analyze doshas across multiple charts
- Correlate doshas with life areas
- Suggest remedies based on chart strength
- Provide severity assessment

**Example:**
```
Manglik Dosha in D1 + D9:
  - Severe marriage affliction
  - Requires remedial measures
  - Specific recommendations based on chart strength
```

#### 6. Compatibility Deep Dive
**Goal**: Advanced relationship analysis

**Implementation:**
- Analyze all 20 charts for compatibility
- Calculate synastry (chart comparison)
- Identify complementary and challenging aspects
- Provide specific guidance for relationships

**Example:**
```
Compare D1 (Personality) + D9 (Marriage) + D7 (Children):
  - Personality compatibility
  - Marriage potential
  - Family harmony
  → Comprehensive relationship assessment
```

### Implementation Timeline

- **Phase 1** (Current): Individual chart generation ✅
- **Phase 2** (Next): Cross-chart correlation analysis
- **Phase 3**: Aspect relationship analysis
- **Phase 4**: Dasha-chart integration
- **Phase 5**: AI-powered predictions

---

## Chat Feature Implementation (v14)

### Backend Changes

#### New Chat Endpoint: `/api/chat/message`

**Endpoint Details:**
```
POST /api/chat/message
Authentication: Required (Firebase token)
```

**Request Body:**
```json
{
  "kundli_id": "cb6bd644915d",
  "user_message": "What are my key planetary positions?",
  "chat_history": [
    {"role": "user", "content": "Tell me about my kundli"},
    {"role": "assistant", "content": "Based on your kundli..."}
  ]
}
```

**Response:**
```json
{
  "kundli_id": "cb6bd644915d",
  "user_message": "What are my key planetary positions?",
  "response": "Based on your kundli data, here are your key planetary positions...",
  "timestamp": "2026-04-04T22:01:30.123456"
}
```

**Implementation Details:**

1. **Firebase Data Fetch:**
   - Uses `FirebaseService.get_kundli(uid, kundli_id)` to fetch complete kundli from Firebase
   - Retrieves both `birth_data` and `horoscope_info` (1000+ data points)
   - Same method used by `/api/kundli/{kundli_id}` endpoint

2. **Context Building:**
   - Extracts birth information (name, date, time, place, coordinates)
   - Extracts horoscope information (planetary positions, doshas, yogas, etc.)
   - Builds comprehensive prompt with all kundli data
   - Includes chat history (last 5 messages) for context

3. **Gemini Integration:**
   - Sends complete kundli data + user question to Gemini API
   - Gemini analyzes the actual kundli data
   - Returns accurate astrological insights based on the data

4. **Response Handling:**
   - Returns response with proper JSON serialization
   - Includes timestamp using `datetime.now().isoformat()`
   - Proper error handling for missing kundli data

**Files Modified:**
- `backend/main.py`:
  - Added `from datetime import datetime` import
  - Implemented `/api/chat/message` endpoint (lines 1117-1224)
  - Uses `FirebaseService.get_kundli()` for data fetch
  - Builds context with birth_data and horoscope_info
  - Sends to Gemini with complete kundli context

### Frontend Changes

#### ChatPage Component Updates

**New Features:**
- Fallback UI when no kundli ID provided
- Displays list of available kundlis for selection
- Inline styles for guaranteed rendering
- Loading state with spinner
- Error handling with navigation options

**File Modified:**
- `frontend/src/pages/ChatPage.tsx`:
  - Simplified rendering logic with inline CSS
  - Added kundli selection screen
  - Loading and error states
  - Chat interface with kundli info panel
  - Quick question suggestions

### API Endpoints Summary

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/chat/message` | POST | Send chat message with kundli context | ✅ |
| `/api/kundli/{kundli_id}` | GET | Fetch complete kundli data | ✅ |
| `/api/user/calculations` | GET | List user's kundlis | ✅ |

---

## API Reference

### AstroChartAPI Class

#### Methods

**`set_birth_data()`**
```python
api.set_birth_data(
    name: str,
    place_name: str,
    latitude: float,
    longitude: float,
    timezone_offset: float,
    year: int,
    month: int,
    day: int,
    hour: int,
    minute: int
)
```

**`get_chart(chart_type: str)`**
```python
chart = api.get_chart('D1')  # Returns chart data
```

**`get_multiple_charts(chart_types: list)`**
```python
charts = api.get_multiple_charts(['D1', 'D9', 'D10'])
```

**`get_planet_in_house(chart_type: str, planet: str)`**
```python
sun = api.get_planet_in_house('D1', 'Sun')
```

**`get_planets_in_house(chart_type: str, house: int)`**
```python
planets = api.get_planets_in_house('D1', 1)
```

**`get_kundli()`**
```python
kundli = api.get_kundli()  # Returns 1000+ data points
```

**`format_chart_text(chart_type: str)`**
```python
text = api.format_chart_text('D1')
```

---

## Project Structure

```
AstroAI/
├── PyJHora/                              # Core Vedic astrology library
│   ├── jhora/
│   │   ├── horoscope/                    # Chart calculations
│   │   ├── panchanga/                    # Panchanga calculations
│   │   ├── ui/                           # Advanced UI components
│   │   └── data/                         # Ephemeris and reference data
│   └── requirements.txt
│
├── backend/                              # FastAPI Backend (NEW) ⭐
│   ├── main.py                           # FastAPI application
│   ├── firebase_config.py                # Firebase configuration
│   ├── firebase_service.py               # Firebase service
│   ├── astrology_service.py              # Astrology calculations
│   ├── pdf_generator.py                  # PDF generation
│   ├── file_manager.py                   # File operations
│   ├── requirements.txt                  # Backend dependencies
│   └── README.md                         # Backend documentation
│
├── frontend/                             # React Web Dashboard (NEW) ⭐
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx               # Collapsible sidebar navigation
│   │   │   ├── Layout.tsx                # Layout wrapper
│   │   │   ├── Navbar.tsx                # Top navigation bar
│   │   │   ├── InsightCard.tsx           # Insight card component
│   │   │   └── ProtectedRoute.tsx        # Route protection
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx             # Google authentication
│   │   │   ├── DashboardPage.tsx         # Dashboard with insights
│   │   │   ├── ChatPage.tsx              # Gemini-style chat
│   │   │   ├── KundliPage.tsx            # Kundli management
│   │   │   ├── AnalysisPage.tsx          # Analysis management
│   │   │   ├── GeneratorPage.tsx         # Kundli generator
│   │   │   ├── ResultsPage.tsx           # Results display
│   │   │   ├── HistoryPage.tsx           # History view
│   │   │   └── SettingsPage.tsx          # Settings
│   │   ├── services/
│   │   │   ├── api.ts                    # API client
│   │   │   └── firebase.ts               # Firebase service
│   │   ├── store/
│   │   │   └── authStore.ts              # Zustand auth store
│   │   ├── App.tsx                       # Main app component
│   │   ├── main.tsx                      # Entry point
│   │   └── index.css                     # Global styles
│   ├── netlify.toml                      # Netlify configuration
│   ├── package.json                      # Dependencies
│   ├── vite.config.ts                    # Vite configuration
│   ├── tailwind.config.js                # Tailwind CSS config
│   └── README.md                         # Frontend documentation
│
├── new-ui/                               # New Simple UI (Desktop) ⭐
│   ├── main.py                           # Application entry point
│   ├── ui_components.py                  # PyQt6 UI widgets
│   ├── chart_generator.py                # Chart generation logic
│   ├── file_manager.py                   # File operations
│   ├── gemini_analyzer.py                # AI analysis
│   ├── local_values.py                   # Configuration
│   ├── requirements.txt                  # UI dependencies
│   └── README.md                         # UI documentation
│
├── users/                                # Generated chart data (auto-created)
│   └── {timestamp}_{uniqueId}-{name}/
│       ├── user_info.json                # Birth data
│       ├── charts_summary.txt            # Summary
│       ├── {UserName}_Kundli.json        # Kundli data
│       ├── {UserName}_Kundli.txt         # Kundli text
│       ├── analysis/                     # Analysis PDFs
│       └── charts/                       # JSON, text, PNG files
│
├── Docs/                                 # Reference materials
│   ├── 50 FAQs in astrology and how to answer them.pdf
│   └── BPHS - 1 RSanthanam.pdf
│
├── astro_chart_api.py                    # Production API class ⭐
├── run_ui.py                             # Quick launcher for new UI ⭐
├── test_all_api_methods.py               # API test suite (58/58 passing) ⭐
├── test_kundli_generation.py             # Kundli generation tests
├── test_new_ui_backend.py                # UI backend tests
├── docker-compose.yml                    # Docker compose configuration
├── Dockerfile                            # Docker image definition
├── entrypoint.sh                         # Docker entrypoint script
│
├── PYJHORA_INTEGRATION_GUIDE.md           # Complete API documentation ⭐
├── FIRESTORE_SCHEMA.md                   # Database schema (NEW)
├── IMPLEMENTATION_CHECKLIST.md           # Implementation status (NEW)
├── ARCHITECTURE.md                       # System architecture
├── ARCHITECTURE_VISUAL_DIAGRAMS.md       # Visual diagrams
├── MODULE_TECHNICAL_DETAILS.md           # Module documentation
├── CALCULATION_ALGORITHMS.md             # Mathematical algorithms
├── SUBSYSTEM_DOCUMENTATION.md            # Subsystem docs
├── KUNDLI_GENERATION_GUIDE.md            # Kundli generation details
│
├── README.md                             # This file
├── LICENSE                               # License information
└── .gitignore                            # Git ignore rules
```

---

## Testing & Verification

### API Tests (100% Pass Rate)

Run comprehensive API tests:

```bash
python test_all_api_methods.py
```

**Results:** 58/58 tests passing
- ✅ All 20 divisional charts (D1-D60)
- ✅ All 6 API methods
- ✅ All 9 planets retrieval
- ✅ Data structure validation
- ✅ Error handling
- ✅ Multiple calculation methods

### Kundli Generation Tests

```bash
python test_kundli_generation.py
```

**Results:** All tests passing
- ✅ Kundli generates 1000+ data points
- ✅ All charts work correctly
- ✅ No regressions in functionality

### UI Backend Tests

```bash
python test_new_ui_backend.py
```

### PyJHora Core Tests

PyJHora includes ~6800 unit tests:

```bash
python -m pytest PyJHora/src/jhora/tests/pvr_tests.py
```

**Note:** Tests assume `const._DEFAULT_AYANAMSA_MODE='LAHIRI'`

---

## Documentation

### Quick References

| Document | Purpose |
|----------|---------|
| `PYJHORA_INTEGRATION_GUIDE.md` | Complete API guide with examples |
| `ARCHITECTURE.md` | System design and architecture |
| `ARCHITECTURE_VISUAL_DIAGRAMS.md` | Visual system diagrams |
| `MODULE_TECHNICAL_DETAILS.md` | Detailed module documentation |
| `CALCULATION_ALGORITHMS.md` | Mathematical algorithms used |
| `SUBSYSTEM_DOCUMENTATION.md` | Subsystem-specific documentation |
| `KUNDLI_GENERATION_GUIDE.md` | Kundli generation details |

### Getting Help

- **Getting Started**: See [Getting Started](#getting-started) section
- **Full API Reference**: See `PYJHORA_INTEGRATION_GUIDE.md`
- **Run Tests**: `python test_all_api_methods.py`
- **Run Examples**: `python astro_chart_api.py`

---

## Credits & License

### Acknowledgments

All astrology calculations and algorithms are based on the work of **Shri. P.V.R Narasimha Rao**:
- His comprehensive book: "Vedic Astrology - An Integrated Approach"
- His software: Jagannatha Hora V8.0
- Various classical Vedic astrology texts

### Ephemeris Data

- **Swiss Ephemeris**: Industry-standard astronomical calculations
- **Accuracy**: ±0.01 arc-seconds for planetary positions

### License

See `LICENSE` file for details.

### Contributing

Contributions are welcome! Please ensure:
- All calculations are verified against reference sources
- Unit tests pass (run `python test_all_api_methods.py`)
- Code follows existing style conventions
- Documentation is updated

### Support & Issues

For issues, questions, or contributions:
- GitHub: https://github.com/techie-jai/AstroAI
- Create an issue on GitHub for bug reports
- Submit pull requests for improvements

---

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

## Supported Languages

- English
- Tamil
- Telugu
- Hindi
- Kannada
- Malayalam

Custom languages can be added by creating language files in the `lang/` directory.

---

---

## Recent Updates (April 2026)

### 🚀 New Web Dashboard & Chat Interface

**Major Features Added:**
- ✅ **React Web Dashboard** - Modern, responsive interface with Tailwind CSS
- ✅ **Collapsible Sidebar Navigation** - Gemini-style navigation menu
- ✅ **AI-Powered Chat** - Gemini integration for astrological queries
- ✅ **Dashboard Insights** - AI-generated insights with refresh capability
- ✅ **Kundli Management** - View and manage all generated kundlis
- ✅ **Analysis Management** - View and download PDF analyses
- ✅ **User Data Persistence** - Load user data on login
- ✅ **Professional PDF Export** - Download analyses as formatted PDFs

**Deployment:**
- ✅ Frontend deployed to Netlify: https://astroai-7.netlify.app
- ✅ Backend endpoints implemented and ready for deployment
- ✅ Firebase integration for authentication and data storage
- ✅ Firestore schema documented

**New Files:**
- `frontend/` - Complete React application
- `backend/` - FastAPI backend with 10+ endpoints
- `FIRESTORE_SCHEMA.md` - Database schema documentation
- `IMPLEMENTATION_CHECKLIST.md` - Implementation status

**Technology Stack:**
- Frontend: React 18, TypeScript, Tailwind CSS, Zustand, Firebase SDK
- Backend: FastAPI, Python 3.11, Firebase Admin SDK, Gemini API
- Deployment: Netlify (frontend), Docker (backend)

---

## Deployment Status

### Frontend ✅
- **Status**: Live and Production Ready
- **URL**: https://astroai-7.netlify.app
- **Platform**: Netlify
- **Build**: Successful (429.50 KB JS, 21.91 KB CSS)

### Backend ✅
- **Status**: Implemented and Ready for Deployment
- **Framework**: FastAPI + Python 3.11
- **Endpoints**: 10+ fully implemented
- **Deployment**: Docker or local Python

### Documentation ✅
- `FIRESTORE_SCHEMA.md` - Complete database schema
- `IMPLEMENTATION_CHECKLIST.md` - Phase completion status
- `DEPLOYMENT_STATUS.md` - Deployment details

---

**Last Updated:** April 4, 2026  
**API Version:** 1.0.0 (Fully Tested & Production Ready)  
**Frontend Version:** 1.0.0 (Live on Netlify)  
**Status:** ✅ Production Ready - Frontend Live, Backend Ready for Deployment
