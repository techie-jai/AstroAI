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
12. [Recent Updates (April 2026)](#recent-updates-april-2026)
13. [🌟 Dosha & Dasha Analysis Feature](#-dosha--dasha-analysis-feature-new--april-2026)
14. [Accuracy & Validation](#accuracy--validation)
15. [Algorithm Improvements](#algorithm-improvements)
16. [API Reference](#api-reference)
17. [Project Structure](#project-structure)
18. [Testing & Verification](#testing--verification)
19. [Documentation](#documentation)
20. [Credits & License](#credits--license)

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
- **Dasha Systems**: Vimsottari, Ashtottari, and 30+ other dasha variations with current period tracking
- **Panchanga Calculations**: Tithi, Nakshatra, Yoga, Karana, Vaara
- **Special Lagnas & Upagrahas**: Advanced astrological points
- **Ashtaka Varga & Shodhya Pinda**: Strength analysis
- **Doshas**: Kala Sarpa, Manglik, Pitru, and others with Bhanga (cancellation) detection
- **Dosha Bhanga (NEW)**: Automatic detection of dosha cancellations with detailed reasons
- **Yogas**: 284+ yogas from classical texts
- **Kundli Matching (NEW)**: Ashtakoota 8-fold compatibility analysis for marriage matching
- **Compatibility Analysis**: Marriage and relationship compatibility
- **Divisional Charts Extraction**: All D1-D60 charts properly extracted and fed into chat context

### 🤖 AI Integration
- **Intelligent Chart Analysis**: Context-aware interpretation using all divisional charts
- **Natural Language Q&A**: Answer questions about charts, doshas, dashas, and predictions
- **Persistent Chat History**: Messages saved immediately, rolling summaries every 10 messages
- **Chat Context Management**: Facts extraction, context summaries, and sliding window context
- **Pattern Recognition**: Across multiple charts and dasha periods
- **Contextual Analysis**: Considers multiple divisional charts and current dasha periods

### 💻 User Interfaces
- **New Simple UI** (Recommended): Clean, modern PyQt6 interface for quick chart generation
- **Advanced UI**: Multi-tab interface with comprehensive visualization and PDF export
- **Web Platform**: React-based frontend with FastAPI backend for cloud deployment
- **Chat Interface**: Conversational AI with persistent history and previous chat access

### 🌐 Web Platform Features
- **User Authentication**: Firebase Google Sign-In and Email/Password with UID-based isolation
- **Cloud Storage**: Firebase Firestore for user data and calculations
- **Local File Storage**: Persistent kundli data with kundli_index.json tracking
- **PDF Generation**: Professional AI analysis reports with download capability
- **Responsive Design**: Mobile-friendly React interface with Tailwind CSS
- **Real-time Updates**: WebSocket support for live progress tracking
- **Google Maps Integration**: Real-time location autocomplete with automatic coordinate and timezone lookup
- **Chat Features (NEW)**: 
  - Previous chat history with kundli titles
  - "New Chat" button for quick kundli generation
  - Persistent message storage with atomic writes
  - Rolling summaries and facts extraction
  - Multi-kundli chat support with correct folder routing

### 📊 Data Export
- JSON format for programmatic access
- Text format for human-readable reports
- PNG images for visual representation
- PDF reports with detailed analysis and AI insights

---

## System Architecture

### Complete Platform Architecture (Updated April 2026)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AstroAI Platform (v2.1 - April 2026)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         CLIENT LAYER                                 │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │   │
│  │  │  New Simple UI   │  │   Advanced UI    │  │  Web Platform    │  │   │
│  │  │   (PyQt6)        │  │   (PyQt6 Tabs)   │  │  (React + TS)    │  │   │
│  │  │  - Local Storage │  │  - Multi-tab     │  │  - Dashboard     │  │   │
│  │  │  - Offline Mode  │  │  - PDF Export    │  │  - Generator     │  │   │
│  │  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │   │
│  │           │                      │                     │            │   │
│  └───────────┼──────────────────────┼─────────────────────┼────────────┘   │
│              │                      │                     │                 │
│  ┌───────────┼──────────────────────┼─────────────────────┼────────────┐   │
│  │           │                      │                     │            │   │
│  │  ┌────────▼──────────────────────▼─────────────────────▼──────────┐ │   │
│  │  │                    API & BACKEND LAYER                         │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ FastAPI Backend (Port 8000)                             │ │ │   │
│  │  │  │ - 20+ REST Endpoints                                    │ │ │   │
│  │  │  │ - Firebase Auth Middleware                              │ │ │   │
│  │  │  │ - UID-based Data Isolation (Security Fix)               │ │ │   │
│  │  │  │ - Fresh API Instances (State Isolation Fix)             │ │ │   │
│  │  │  │ - Analysis File Checking (has_analysis Fix)             │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │                                                                │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ AstrologyService                                        │ │ │   │
│  │  │  │ - Fresh JyotishganitChartAPI per request                │ │ │   │
│  │  │  │ - Prevents singleton state issues                       │ │ │   │
│  │  │  │ - Kundli & Chart Generation                             │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │                                                                │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ FileManager                                              │ │ │   │
│  │  │  │ - Local file system storage (users/ directory)           │ │ │   │
│  │  │  │ - kundli_index.json with UID tracking                    │ │ │   │
│  │  │  │ - has_analysis() method for analysis detection           │ │ │   │
│  │  │  │ - Organized folder structure per user                    │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  └────────┬──────────────────────────────────────────────────────┘ │   │
│  │           │                                                        │   │
│  │  ┌────────▼──────────────────────────────────────────────────────┐ │   │
│  │  │           CORE CALCULATION LAYER                              │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ Jyotishganit Core Library (Vedic Astrology Engine)       │ │ │   │
│  │  │  │ - 20 Divisional Charts (D1-D60)                          │ │ │   │
│  │  │  │ - 9 Planets: Sun, Moon, Mars, Mercury, Jupiter, Venus,   │ │ │   │
│  │  │  │   Saturn, Rahu, Ketu                                     │ │ │   │
│  │  │  │ - 1000+ Astrological Data Points per Kundli              │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │                                                                │ │   │
│  │  │  ┌─────────────┬──────────────┬──────────────┬──────────────┐ │ │   │
│  │  │  │ Charts      │ Panchanga    │ Doshas       │ Yogas        │ │ │   │
│  │  │  │ Calc.       │ & Dasha      │ & Strength   │ (284+)       │ │ │   │
│  │  │  │ (D1-D60)    │ Systems      │ Analysis     │ Recognition  │ │ │   │
│  │  │  └─────────────┴──────────────┴──────────────┴──────────────┘ │ │   │
│  │  │                                                                │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ Swiss Ephemeris Data (NASA JPL DE421)                    │ │ │   │
│  │  │  │ - Research-grade accuracy (±0.001 arc-seconds)           │ │ │   │
│  │  │  │ - Time range: 3000 BCE to 3000 CE                        │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  └────────┬──────────────────────────────────────────────────────┘ │   │
│  │           │                                                        │   │
│  └───────────┼────────────────────────────────────────────────────────┘   │
│              │                                                             │
│  ┌───────────▼──────────────────────────────────────────────────────┐    │
│  │              STORAGE & DATA LAYER                                │    │
│  ├───────────────────────────────────────────────────────────────────┤    │
│  │                                                                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐ │    │
│  │  │ LOCAL FILE SYSTEM (Primary Data Storage)                    │ │    │
│  │  │ users/                                                       │ │    │
│  │  │ ├── kundli_index.json (with UID & has_analysis tracking)   │ │    │
│  │  │ └── {timestamp}-{name}/                                     │ │    │
│  │  │     ├── user_info.json                                      │ │    │
│  │  │     ├── {name}_Kundli.json (1000+ data points)              │ │    │
│  │  │     ├── {name}_Kundli.txt                                   │ │    │
│  │  │     ├── {name}_AI_Analysis.txt (if generated)               │ │    │
│  │  │     ├── {name}_AI_Analysis.pdf (if generated)               │ │    │
│  │  │     └── charts/                                             │ │    │
│  │  │         ├── json/ (D1-D60 JSON format)                      │ │    │
│  │  │         ├── text/ (D1-D60 Text format)                      │ │    │
│  │  │         └── images/ (D1-D60 PNG format)                     │ │    │
│  │  └─────────────────────────────────────────────────────────────┘ │    │
│  │                                                                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐ │    │
│  │  │ FIREBASE (Authentication & Metadata)                        │ │    │
│  │  │ - Firebase Auth (Google Sign-In, Email/Password)            │ │    │
│  │  │ - Firestore (User profiles, calculation metadata)           │ │    │
│  │  │ - Firebase Storage (Backup PDF reports)                     │ │    │
│  │  └─────────────────────────────────────────────────────────────┘ │    │
│  │                                                                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐ │    │
│  │  │ FRONTEND CACHING (Browser)                                  │ │    │
│  │  │ - localStorage: Kundli data per kundli_id                   │ │    │
│  │  │ - Dual-fetch strategy (API → localStorage fallback)         │ │    │
│  │  │ - CacheManager for data persistence                         │ │    │
│  │  └─────────────────────────────────────────────────────────────┘ │    │
│  │                                                                   │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │           DEPLOYMENT & INFRASTRUCTURE LAYER                       │    │
│  ├───────────────────────────────────────────────────────────────────┤    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │    │
│  │  │   Docker     │  │  Cloudflare  │  │  HTTPS/SSL           │   │    │
│  │  │  Containers  │  │   Tunnel     │  │  (Zero Trust)        │   │    │
│  │  │  - Backend   │  │  - Secure    │  │  - Encryption        │   │    │
│  │  │  - Frontend  │  │    Remote    │  │  - DDoS Protection   │   │    │
│  │  │  - Compose   │  │    Access    │  │  - WAF               │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Layers

**Client Layer:**
- Local desktop applications (PyQt6-based)
- Web browser interface (React + TypeScript)
- Real-time progress tracking and notifications
- Chat interface with persistent history

**API Layer:**
- AstroChartAPI for local chart generation
- FastAPI backend for web platform
- RESTful endpoints for all operations
- Firebase authentication middleware
- Chat endpoints with multi-kundli support

**Core Calculation Layer:**
- Jyotishganit library (Vedic astrology engine)
- NASA JPL DE421 ephemeris for research-grade accuracy
- 1000+ astrological data points per kundli
- 20 divisional charts (D1-D60)
- Dasha, Panchanga, Shadbala, Ashtakavarga calculations

**Storage Layer:**
- Firebase Firestore (user data, calculations metadata)
- Firebase Storage (PDF reports)
- Local file system (kundli data, chat history)
- Swiss Ephemeris database
- Chat history with atomic writes and file locking

**Infrastructure:**
- Docker containerization for backend
- Cloudflare Tunnel for secure remote access
- HTTPS/SSL encryption
- Zero-trust security model

### Chat System Architecture (NEW - April 2026)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHAT SYSTEM ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              FRONTEND (React/TypeScript)                 │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ ChatWithKundliPage Component                        │ │   │
│  │  │ - Message display and input                         │ │   │
│  │  │ - Previous chats sidebar                            │ │   │
│  │  │ - New Chat button                                   │ │   │
│  │  │ - Kundli info panel                                 │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ Previous Chats List (Sidebar)                       │ │   │
│  │  │ - Kundli names with dates                           │ │   │
│  │  │ - Click to resume conversation                      │ │   │
│  │  │ - Highlights current chat                           │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API LAYER (FastAPI)                         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ Chat Endpoints                                      │ │   │
│  │  │ - GET  /api/chat/history/{kundli_id}               │ │   │
│  │  │ - POST /api/chat/save-message                       │ │   │
│  │  │ - GET  /api/chat/context/{kundli_id}               │ │   │
│  │  │ - DELETE /api/chat/history/{kundli_id}             │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ Kundli Lookup (Multi-kundli Support)                │ │   │
│  │  │ - lookup_kundli(kundli_id) from kundli_index.json   │ │   │
│  │  │ - Extract correct user folder from file_path        │ │   │
│  │  │ - Verify UID matches current user                   │ │   │
│  │  │ - Fallback to get_user_folder() if needed           │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         CHAT SERVICE LAYER (Python)                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ ChatHistoryManager                                  │ │   │
│  │  │ - Atomic file writes (.tmp + rename)                │ │   │
│  │  │ - File locking with filelock library                │ │   │
│  │  │ - Message persistence                               │ │   │
│  │  │ - Metadata tracking                                 │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ ContextSummaryGenerator                             │ │   │
│  │  │ - Rolling summaries every 10 messages               │ │   │
│  │  │ - Gemini integration for incremental updates        │ │   │
│  │  │ - Key topics extraction                             │ │   │
│  │  │ - Async background task                             │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ KundliFactsExtractor                                │ │   │
│  │  │ - Extract facts from kundli data                    │ │   │
│  │  │ - Parse AI responses for astrological facts         │ │   │
│  │  │ - Merge facts without duplicates                    │ │   │
│  │  │ - Async background task                             │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         STORAGE LAYER (File System)                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  users/                                                  │   │
│  │  ├── kundli_index.json (UID tracking)                   │   │
│  │  └── {timestamp}-{uid}-{name}/                          │   │
│  │      ├── chat/                                           │   │
│  │      │   └── {kundli_id}/                               │   │
│  │      │       ├── messages.json (all messages)            │   │
│  │      │       ├── context_summary.json (rolling summary)  │   │
│  │      │       ├── kundli_facts.json (extracted facts)     │   │
│  │      │       └── metadata.json (conversation stats)      │   │
│  │      └── kundli/                                         │   │
│  │          └── {kundli_id}.json (kundli data)              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Data Flow:
1. User sends message → ChatWithKundliPage
2. Frontend calls POST /api/chat/save-message
3. Backend looks up correct user folder using kundli_id
4. ChatService saves message atomically with file locking
5. Async tasks trigger:
   - Rolling summary generation (every 10 messages)
   - Facts extraction from AI response
6. Frontend loads chat history with GET /api/chat/history/{kundli_id}
7. Backend retrieves messages from correct folder
8. Messages displayed in UI with context
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

#### Google Maps Integration (NEW - April 2026)

**Place of Birth Autocomplete:**
- Real-time location search powered by Google Maps API
- Automatic coordinate lookup (latitude, longitude)
- Timezone detection from location
- Fallback to CSV database for offline/backup search
- Supports cities, hospitals, landmarks, and exact addresses
- High-precision coordinates for accurate calculations

**How It Works:**
1. User types location in "Place of Birth" field
2. Frontend queries Google Maps Autocomplete API
3. Results display with full formatted addresses
4. Selection auto-fills latitude, longitude, and timezone
5. Falls back to CSV database if Google Maps unavailable
6. Coordinates used for precise astrological calculations

**Features:**
- ✅ Real-time suggestions as user types
- ✅ Full address display (street, city, state, country, postal code)
- ✅ Automatic timezone calculation
- ✅ Fallback CSV search for reliability
- ✅ Session tokens for API efficiency
- ✅ Error handling with user-friendly messages
- ✅ Works offline with CSV database backup

**Configuration:**
Add Google Maps API key to `frontend/.env.local`:
```env
VITE_GOOGLE_MAPS_API_KEY=your-api-key-here
```

Get your API key from [Google Cloud Console](https://console.cloud.google.com/):
1. Create a new project
2. Enable Maps JavaScript API
3. Create an API key (Restrict to browser)
4. Add to .env.local

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

### Chat Functionality Enhancements
**New Features:**
- ✅ **Previous Chat History**: Display list of all previous kundli chats in sidebar
- ✅ **New Chat Button**: Quick access to generate new kundlis from chat page
- ✅ **Chat History Loading**: Fixed multi-kundli support with correct folder routing
- ✅ **Message Persistence**: All messages saved immediately with atomic writes
- ✅ **Rolling Summaries**: Automatic context summaries every 10 messages
- ✅ **Facts Extraction**: Astrological facts extracted from AI responses

**Bug Fixes:**
- Fixed divisional charts extraction showing "0 charts" (now correctly shows D2-D60 count)
- Fixed chat history not loading for users with multiple kundlis
- Fixed "New Chat" button redirecting to blank page
- Improved kundli_id lookup using kundli_index instead of just UID

**Architecture Improvements:**
- Multi-kundli support with correct user folder routing
- Atomic file writes with file locking to prevent corruption
- Dual-layer memory (context_summary.json + kundli_facts.json)
- Async background tasks for summary generation and facts extraction

### Data Isolation & Security Fixes
- ✅ UID-based data filtering on all endpoints
- ✅ Permission checks for direct kundli access
- ✅ User folder verification before data access
- ✅ Proper handling of multiple kundlis per user

### Divisional Charts Fix
- Fixed extraction logic to properly count D1-D60 charts
- Charts now correctly fed into chat context
- Proper filtering of metadata keys from chart count
- Detailed logging for debugging chart extraction

---

## Implementation Details (April 2026)

### Chat History System

**Components:**
1. **ChatHistoryManager** (350+ lines)
   - Atomic file operations with `.tmp` + rename pattern
   - File locking with `filelock` library to prevent race conditions
   - Message persistence and retrieval
   - Metadata tracking (total messages, tokens used, last activity)

2. **ContextSummaryGenerator** (200+ lines)
   - Triggers rolling summaries every 10 messages
   - Incremental updates using Gemini API
   - Key topics extraction from conversations
   - Prevents context dilution through smart summarization

3. **KundliFactsExtractor** (250+ lines)
   - Extracts astrological facts from kundli data
   - Parses AI responses for new facts
   - Merges facts without duplicates
   - Stores immutable core facts only

4. **ChatService** (300+ lines)
   - High-level orchestration of chat operations
   - Async task management for background operations
   - Context building from facts + summary + recent messages
   - Conversation lifecycle management

**Storage Structure:**
```
users/{timestamp}-{uid}-{name}/
└── chat/
    └── {kundli_id}/
        ├── messages.json          # All messages (saved immediately)
        ├── context_summary.json   # Rolling summary (updated every 10 msgs)
        ├── kundli_facts.json      # Extracted astrological facts
        └── metadata.json          # Conversation statistics
```

**Message Storage Timeline:**
- **Immediate**: User/assistant messages saved atomically
- **Every 10 messages**: Rolling summary generated asynchronously
- **On assistant response**: Facts extracted asynchronously
- **Persistent**: All data survives page refresh and browser restart

### Divisional Charts Extraction

**Issue Fixed:**
- Previous implementation counted metadata keys as charts
- Extraction logic: `divisional_charts = kundli_data.get('jyotishganit_json', {}).get('divisionalCharts', {})`
- Chart count included `available_charts` and `total_charts` keys

**Solution:**
```python
# Filter out metadata keys
chart_names = [k for k in divisional_charts.keys() 
               if not k.startswith('_') 
               and k not in ['available_charts', 'total_charts']]
extracted_data["divisional_charts"]["available_charts"] = chart_names
extracted_data["divisional_charts"]["total_charts"] = len(chart_names)
```

**Result:**
- Correctly identifies D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60
- Logs show actual chart count (e.g., "Found 15 divisional charts")
- All charts properly fed into chat context for AI analysis

### Multi-Kundli Chat Support

**Problem:**
- Users with multiple kundlis couldn't load chat history for non-first kundlis
- Backend used `get_user_folder(uid)` which returned only first folder

**Solution:**
- Use `kundli_id` to lookup correct folder in `kundli_index.json`
- Extract user folder from `file_path` in metadata
- Verify UID matches current user for security
- Fallback to `get_user_folder()` if lookup fails

**Implementation:**
```python
# Get user folder from kundli_id (most reliable)
kundli_metadata = file_manager.lookup_kundli(kundli_id)
if kundli_metadata and kundli_metadata.get('uid') == current_user['uid']:
    # Extract folder from file_path
    parts = file_path.split(os.sep)
    users_idx = parts.index('users')
    user_folder = parts[users_idx + 1]
```

**Endpoints Updated:**
- `GET /api/chat/history/{kundli_id}` - Load chat history
- `POST /api/chat/save-message` - Save messages
- `GET /api/chat/context/{kundli_id}` - Get context
- `DELETE /api/chat/history/{kundli_id}` - Clear history

### Frontend Chat Improvements

**ChatWithKundliPage Component:**
- Loads user's kundlis on mount
- Displays previous chats in sidebar with dates
- "New Chat" button navigates to `/generate`
- Click previous chat to resume conversation
- Highlights current active chat
- Proper error handling with toast notifications

**Data Flow:**
1. Component mounts → Load user kundlis
2. Build previous chats list from kundlis
3. User clicks chat → Navigate to `/chat/{kundli_id}`
4. Load chat history from backend
5. Display messages with context
6. Send message → Save atomically with file locking

## Previous Updates (April 2026)

### 🔧 FIXED: Google Maps Autocomplete Dropdown Display ✅

**Status:** COMPLETE - Frontend Fix Applied

#### Problem
Google Maps autocomplete dropdown was showing empty buttons even though the backend was returning location data correctly. Users could see results in the browser console but not in the UI.

#### Root Cause
In `frontend/src/components/GooglePlacesAutocomplete.tsx` line 235, the code was rendering `prediction.main_text` which was empty for Google Maps results. The actual location data was in the `prediction.description` field.

Google Maps API returns:
- `description`: Full formatted address (e.g., "Nyaya Marg, Canton, Cantonment, Prayagraj, Uttar Pradesh 211017, India")
- `main_text`: Main part (often empty/undefined)
- `secondary_text`: Additional info

#### Solution Applied
Changed line 235 from:
```tsx
<div className="font-medium text-gray-900">{prediction.main_text}</div>
```

To:
```tsx
<div className="font-medium text-gray-900">{prediction.main_text || prediction.description}</div>
```

This provides a fallback to `description` when `main_text` is empty, displaying the full address from Google Maps.

#### Result
✅ Dropdown now displays full addresses from Google Maps
✅ Both CSV and Google Maps results show properly
✅ Users can see location options and select them
✅ Coordinates populate correctly after selection
✅ Timezone detection works seamlessly

#### Files Modified
- `frontend/src/components/GooglePlacesAutocomplete.tsx` - Line 235 updated with fallback rendering

---

### 🎉 NEW: Dosha Bhanga (Cancellation) Implementation ✅

**Status:** COMPLETE - Backend & Frontend Fully Implemented

#### Overview
Implemented comprehensive Dosha Bhanga (cancellation) detection in both backend rules engine and frontend UI. Users can now see which doshas are cancelled by protective yogas and understand why.

#### Backend Implementation (rules_engine.py)

**Updated Dosha Model:**
- Added `is_present: bool` - Tracks if dosha exists
- Added `is_cancelled: bool` - Tracks if dosha is cancelled (default=False)
- Added `cancellation_reasons: List[str]` - Stores detailed cancellation reasons
- Maintained `detected` field for backward compatibility

**Helper Methods Added (6 new methods):**
- `get_planet_sign()` - Extracts sign from planet object
- `check_aspect_between_planets()` - Checks aspects using pre-calculated data
- `is_benefic_planet()` - Identifies benefic planets (Jupiter, Venus, Mercury, Moon, Sun)
- `get_kendra_planets()` - Gets planets in Kendra houses (1,4,7,10), excluding Sun/Rahu/Ketu

**Specialized Bhanga Check Methods (4 new methods):**
- `check_mangal_dosha_bhanga()` - Mars in own sign (Aries/Scorpio), exaltation (Capricorn), 2nd house, or aspects from Jupiter/Moon
- `check_kemadruma_dosha_bhanga()` - Supporting planets in Kendra houses or Jupiter aspect to Moon
- `check_kaal_sarp_dosha_bhanga()` - Ascendant or benefic planets outside Rahu-Ketu axis
- `check_conjunction_dosha_bhanga()` - Conjunction in ruling planet's own/exalted sign or Jupiter aspect

**Updated All 8 Dosha Detection Methods:**
Each method now performs two-step check:
1. Detect if dosha is present (`is_present`)
2. If present, run bhanga check and populate `cancellation_reasons`
3. Return complete Dosha object with all fields

Doshas updated:
- ✅ Mangal Dosha (Mars affliction)
- ✅ Kaal Sarp Dosha (Rahu-Ketu axis)
- ✅ Pitra Dosha (Ancestral debt)
- ✅ Guru Chandal Dosha (Jupiter-Rahu conjunction)
- ✅ Kemadruma Dosha (Moon without support)
- ✅ Grahan Dosha (Eclipse point affliction)
- ✅ Vish Dosha (Mars-Saturn poison)
- ✅ Gandmool Dosha (Root affliction)

#### Frontend Implementation (DoshDashaAnalysisPage.tsx)

**Updated Dosha Interface:**
```typescript
major_doshas: Array<{
  name: string
  is_present: boolean
  is_cancelled: boolean
  severity: string
  description: string
  cancellation_reasons: string[]
  remedies: string[]
  detected?: boolean  // backward compatibility
}>
```

**Enhanced Color Functions:**
- `getSeverityColor()` - Returns green styling (bg-green-50, text-green-600) when cancelled
- `getSeverityBadgeColor()` - Returns green badge (bg-green-100, text-green-800) when cancelled

**Updated Major Doshas Section:**
- **Transparent Display**: Doshas remain visible even when cancelled (user knows they were checked)
- **Green "Good News" Message**: Prominent green box with CheckCircle icon
- **Bulleted Reasons**: All cancellation reasons displayed in green text
- **Status Badge**: Shows "CANCELLED" instead of severity level
- **Conditional Remedies**: Only displays remedies if dosha is active (not cancelled)

#### Cancellation Rules Implemented

**Mangal Dosha:**
- Mars in own sign (Aries/Scorpio)
- Mars in exaltation (Capricorn)
- Mars in 2nd house
- Mars aspected by Jupiter or Moon

**Kemadruma Dosha:**
- Supporting planets in Kendra houses from Moon (Mars, Mercury, Jupiter, Venus, Saturn only)
- Moon aspected by Jupiter

**Kaal Sarp Dosha:**
- Ascendant outside Rahu-Ketu axis
- Benefic planets (Jupiter, Venus, Mercury) outside axis

**Guru Chandal, Vish, Grahan Doshas:**
- Conjunction in ruling planet's own sign
- Conjunction in exaltation sign
- Strong Jupiter aspect to conjunction

#### Files Modified
- `backend/models.py` - Updated Dosha model with 3 new fields
- `backend/rules_engine.py` - Added 10 new methods (6 helpers + 4 bhanga checks), updated 8 dosha detection methods
- `frontend/src/pages/DoshDashaAnalysisPage.tsx` - Updated interface, color functions, and dosha rendering

#### Key Features
✅ **Vedic Accuracy** - Implements classical Vedic astrology cancellation rules
✅ **Transparent Design** - Cancelled doshas remain visible for transparency
✅ **Clear Messaging** - "Good News" message with green styling and checkmark
✅ **Detailed Explanations** - All cancellation reasons listed
✅ **User-Friendly** - Easy to understand why a dosha is cancelled
✅ **Backward Compatible** - Old `detected` field still supported
✅ **Responsive UI** - Works on all screen sizes

**Commit:** `v32-dosh-cancellation` - "dosh cancellation working as expected"

---

### 🎉 NEW: Kundli Matching Implementation ✅

**Status:** COMPLETE - Backend Fully Implemented & Integrated with Docker

#### Overview
Implemented comprehensive kundli matching system using PyJHora's Ashtakoota (8-fold compatibility) method. Users can now match birth charts of two individuals and get detailed compatibility scores with interpretations.

#### Backend Implementation (kundli_matching_service.py)

**New Service Class: KundliMatchingService**
- Handles complete kundli matching workflow
- Uses PyJHora's Ashtakoota for authentic Vedic calculations
- Generates minimal kundlis for matching (only necessary fields)
- Stores results persistently in user folders

**Key Methods:**
- `generate_kundli_for_matching()` - Generates kundlis using JyotishganitChartAPI
  - Extracts minimal fields: nakshatra, paadham, panchanga, planets
  - Saves to `users/{user_id}/kundli_matching/{person_name}.json`
  - Returns data compatible with PyJHora calculations
  
- `calculate_compatibility()` - Performs Ashtakoota matching
  - Accepts boy and girl birth data
  - Generates kundlis for both individuals
  - Extracts nakshatra/paadham from generated data
  - Feeds into PyJHora Ashtakoota for scoring
  - Returns detailed compatibility results

**Ashtakoota Scoring (8 Compatibility Factors):**
1. **Varna Porutham** (Caste/Varna) - Max 1 point
2. **Vasya Porutham** (Control) - Max 2 points
3. **Tara Porutham** (Stars/Longevity) - Max 3 points
4. **Yoni Porutham** (Nature/Temperament) - Max 4 points
5. **Graha Maitram** (Planetary Friendship) - Max 5 points
6. **Gana Porutham** (Temperament Groups) - Max 6 points
7. **Bhakoot Porutham** (Emotional Compatibility) - Max 7 points
8. **Nadi Porutham** (Health/Progeny) - Max 8 points

**Total Score:** 36 points (North Indian method)

#### API Endpoint

**POST /api/kundli-matching/calculate**

Request:
```json
{
  "boy_name": "John",
  "boy_dob": "1990-06-15",
  "boy_tob": "10:30",
  "boy_place": "Chennai",
  "boy_latitude": 13.0827,
  "boy_longitude": 80.2707,
  "boy_timezone": 5.5,
  "girl_name": "Jane",
  "girl_dob": "1992-08-20",
  "girl_tob": "14:45",
  "girl_place": "Delhi",
  "girl_latitude": 28.7041,
  "girl_longitude": 77.1025,
  "girl_timezone": 5.5
}
```

Response:
```json
{
  "match_id": "unique-id",
  "boy_name": "John",
  "girl_name": "Jane",
  "total_score": 28,
  "max_score": 36,
  "percentage": 77.78,
  "interpretation": "Good match with strong compatibility",
  "compatibility_factors": [
    {
      "name": "Varna Porutham",
      "score": 1,
      "max_score": 1,
      "status": "Compatible"
    },
    ...
  ]
}
```

#### Data Flow

```
Frontend (boy_data, girl_data)
    ↓
/api/kundli-matching/calculate
    ↓
create_user_folder() → users/{user_id}/
    ↓
generate_kundli_for_matching(boy_data) → boy.json
generate_kundli_for_matching(girl_data) → girl.json
    ↓
Extract nakshatra/paadham from both
    ↓
PyJHora Ashtakoota.compatibility_score()
    ↓
format_results_for_display()
    ↓
Save to results.json
    ↓
Return KundliMatchingResponse to Frontend
```

#### Folder Structure

```
users/{user_id}/
├── kundli/
├── analysis/
├── kundli_matching/
│   ├── boy_name.json
│   ├── girl_name.json
│   └── results.json
└── user_info.json
```

#### Docker Integration

**Fixed:** PyJHora module missing in Docker container
- Added `COPY PyJHora/ ./PyJHora/` to Dockerfile
- Backend can now import `from jhora.horoscope.match.compatibility import Ashtakoota`
- Kundli matching works seamlessly in Docker deployment

#### Key Features
✅ **Vedic Accuracy** - Uses authentic PyJHora Ashtakoota calculations
✅ **Minimal Kundlis** - Only generates necessary data for matching
✅ **Persistent Storage** - Results saved in user's folder
✅ **Docker Compatible** - Works in containerized deployment
✅ **Comprehensive Results** - 8-factor compatibility with interpretations
✅ **User Isolation** - Each user's matches stored separately
✅ **Scalable** - Efficient calculation and storage

**Commit:** `v34-matching` - "kundli matching working"

---

### Critical Fixes & Improvements (Past 7 Days)

#### 1. **Data Isolation & Security Fix** ✅
**Problem:** Users logged in with different emails could see all kundlis generated by any user.

**Solution Implemented:**
- Added `uid` parameter to `FileManager.add_to_index()` to track user's Firebase UID
- Updated 4 endpoints with UID filtering:
  - `/api/calculations/history` - Filters by `metadata.uid == current_user.uid`
  - `/api/user/calculations` - Filters by `metadata.uid == current_user.uid`
  - `/api/kundlis/list` - Filters by `metadata.uid == current_user.uid`
  - `/api/kundli/{kundli_id}` - Added 403 FORBIDDEN check for unauthorized access
- Each user now only sees their own kundlis
- Direct URL access to other users' kundlis is blocked

**Files Modified:** `backend/file_manager.py`, `backend/main.py`

---

#### 2. **Singleton State Isolation Fix** ✅
**Problem:** Duplicate kundlis were generated with identical data. The `AstrologyService` was using a singleton pattern, causing the underlying `JyotishganitChartAPI` library to maintain state between requests.

**Solution Implemented:**
- Changed `AstrologyService` to create **fresh API instances for each request**
- Added `_get_fresh_api()` method that instantiates new `JyotishganitChartAPI()` per call
- Updated all 6 methods to use fresh instances:
  - `generate_kundli()`
  - `generate_charts()`
  - `get_planet_position()`
  - `get_planets_in_house()`
  - `format_kundli_text()`
  - `format_chart_text()`
- Prevents state leakage between concurrent requests
- Each kundli now generates unique, correct data

**Files Modified:** `backend/astrology_service.py`

---

#### 3. **Analysis Detection Fix** ✅
**Problem:** "With Analysis" card on dashboard showed 0 even though 1 analysis existed. The `has_analysis` field was hardcoded to `False`.

**Solution Implemented:**
- Added `has_analysis()` method to `FileManager`:
  ```python
  def has_analysis(self, folder_path: str, user_name: str) -> bool:
      """Check if analysis exists for a kundli"""
      analysis_file = os.path.join(folder_path, "analysis", f"{user_name}_AI_Analysis.txt")
      return os.path.exists(analysis_file)
  ```
- Updated 2 endpoints to check for actual analysis files:
  - `/api/calculations/history` (lines 995-998)
  - `/api/user/calculations` (lines 1084-1087)
- Dashboard now displays accurate analysis count

**Files Modified:** `backend/file_manager.py`, `backend/main.py`

---

#### 4. **Data Storage Migration** ✅
**Problem:** Dashboard and Kundli pages weren't showing generated data. Frontend was trying to fetch from Firebase which wasn't being used for data storage.

**Solution Implemented:**
- **Backend:** Replaced Firebase calls with local file system queries
  - `/api/calculations/history` - Reads from `kundli_index.json`
  - `/api/user/calculations` - Reads from `kundli_index.json`
  - `/api/kundlis/list` - Reads from local index and loads kundli files
  - `/api/dashboard/insights` - Wrapped Firebase call in try-catch

- **Frontend:** Implemented dual-fetch strategy with localStorage fallback
  - `KundliCompletionPage.tsx` - Stores kundli data in localStorage after generation
  - `ResultsPage.tsx` - Stores kundli data in localStorage after fetching
  - `DashboardPage.tsx` - Tries backend API first, falls back to localStorage
  - `api.ts` - Changed error logging for missing token from error to warning

**Files Modified:** `backend/main.py`, `frontend/src/services/api.ts`, `frontend/src/pages/KundliCompletionPage.tsx`, `frontend/src/pages/ResultsPage.tsx`, `frontend/src/pages/DashboardPage.tsx`

---

#### 5. **View Results Button Implementation** ✅
**Problem:** Users couldn't easily navigate to view results for generated kundlis.

**Solution Implemented:**
- Added "View Results" button to `KundliCompletionPage`
- Button navigates to `/results/:kundliId` with proper session management
- Supports multiple kundlis in one session (each has unique kundli_id)
- Button order: Download → View Results → Chat with AI
- Emerald-to-teal gradient styling with Eye icon

**Files Modified:** `frontend/src/pages/KundliCompletionPage.tsx`

---

#### 6. **Dashboard Redesign**

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

### Summary of Changes

| Issue | Root Cause | Fix | Impact |
|-------|-----------|-----|--------|
| Data Isolation | No UID tracking | Added UID filtering to 4 endpoints | Users can only see their own data |
| Duplicate Kundlis | Singleton state | Fresh API instances per request | Each kundli generates unique data |
| Analysis Count Wrong | Hardcoded has_analysis | Check actual analysis files | Dashboard shows correct count |
| Missing Data Display | Firebase vs Local FS | Dual-fetch with localStorage | Data displays correctly |
| No Results Navigation | Missing button | Added View Results button | Easy access to results |

---

## 🌟 Dosha & Dasha Analysis Feature (NEW - April 2026)

### Overview

The **Dosha & Dasha Analysis** page provides comprehensive astrological analysis of afflictions (doshas), their cancellations (bhanga), and current planetary periods (dashas). This feature combines Vedic astrology principles with modern UI to help users understand their astrological challenges and timelines.

**Access:** Navigate to `/dosh-dasha-analysis` or click "Dosha Analysis" in the sidebar menu.

### How It Works

#### 1. **Data Flow**

```
User selects Kundli
    ↓
Frontend requests analysis via POST /api/analysis/{kundli_id}
    ↓
Backend loads kundli data + all D-charts (D1, D9, D6, D8, D30, D60)
    ↓
RulesEngine detects 8 major doshas + avasthas + afflictions
    ↓
TimelineEngine calculates current dasha periods + negative periods
    ↓
Response includes complete analysis with cancellation reasons
    ↓
Frontend displays results with color-coded severity + interactive sections
```

#### 2. **Backend Architecture**

**Three Core Modules:**

##### A. **RulesEngine** (`backend/rules_engine.py` - 850+ lines)

Detects astrological afflictions using strict Vedic rules:

**8 Major Doshas Detected:**
1. **Mangal Dosha** - Mars affliction in marriage houses
   - Checks: Mars in houses 1, 4, 7, 8, 12
   - Severity: Severe (7th house), Moderate (other houses)
   - Method: `detect_mangal_dosha()`

2. **Kaal Sarp Dosha** - Rahu-Ketu axis affliction
   - Checks: All planets between Rahu and Ketu
   - Severity: Severe
   - Method: `detect_kaal_sarp_dosha()`

3. **Pitra Dosha** - Ancestral debt
   - Checks: Sun/Saturn/Rahu in 8th/9th/12th houses
   - Severity: Moderate to Severe
   - Method: `detect_pitra_dosha()`

4. **Guru Chandal Dosha** - Jupiter-Rahu conjunction
   - Checks: Jupiter and Rahu in same house
   - Severity: Moderate
   - Method: `detect_guru_chandal_dosha()`

5. **Kemadruma Dosha** - Moon without support
   - Checks: Moon lacks planets in 2nd/12th houses
   - Severity: Moderate
   - Method: `detect_kemadruma_dosha()`

6. **Grahan Dosha** - Eclipse point affliction
   - Checks: Sun/Moon conjunct with Rahu/Ketu
   - Severity: Moderate to Severe
   - Method: `detect_grahan_dosha()`

7. **Vish Dosha** - Poison combination
   - Checks: Mars and Saturn conjunction
   - Severity: Moderate
   - Method: `detect_vish_dosha()`

8. **Gandmool Dosha** - Root affliction
   - Checks: Moon in specific nakshatras (Ashwini, Aslesha, Magha, Jyeshtha, Moola, Revati)
   - Severity: Moderate
   - Method: `detect_gandmool_dosha()`

**Planetary Avasthas Detected:**
- **Neecha** (Debilitation): Planet in debilitation sign
- **Asta** (Combustion): Planet within 8° of Sun
- **Retrograde**: Retrograde malefics detection
- Method: `detect_planetary_avasthas()`

**Dusthana Afflictions Detected:**
- **6th House** (Enemies, Debts, Health)
- **8th House** (Longevity, Sudden Events)
- **12th House** (Losses, Foreign Lands)
- Method: `detect_dusthana_afflictions()`

**D-Chart Afflictions Detected:**
- **D9 (Navamsha)**: Marriage/partnership debilitations
- **D6 (Shashtamsha)**: Health afflictions
- **D8 (Ashtamsha)**: Longevity concerns
- **D30 (Trimshamsha)**: Misfortune indicators
- **D60 (Shashtiamsha)**: Past-life Shrapas (Matru, Pitru, Brahma, Stri)
- Method: `detect_d_chart_afflictions()`

**Key Methods:**
```python
detect_mangal_dosha()              # Mars affliction detection
detect_kaal_sarp_dosha()           # Rahu-Ketu axis check
detect_pitra_dosha()               # Ancestral debt check
detect_guru_chandal_dosha()        # Jupiter-Rahu conjunction
detect_kemadruma_dosha()           # Moon support check
detect_grahan_dosha()              # Eclipse point affliction
detect_vish_dosha()                # Mars-Saturn poison
detect_gandmool_dosha()            # Moon nakshatra check
detect_planetary_avasthas()        # Planetary states
detect_dusthana_afflictions()      # 6th/8th/12th house check
detect_d_chart_afflictions()       # D-chart specific checks
```

##### B. **Dosha Bhanga (Cancellation)** - NEW Feature

**4 Specialized Bhanga Check Methods:**

1. **`check_mangal_dosha_bhanga()`**
   - Mars in own sign (Aries/Scorpio)
   - Mars in exaltation (Capricorn)
   - Mars in 2nd house
   - Mars aspected by Jupiter or Moon

2. **`check_kemadruma_dosha_bhanga()`**
   - Supporting planets in Kendra houses (1,4,7,10)
   - Excludes Sun, Rahu, Ketu (only Mars, Mercury, Jupiter, Venus, Saturn count)
   - Moon aspected by Jupiter

3. **`check_kaal_sarp_dosha_bhanga()`**
   - Ascendant outside Rahu-Ketu axis
   - Benefic planets (Jupiter, Venus, Mercury) outside axis

4. **`check_conjunction_dosha_bhanga()`**
   - Conjunction in ruling planet's own sign
   - Conjunction in exaltation sign
   - Strong Jupiter aspects the conjunction

**Helper Methods (6 new):**
- `get_planet_sign()` - Extract sign from planet object
- `check_aspect_between_planets()` - Check aspects using pre-calculated data
- `is_benefic_planet()` - Identify benefic planets
- `get_kendra_planets()` - Get planets in Kendra houses

**How It Works:**
1. Detect if dosha is present (`is_present`)
2. If present, run bhanga check
3. Populate `cancellation_reasons` array with detailed explanations
4. Return Dosha object with `is_cancelled` flag

##### C. **TimelineEngine** (`backend/timeline.py` - 350+ lines)

Calculates current dasha periods and negative timelines:

**Current Dasha Calculation:**
- Parses Dasha data from Kundli JSON
- Finds current Mahadasha (main period)
- Finds current Antardasha (sub-period)
- Finds current Pratyantardasha (sub-sub-period)
- Calculates progress percentage and days remaining
- Method: `get_active_dashas()`

**Negative Period Detection:**
1. **Sade Sati** - Saturn's 7.5-year transit (requires transit data)
2. **Maraka Dashas** - Lords of 2nd/7th houses (death-inflicting)
3. **Badhaka Dashas** - 11th house lord periods (obstruction)
4. **Rahu/Ketu Mahadashas** - Shadow planet periods
- Method: `get_negative_periods()`

**Helper Methods:**
- `parse_dasha_date()` - Parse YYYY-MM-DD format
- `calculate_days_remaining()` - Days until period ends
- `calculate_progress_percent()` - Percentage of period completed
- `calculate_duration_years()` - Duration in years
- `format_countdown()` - Human-readable countdown (e.g., "8 Months, 12 Days")
- `determine_severity()` - Severity based on period type

**Key Methods:**
```python
get_current_pratyantardasha()       # Extract current Pratyantardasha
get_house_lord_from_horoscope()    # Extract house lordship
check_maraka_dasha()               # Detect Maraka periods
check_dusthana_dasha()             # Detect Dusthana periods
check_rahu_ketu_dasha()            # Detect Rahu/Ketu Mahadashas
get_dasha_alerts()                 # Compile all alert flags
get_active_dashas()                # Main method returning all data
```

#### 3. **API Endpoint**

**Endpoint:** `POST /api/analysis/{kundli_id}`

**Request:**
```
Authorization: Bearer {firebase_token}
```

**Response:**
```json
{
  "kundli_id": "string",
  "analysis_date": "2026-04-17T10:44:00Z",
  "birth_data": { ... },
  "major_doshas": [
    {
      "name": "Mangal Dosha",
      "is_present": true,
      "is_cancelled": false,
      "severity": "moderate",
      "description": "Mars in 7th house...",
      "cancellation_reasons": [],
      "remedies": ["Recite Hanuman Chalisa...", ...]
    },
    ...
  ],
  "planetary_avasthas": [ ... ],
  "dusthana_afflictions": [ ... ],
  "d_chart_afflictions": [ ... ],
  "active_dashas": {
    "current_mahadasha": {
      "planet": "Jupiter",
      "start_date": "2024-01-15",
      "end_date": "2027-03-20",
      "progress_percent": 45.2,
      "days_remaining": 520
    },
    "current_antardasha": { ... },
    "current_pratyantardasha": { ... },
    "dasha_alerts": {
      "is_maraka_dasha": false,
      "is_dusthana_dasha": true,
      "is_rahu_ketu_dasha": false,
      "alert_description": "Dusthana Dasha..."
    }
  },
  "negative_periods": [ ... ],
  "summary": {
    "total_doshas": 3,
    "severe_doshas": 1,
    "moderate_doshas": 2,
    "mild_doshas": 0,
    "active_alerts": 2
  }
}
```

### Frontend Implementation

#### 1. **DoshDashaAnalysisPage Component** (`frontend/src/pages/DoshDashaAnalysisPage.tsx`)

**Features:**

**Kundli Selector Dropdown:**
- Fetches user's kundlis on mount
- Displays kundli name and birth date
- Auto-selects first kundli
- Updates analysis when selection changes

**Summary Cards (4 KPIs):**
- Total Doshas Count
- Severe Doshas Count
- Moderate Doshas Count
- Mild Doshas Count

**Active Alerts Section:**
- Displays active negative periods count
- Red alert styling for visibility

**Current Planetary Periods Section:**
- **Mahadasha Card**: Main period with progress bar
- **Antardasha Card**: Sub-period with progress bar
- **Pratyantardasha Card**: Sub-sub-period with progress bar
- Each shows: planet name, date range, progress %, countdown

**Dasha Alerts Section:**
- Color-coded based on alert type (red/orange/green)
- Main alert description with icon
- Detailed explanations for each alert type:
  - Maraka: Health/travel caution
  - Dusthana: Finance/health/obstacles caution
  - Rahu/Ketu: Illusions/changes/spiritual focus
  - Neutral: Supportive period message

**Major Doshas Section:**
- All 8 doshas with severity badges
- Detailed descriptions
- Remedies list (first 3 shown)
- Color-coded by severity (red/orange/yellow)
- **NEW:** Green "Good News" message when cancelled
- **NEW:** Cancellation reasons listed in bulleted format

**Negative Periods Section:**
- Lists all active negative periods
- Type, end date, days remaining
- Severity badges
- Detailed descriptions

**Collapsible Sections:**
- Expandable/collapsible sections for better UX
- Toggle headers to show/hide content
- Smooth transitions with chevron icons

#### 2. **Color Coding**

**Severity Levels:**
- **Severe**: Red (bg-red-50, text-red-600)
- **Moderate**: Orange (bg-orange-50, text-orange-600)
- **Mild**: Yellow (bg-yellow-50, text-yellow-600)
- **Cancelled**: Green (bg-green-50, text-green-600) ✨ NEW

**Dasha Alerts:**
- **Maraka**: Red (danger)
- **Dusthana**: Orange (warning)
- **Rahu/Ketu**: Orange (warning)
- **Neutral**: Green (safe)

#### 3. **Helper Functions**

```typescript
formatDateRange(startDate, endDate)    // "Oct 2024 - Mar 2027"
formatCountdown(daysRemaining)         // "8 Months, 12 Days"
getSeverityColor(severity, isCancelled) // Returns color classes
getSeverityBadgeColor(severity)        // Returns badge color
getAlertColor(alertType)               // Returns alert color
getAlertIcon(alertType)                // Returns appropriate icon
```

#### 4. **Navigation Integration**

**Sidebar Menu Item:**
- Added "Dosha Analysis" menu item in `frontend/src/components/Sidebar.tsx`
- Uses `AlertCircle` icon from lucide-react
- Positioned between Analysis and Chat
- Responsive to sidebar collapse/expand

**Route Configuration:**
- Protected route at `/dosh-dasha-analysis`
- Wrapped in Layout component
- Requires authentication

### Files & Methods Summary

#### Backend Files

| File | Lines | Key Methods | Purpose |
|------|-------|-------------|---------|
| `backend/rules_engine.py` | 850+ | 8 dosha detection + 4 bhanga checks + 6 helpers | Detects all doshas and cancellations |
| `backend/timeline.py` | 350+ | 7 dasha calculation + 6 helpers | Calculates dasha periods and negative timelines |
| `backend/models.py` | Updated | 8 new Pydantic models | Data structures for analysis response |
| `backend/main.py` | Updated | `POST /api/analysis/{kundli_id}` | API endpoint for analysis |

#### Frontend Files

| File | Lines | Key Components | Purpose |
|------|-------|-----------------|---------|
| `frontend/src/pages/DoshDashaAnalysisPage.tsx` | 500+ | Kundli selector, summary cards, dosha sections | Main analysis page |
| `frontend/src/components/Sidebar.tsx` | Updated | Navigation menu item | Access to analysis page |
| `frontend/src/App.tsx` | Updated | Protected route | Route configuration |
| `frontend/src/services/api.ts` | Updated | `analyzeDoshaAndDasha()` | API integration |

### Key Features

✅ **8 Major Doshas** - Comprehensive affliction detection
✅ **Dosha Bhanga** - Automatic cancellation detection with reasons
✅ **Planetary Avasthas** - Neecha, Asta, Retrograde detection
✅ **Dusthana Afflictions** - 6th/8th/12th house analysis
✅ **D-Chart Analysis** - D9, D6, D8, D30, D60 afflictions
✅ **Current Dashas** - Mahadasha, Antardasha, Pratyantardasha
✅ **Negative Periods** - Maraka, Badhaka, Rahu/Ketu detection
✅ **Progress Tracking** - Visual progress bars with countdowns
✅ **Severity Indicators** - Color-coded severity levels
✅ **Cancellation Reasons** - Detailed explanations for cancelled doshas
✅ **Error Handling** - Graceful error messages
✅ **Responsive Design** - Works on all screen sizes
✅ **Type Safety** - Full TypeScript support

### Testing the Feature

1. **Navigate to Analysis Page:**
   ```
   http://localhost:5173/dosh-dasha-analysis
   ```

2. **Select a Kundli:**
   - Click dropdown to see available kundlis
   - Select one to load analysis

3. **View Analysis Results:**
   - Summary cards show dosha counts
   - Current dasha section shows active periods
   - Major doshas section shows all 8 doshas
   - Negative periods section shows active timelines

4. **Check Cancellations:**
   - Look for green "Good News" messages
   - Read cancellation reasons
   - Verify remedies are hidden for cancelled doshas

### Performance Considerations

- Analysis computed on-demand (not cached)
- D-charts loaded from filesystem
- No external API calls (except Firebase auth)
- Response time: ~1-2 seconds per analysis
- Suitable for real-time use

### Future Enhancements

- Gantt chart for dasha timeline visualization
- Remedy recommendations section with detailed upayas
- Export analysis as PDF
- Share analysis with astrologer
- Historical analysis comparison
- Remedies progress tracking
- Notifications for period changes
- Sade Sati transit calculations
- Advanced dasha predictions

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
- ✅ **NEW:** Dosha Bhanga (Cancellation) Detection with detailed reasons

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
