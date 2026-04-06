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
7. [Backend API & Web Platform](#backend-api--web-platform)
8. [Docker & Deployment](#docker--deployment)
9. [Cloudflare Integration](#cloudflare-integration)
10. [Generated Data & Output](#generated-data--output)
11. [How It Works](#how-it-works)
12. [Accuracy & Validation](#accuracy--validation)
13. [Algorithm Improvements](#algorithm-improvements)
14. [API Reference](#api-reference)
15. [Project Structure](#project-structure)
16. [Testing & Verification](#testing--verification)
17. [Documentation](#documentation)
18. [Credits & License](#credits--license)

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

AstroAI is built on **Jyotishganit**, a comprehensive Python package implementing Vedic astrology calculations using NASA JPL ephemeris data for high-precision astronomical calculations.

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
- Intelligent chart analysis and interpretation
- Natural language question answering about charts
- Automated predictions and insights
- Pattern recognition across multiple charts
- Contextual analysis considering multiple divisional charts

### 💻 User Interfaces
- **New Simple UI** (Recommended): Clean, modern PyQt6 interface for quick chart generation
- **Advanced UI**: Multi-tab interface with comprehensive visualization and PDF export
- **Web Platform**: React-based frontend with FastAPI backend for cloud deployment

### 🌐 Web Platform Features
- **User Authentication**: Firebase Google Sign-In and Email/Password
- **Cloud Storage**: Firebase Firestore for user data and calculations
- **PDF Generation**: Professional AI analysis reports with download capability
- **Responsive Design**: Mobile-friendly React interface with Tailwind CSS
- **Real-time Updates**: WebSocket support for live progress tracking

### 📊 Data Export
- JSON format for programmatic access
- Text format for human-readable reports
- PNG images for visual representation
- PDF reports with detailed analysis and AI insights

---

## System Architecture

### Complete Platform Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         AstroAI Platform (v2.0)                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Client Layer                                  │    │
│  ├─────────────────────────────────────────────────────────────────┤    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │    │
│  │  │  New Simple UI   │  │   Advanced UI    │  │  Web Platform│  │    │
│  │  │   (PyQt6)        │  │   (PyQt6 Tabs)   │  │  (React)     │  │    │
│  │  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘  │    │
│  │           │                      │                   │          │    │
│  └───────────┼──────────────────────┼───────────────────┼──────────┘    │
│              │                      │                   │               │
│  ┌───────────┼──────────────────────┼───────────────────┼──────────┐    │
│  │           │                      │                   │          │    │
│  │  ┌────────▼──────────────────────▼───────────────────▼────────┐ │    │
│  │  │         AstroChartAPI (Local) + FastAPI Backend (Cloud)    │ │    │
│  │  │         - Kundli Generation                                │ │    │
│  │  │         - Chart Generation (D1-D60)                        │ │    │
│  │  │         - PDF Analysis Generation                          │ │    │
│  │  │         - Firebase Integration                             │ │    │
│  │  └────────┬──────────────────────────────────────────────────┘ │    │
│  │           │                                                    │    │
│  │  ┌────────▼──────────────────────────────────────────────────┐ │    │
│  │  │              Jyotishganit Core Library                     │ │    │
│  │  │         (Vedic Astrology Calculations)                    │ │    │
│  │  └────────┬──────────────────────────────────────────────────┘ │    │
│  │           │                                                    │    │
│  │  ┌────────┴──────────────────────────────────────────────────┐ │    │
│  │  │    ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │    │
│  │  │    │ Charts   │  │Panchanga │  │ Doshas   │              │ │    │
│  │  │    │Calc.     │  │& Dasha   │  │& Yogas   │              │ │    │
│  │  │    └──────────┘  └──────────┘  └──────────┘              │ │    │
│  │  └────────────────────────────────────────────────────────────┘ │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                   Storage & Services Layer                        │    │
│  ├──────────────────────────────────────────────────────────────────┤    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │    │
│  │  │   Firebase   │  │   Firestore  │  │  Firebase Storage    │   │    │
│  │  │   Auth       │  │  (User Data) │  │  (PDF Reports)       │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │      Swiss Ephemeris Data (Astronomical Calculations)    │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                  Deployment & Infrastructure                      │    │
│  ├──────────────────────────────────────────────────────────────────┤    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │    │
│  │  │   Docker     │  │  Cloudflare  │  │  HTTPS/SSL           │   │    │
│  │  │  Containers  │  │   Tunnel     │  │  (Zero Trust)        │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

### Architecture Layers

**Client Layer:**
- Local desktop applications (PyQt6-based)
- Web browser interface (React + TypeScript)
- Real-time progress tracking and notifications

**API Layer:**
- AstroChartAPI for local chart generation
- FastAPI backend for web platform
- RESTful endpoints for all operations
- Firebase authentication middleware

**Core Calculation Layer:**
- Jyotishganit library (Vedic astrology engine)
- NASA JPL DE421 ephemeris for research-grade accuracy
- 1000+ astrological data points per kundli
- 20 divisional charts (D1-D60)
- Dasha, Panchanga, Shadbala, Ashtakavarga calculations

**Storage Layer:**
- Firebase Firestore (user data, calculations metadata)
- Firebase Storage (PDF reports)
- Local file system (new-ui application)
- Swiss Ephemeris database

**Infrastructure:**
- Docker containerization for backend
- Cloudflare Tunnel for secure remote access
- HTTPS/SSL encryption
- Zero-trust security model

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

### Quick Start: Using the New UI (Recommended)

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
- AI analysis with PDF generation (requires Gemini API key)

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

## Backend API & Web Platform

### FastAPI Backend

The backend provides a complete REST API for the web platform with Firebase integration.

**Key Features:**
- 20+ REST API endpoints
- Firebase Authentication (Google Sign-In, Email/Password)
- Firestore database integration
- PDF generation and download
- Real-time progress tracking
- CORS support for web deployment

**Main Endpoints:**

```
POST   /api/auth/login              # Firebase authentication
GET    /api/kundli/generate         # Generate kundli data
POST   /api/analysis/generate       # Generate AI analysis
GET    /api/analysis/download/{id}  # Download analysis PDF
GET    /api/history                 # Get user calculation history
GET    /api/profile                 # Get user profile
```

### React Web Frontend

Modern, responsive web interface built with React and TypeScript.

**Features:**
- User authentication with Firebase
- Dashboard with inline kundli generation
- Real-time progress tracking
- PDF download functionality
- Responsive design (mobile, tablet, desktop)
- Tailwind CSS styling
- Lucide React icons
- City autocomplete with timezone lookup
- Progressive action buttons (appear one by one)

**Pages:**
- **Login**: Firebase authentication
- **Dashboard**: User profile, stats, and inline kundli generator
- **Generator**: Birth data input and chart generation (dedicated page)
- **Results**: Chart visualization and analysis
- **Analysis**: AI-powered astrological analysis
- **Chat**: Conversational AI with kundli context
- **Settings**: User preferences

#### Dashboard Features (Updated April 2026)

**New Inline Kundli Generator Card:**
- Clean form for entering birth details directly on dashboard
- Name, place of birth, coordinates, timezone, and birth date/time fields
- City autocomplete with real-time suggestions and automatic coordinate lookup
- Generates kundli without leaving the dashboard

**Progressive Action Flow:**
After kundli generation, buttons appear sequentially:
1. **Analyze with AI** - Triggers comprehensive astrological analysis
2. **Download Analysis PDF** - Available after analysis completes
3. **Chat with AI** - Conversational interface using generated kundli as context

**Dashboard Stats:**
- Total Kundlis generated
- Latest Kundli name
- Number of analyzed kundlis
- Subscription status

**Astrological Insights Section:**
- Displays insights from latest kundli
- Shows important aspects, good times, challenges, and interesting facts
- Refresh button to regenerate insights
- Integrated with AI analysis

### Setup Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up Firebase credentials
# Copy your Firebase service account key to backend/firebase-key.json

# Run the server
python main.py
```

The backend will start on `http://localhost:8000` with API docs at `/docs`.

### Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with Firebase config
cp .env.example .env
# Edit .env with your Firebase credentials

# Run development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

---

## Docker & Deployment

### Docker Setup

Deploy the entire platform using Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**
- **Backend**: FastAPI on port 8000
- **Frontend**: React on port 5173
- **Database**: Firebase (cloud)

### Environment Configuration

Create `.env` file in project root:

```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_STORAGE_BUCKET=your-storage-bucket

# Backend
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0

# Frontend
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
```

### Production Deployment

For production deployment with Cloudflare Tunnel:

```bash
# 1. Build Docker images
docker-compose build

# 2. Start services
docker-compose up -d

# 3. Set up Cloudflare Tunnel (see Cloudflare Integration section)
```

---

## Cloudflare Integration

### Overview

Cloudflare Tunnel provides secure, zero-trust access to your AstroAI platform without exposing ports or managing firewalls.

**Benefits:**
- No port forwarding needed
- Automatic HTTPS/SSL
- DDoS protection
- Web Application Firewall (WAF)
- Zero-trust security model
- Custom domain support

### Quick Setup

```bash
cd cloudflare

# Run setup script (Windows PowerShell)
.\setup.ps1

# Or on Linux/macOS
bash setup.sh
```

### Manual Setup

1. **Install Cloudflare Tunnel:**
   ```bash
   # Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
   ```

2. **Authenticate:**
   ```bash
   cloudflared tunnel login
   ```

3. **Create Tunnel:**
   ```bash
   cloudflared tunnel create astroai
   ```

4. **Configure Routes:**
   Edit `cloudflare/config.yml`:
   ```yaml
   tunnel: astroai
   credentials-file: /path/to/credentials.json
   
   ingress:
     - hostname: kendraa.ai
       service: http://localhost:8000
     - hostname: app.kendraa.ai
       service: http://localhost:5173
     - service: http_status:404
   ```

5. **Start Tunnel:**
   ```bash
   cloudflared tunnel run astroai
   ```

### Testing Tunnel

```bash
# Test tunnel connectivity
.\test-tunnel.ps1  # Windows

# Or on Linux/macOS
bash test-tunnel.sh
```

### Monitoring

Monitor tunnel status and traffic:

```bash
# View tunnel status
cloudflared tunnel info astroai

# View logs
cloudflared tunnel logs astroai
```

For detailed Cloudflare setup, see `cloudflare/SETUP.md` and `CLOUDFLARE_INTEGRATION.md`.

---

## Using the New UI

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

### Output Directory Structure (New UI - Local)

```
users/
└── {timestamp}_{uniqueId}-{name}/
    ├── user_info.json                    # Birth data
    ├── charts_summary.txt                # Summary of all charts
    ├── {UserName}_Kundli.json            # Comprehensive astrological data (1000+ points)
    ├── {UserName}_Kundli.txt             # Formatted kundli text
    ├── {UserName}_AI_Analysis.pdf        # AI analysis report (if generated)
    └── charts/
        ├── json/
        │   ├── D1_Rasi.json              # Birth chart (JSON)
        │   ├── D9_Navamsa.json           # Navamsa chart (JSON)
        │   └── ... (18 more charts)
        ├── text/
        │   ├── D1_Rasi.txt               # Birth chart (Text)
        │   ├── D9_Navamsa.txt            # Navamsa chart (Text)
        │   └── ... (18 more charts)
        └── images/
            ├── D1_Rasi.png               # Birth chart (Image)
            ├── D9_Navamsa.png            # Navamsa chart (Image)
            └── ... (18 more charts)
```

### Cloud Storage (Web Platform)

**Firebase Firestore:**
- User authentication data
- Calculation metadata
- Analysis history
- User preferences

**Firebase Storage:**
- PDF analysis reports
- Chart images
- User-generated documents

### Data Generation Features

**Kundli Data (1000+ Points):**
- Planetary positions in all 20 divisional charts
- Dasha periods (Vimsottari, Ashtottari, etc.)
- Panchanga details (Tithi, Nakshatra, Yoga, Karana, Vaara)
- Doshas (Kala Sarpa, Manglik, Pitru, etc.)
- Yogas (284+ classical yogas)
- Strength analysis (Shadbala)
- Compatibility scores
- And much more

**PDF Analysis Report:**
- Professional formatting with A4 page size
- Birth information table
- Planetary positions summary
- Detailed AI analysis text
- Color-coded headers and tables
- Footer with disclaimer
- UTF-8 character support

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

### 6. AI Analysis (Future Enhancement)

The generated data feeds into AI models for:
- Pattern recognition across charts
- Contextual interpretation
- Prediction generation
- Compatibility analysis
- Personalized insights

---

## Recent Updates (April 2026)

### Dashboard Redesign

**Removed Features:**
- Recent Kundlis tab (replaced with inline generator)

**New Features:**
- **Inline Kundli Generator**: Generate new kundlis directly from dashboard without navigation
- **City Autocomplete**: Real-time city search with automatic coordinate and timezone lookup
- **Progressive Action Flow**: Buttons appear sequentially as kundli is processed
  - Generate Kundli (form)
  - Analyze with AI (after generation)
  - Download Analysis PDF (after analysis)
  - Chat with AI (after analysis)
- **Improved UX**: Cleaner dashboard layout with focus on quick kundli generation

**Backend Improvements:**
- Fixed city search endpoint to use correct CSV file path
- Added comprehensive logging for debugging
- Improved error handling and validation

**Frontend Improvements:**
- City search now uses proper API base URL detection
- Better error handling for city search failures
- Responsive form layout with proper spacing
- Loading states for all async operations

---

## Accuracy & Validation

### Jyotishganit Accuracy

Jyotishganit provides research-grade accuracy using:

- **NASA JPL DE421 ephemeris**: High-precision planetary positions
- **True Chitra Paksha Ayanamsa**: Authentic sidereal calculations
- **Cross-platform compatibility**: Works on Windows, macOS, Linux
- **Arc-second level precision**: Research-grade astronomical accuracy

**Validation Features:**
- Complete JSON-LD structured output
- Semantic web standards compliance
- Professional Vedic astrology calculations
- Traditional calculation methods preserved

### Ephemeris Accuracy

NASA JPL DE421 ephemeris provides:
- **Accuracy**: ±0.001 arc-seconds for planets
- **Time Range**: 3000 BCE to 3000 CE  
- **Standard**: Used by professional astronomers worldwide
- **Validation**: Tested against astronomical observatories

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

```plaintext
AstroAI/
├── jyotishganit_chart_api.py              # Jyotishganit API wrapper 
├── new-ui/                                # PyQt6 desktop application
│   ├── README.md                         # Quick reference
│   └── SETUP.md                          # Detailed setup guide
│
├── new-ui/                               # New Simple UI (Recommended) ⭐
│   ├── main.py                           # Application entry point
│   ├── ui_components.py                  # PyQt6 UI widgets
│   ├── chart_generator.py                # Chart generation logic
│   ├── file_manager.py                   # File operations
│   ├── gemini_analyzer.py                # AI analysis
│   ├── api_client.py                     # API client
│   ├── local_values.py                   # Configuration
│   ├── requirements.txt                  # UI dependencies
│   └── README.md                         # UI documentation
│
├── users/                                # Generated chart data (auto-created)
│   └── {timestamp}_{uniqueId}-{name}/
│       ├── user_info.json                # Birth data
│       ├── charts_summary.txt            # Summary
│       ├── {UserName}_Kundli.json        # Kundli data (1000+ points)
│       ├── {UserName}_Kundli.txt         # Kundli text
│       ├── {UserName}_AI_Analysis.pdf    # AI analysis report
│       └── charts/
│           ├── json/                     # Chart JSON files
│           ├── text/                     # Chart text files
│           └── images/                   # Chart PNG images
│
├── Docs/                                 # Reference materials
│   ├── 50 FAQs in astrology and how to answer them.pdf
│   └── BPHS - 1 RSanthanam.pdf
│
├── astro_chart_api.py                    # Production API class ⭐
├── run_ui.py                             # Quick launcher for new UI ⭐
├── start_all.py                          # Start all services
├── start_all.ps1                         # Start all (PowerShell)
├── docker-compose.yml                    # Docker Compose configuration ⭐
├── Dockerfile                            # Docker image definition
├── entrypoint.sh                         # Docker entrypoint script
│
├── test_all_api_methods.py               # API test suite (58/58 passing) ⭐
├── test_kundli_generation.py             # Kundli generation tests
├── test_new_ui_backend.py                # UI backend tests
├── test_backend_endpoints.py             # Backend endpoint tests
├── test_backend_flow.py                  # Complete flow tests
│
├── JYOTISHGANIT_INTEGRATION_SUMMARY.md     # Integration documentation ⭐
├── COMPREHENSIVE_KUNDLI_SUCCESS.md         # Success documentation ⭐
├── ARCHITECTURE.md                       # System architecture
├── ARCHITECTURE_VISUAL_DIAGRAMS.md       # Visual diagrams
├── MODULE_TECHNICAL_DETAILS.md           # Module documentation
├── CALCULATION_ALGORITHMS.md             # Mathematical algorithms
├── SUBSYSTEM_DOCUMENTATION.md            # Subsystem docs
├── KUNDLI_GENERATION_GUIDE.md            # Kundli generation details
├── DEPLOYMENT_GUIDE.md                   # Complete deployment guide ⭐
├── CLOUDFLARE_INTEGRATION.md             # Cloudflare setup guide ⭐
├── DOCKER_SETUP.md                       # Docker setup guide ⭐
├── TESTING_GUIDE.md                      # Testing framework ⭐
├── OPTIMIZATION_GUIDE.md                 # Performance optimization ⭐
├── FINAL_CHECKLIST.md                    # Deployment checklist ⭐
│
├── firebase.json                         # Firebase configuration
├── firestore.indexes.json                # Firestore indexes
├── firestore.rules                       # Firestore security rules
├── storage.rules                         # Storage security rules
├── .firebaserc                           # Firebase project config
│
├── README.md                             # This file
├── LICENSE                               # License information
└── .gitignore                            # Git ignore rules
```

### Key Directories

**Backend (`backend/`):**
- FastAPI REST API with 20+ endpoints
- Firebase integration (Auth, Firestore, Storage)
- PDF generation with reportlab
- Pydantic models for validation

**Frontend (`frontend/`):**
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Firebase SDK integration

**Cloudflare (`cloudflare/`):**
- Tunnel configuration and setup
- Automated setup scripts
- Testing utilities
- Documentation

**New UI (`new-ui/`):**
- PyQt6 desktop application
- Local chart generation
- File management
- AI analysis integration

**Docker:**
- Multi-stage Dockerfile for optimized images
- docker-compose.yml for orchestration
- Environment configuration
- Health checks and dependencies

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

### Backend Endpoint Tests

```bash
python test_backend_endpoints.py
```

Tests all FastAPI endpoints including:
- Authentication endpoints
- Kundli generation
- Analysis generation
- PDF download
- History retrieval

### UI Backend Tests

```bash
python test_new_ui_backend.py
```

### Complete Flow Tests

```bash
python test_backend_flow.py
```

Tests the complete workflow from user registration to PDF generation.

### Jyotishganit Tests

Jyotishganit provides built-in validation and testing:

```bash
# Test Jyotishganit functionality
python test_jyotishganit.py

# Test Jyotishganit API wrapper  
python test_jyotishganit_api.py
```

**Features:**
- Complete planetary position validation
- Divisional chart accuracy verification
- JSON-LD structure validation
- Professional-grade calculation verification

### Docker Testing

```bash
# Build and run tests in Docker
docker-compose up --build

# Run specific test suite
docker-compose exec backend python test_backend_endpoints.py

# View logs
docker-compose logs -f backend
```

### Cloudflare Tunnel Testing

```bash
# Windows PowerShell
.\cloudflare\test-tunnel.ps1

# Linux/macOS
bash cloudflare/test-tunnel.sh
```

### Performance Testing

See `TESTING_GUIDE.md` for:
- Load testing procedures
- Performance benchmarks
- Memory profiling
- Database query optimization tests

---

## Documentation

### Complete Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| `README.md` | Project overview and quick start | Everyone |
| `JYOTISHGANIT_INTEGRATION_SUMMARY.md` | Complete integration guide | Developers |
| `COMPREHENSIVE_KUNDLI_SUCCESS.md` | Success documentation | Everyone |
| `ARCHITECTURE.md` | System design and architecture | Architects, Developers |
| `ARCHITECTURE_VISUAL_DIAGRAMS.md` | Visual system diagrams | Everyone |
| `MODULE_TECHNICAL_DETAILS.md` | Detailed module documentation | Developers |
| `CALCULATION_ALGORITHMS.md` | Mathematical algorithms used | Astrology Experts |
| `SUBSYSTEM_DOCUMENTATION.md` | Subsystem-specific documentation | Developers |
| `KUNDLI_GENERATION_GUIDE.md` | Kundli generation details | Developers |
| `DEPLOYMENT_GUIDE.md` | Complete deployment guide | DevOps, Developers |
| `CLOUDFLARE_INTEGRATION.md` | Cloudflare Tunnel setup | DevOps, System Admins |
| `DOCKER_SETUP.md` | Docker containerization guide | DevOps, Developers |
| `TESTING_GUIDE.md` | Testing framework and procedures | QA, Developers |
| `OPTIMIZATION_GUIDE.md` | Performance optimization | Developers, DevOps |
| `FINAL_CHECKLIST.md` | Pre/post-deployment checklist | DevOps, Project Managers |
| `backend/README.md` | Backend API documentation | Backend Developers |
| `frontend/README.md` | Frontend setup and features | Frontend Developers |
| `cloudflare/README.md` | Cloudflare quick reference | DevOps |
| `new-ui/README.md` | New UI documentation | End Users, Developers |

### Quick Start Guides

**For End Users:**
1. Install dependencies: `pip install -r backend/requirements.txt`
2. Run the new UI: `python run_ui.py`
3. Enter birth details and generate charts

**For Web Platform Users:**
1. Visit `https://kendraa.ai` (or your custom domain)
2. Sign in with Google or email
3. Generate kundli and analysis
4. Download PDF reports

**For Developers:**
1. Clone repository: `git clone https://github.com/techie-jai/AstroAI.git`
2. Set up backend: `cd backend && pip install -r requirements.txt`
3. Set up frontend: `cd frontend && npm install`
4. Configure Firebase credentials
5. Run tests: `python test_all_api_methods.py`
6. Start services: `python start_all.py` or `docker-compose up`

**For DevOps/Deployment:**
1. Read `DEPLOYMENT_GUIDE.md`
2. Configure Docker: `docker-compose build`
3. Set up Cloudflare: `cd cloudflare && .\setup.ps1`
4. Deploy: `docker-compose up -d`
5. Verify: `.\cloudflare\test-tunnel.ps1`

### Getting Help

- **Getting Started**: See [Getting Started](#getting-started) section
- **Full API Reference**: See `JYOTISHGANIT_INTEGRATION_SUMMARY.md`
- **Backend Setup**: See `backend/README.md`
- **Frontend Setup**: See `frontend/README.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`
- **Run Tests**: `python test_all_api_methods.py`
- **Run Examples**: `python astro_chart_api.py`
- **Issues**: Create an issue on GitHub

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
- Backend and frontend changes are tested

### Support & Issues

For issues, questions, or contributions:
- GitHub: https://github.com/techie-jai/AstroAI
- Create an issue on GitHub for bug reports
- Submit pull requests for improvements
- Check existing documentation first

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

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Lucide React icons, shadcn/ui
- **Build Tool**: Vite
- **Authentication**: Firebase SDK
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Admin SDK
- **PDF Generation**: ReportLab
- **Validation**: Pydantic
- **CORS**: FastAPI CORS middleware
- **Async**: Python asyncio

### Core Calculations
- **Astrology Engine**: Jyotishganit
- **Ephemeris**: NASA JPL DE421 (Skyfield)
- **Date/Time**: python-dateutil, pytz
- **Geolocation**: geopy, geocoder, timezonefinder

### Desktop UI
- **Framework**: PyQt6
- **Image Processing**: Pillow
- **PDF Export**: img2pdf
- **HTTP**: requests

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Tunneling**: Cloudflare Tunnel
- **Security**: HTTPS/SSL, Zero-trust model
- **Cloud**: Firebase (Auth, Firestore, Storage)

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

## Platform Status

### ✅ Completed Features

**Core Calculations:**
- ✅ 20 divisional charts (D1-D60)
- ✅ 1000+ astrological data points per kundli
- ✅ Dasha systems (Vimsottari, Ashtottari, etc.)
- ✅ Panchanga calculations
- ✅ Doshas and Yogas
- ✅ Strength analysis (Shadbala)

**Desktop Application:**
- ✅ PyQt6 UI with auto-complete
- ✅ Real-time progress tracking
- ✅ Multiple output formats (JSON, Text, PNG)
- ✅ Kundli generation
- ✅ AI analysis with PDF export

**Web Platform:**
- ✅ React frontend with responsive design
- ✅ FastAPI backend with 20+ endpoints
- ✅ Firebase authentication
- ✅ Firestore database integration
- ✅ PDF generation and download
- ✅ User history and dashboard

**Infrastructure:**
- ✅ Docker containerization
- ✅ Docker Compose orchestration
- ✅ Cloudflare Tunnel setup
- ✅ HTTPS/SSL encryption
- ✅ Zero-trust security model

**Testing & Documentation:**
- ✅ 58/58 API tests passing
- ✅ Comprehensive test suites
- ✅ 15+ documentation files
- ✅ Deployment guides
- ✅ Setup scripts and utilities

### 🚀 Future Enhancements

- Cross-chart correlation analysis
- Advanced aspect relationship analysis
- Dasha-chart integration
- Strength-based interpretation weighting
- Multi-factor doshas analysis
- Advanced compatibility deep dive
- Mobile app (iOS/Android)
- Real-time collaboration features
- Advanced caching and optimization
- Machine learning predictions

---

## Quick Links

- **GitHub Repository**: https://github.com/techie-jai/AstroAI
- **Live Demo**: https://kendraa.ai
- **API Documentation**: `/docs` (when backend is running)
- **Issue Tracker**: https://github.com/techie-jai/AstroAI/issues
- **Discussions**: https://github.com/techie-jai/AstroAI/discussions

---

**Last Updated:** April 2026  
**Platform Version:** 2.0.0 (Production Ready)  
**API Version:** 1.0.0 (Fully Tested)  
**Status:** ✅ Active Development & Maintenance

**Key Milestones:**
- Phase 1: Core Calculations ✅ (Complete)
- Phase 2: Desktop UI ✅ (Complete)
- Phase 3: Web Platform ✅ (Complete)
- Phase 4: Docker & Deployment ✅ (Complete)
- Phase 5: Cloudflare Integration ✅ (Complete)
- Phase 6: Testing & Documentation ✅ (Complete)
