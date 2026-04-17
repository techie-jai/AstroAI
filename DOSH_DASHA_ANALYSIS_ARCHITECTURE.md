# Dosh-Dasha Analysis Module - Architecture & JSON Payload

## Overview

The Dosh-Dasha Analysis module provides comprehensive astrological analysis of Kundli data to identify doshas (afflictions), planetary avasthas (states), and timeline analysis of Dasha periods.

**Route**: `/dosh-dasha-analysis`

---

## Backend Architecture

### Module Structure

```
backend/
├── models.py                 # Data models (Dosha, Avastha, etc.)
├── rules_engine.py          # Dosha detection algorithms
├── timeline.py              # Dasha timeline analysis
└── main.py                  # API endpoint integration
```

### Key Classes

#### 1. RulesEngine (rules_engine.py)

Implements strict Vedic astrology algorithms for detecting:

**Major Doshas (8 total)**
- `detect_mangal_dosha()` - Mars affliction in marriage
- `detect_kaal_sarp_dosha()` - Rahu-Ketu axis affliction
- `detect_pitra_dosha()` - Ancestral debt
- `detect_guru_chandal_dosha()` - Jupiter-Rahu conjunction
- `detect_kemadruma_dosha()` - Moon without planetary support
- `detect_grahan_dosha()` - Eclipse point affliction
- `detect_vish_dosha()` - Poison combination
- `detect_gandmool_dosha()` - Root affliction

**Planetary Avasthas**
- `detect_planetary_avasthas()` - Neecha, Asta, Yuddha, Retrograde

**Dusthana Afflictions**
- `detect_dusthana_afflictions()` - Planets in 6th, 8th, 12th houses

**D-Chart Afflictions**
- `detect_d_chart_afflictions()` - D9, D6, D8, D30, D60 specific conditions
- `detect_d60_shrapas()` - Past-life curses (Matru, Pitru, Brahma, Stri)

#### 2. TimelineEngine (timeline.py)

Analyzes Dasha periods and transits:

**Current Periods**
- `get_current_dasha()` - Current Mahadasha and Antardasha
- `calculate_progress_percent()` - Percentage of period completed
- `calculate_days_remaining()` - Days until period ends

**Negative Periods**
- `get_active_negative_periods()` - All active challenging periods
- `calculate_sade_sati()` - Saturn's 7.5-year transit
- `calculate_maraka_dashas()` - Lords of 2nd/7th houses
- `calculate_badhaka_dashas()` - 11th house lord periods
- `calculate_rahu_ketu_mahadashas()` - Shadow planet periods

---

## API Endpoint

### POST /api/analysis/{kundli_id}

**Purpose**: Perform complete dosha and timeline analysis on a kundli

**Request**:
```
POST /api/analysis/Divya-Gupta-Kundli-1-f8a58e79
Authorization: Bearer {firebase_token}
```

**Response**: `DoshaAnalysisResponse` (see JSON Payload below)

**Error Handling**:
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (user doesn't own this kundli)
- 404: Not Found (kundli doesn't exist)
- 500: Server error during analysis

---

## JSON Payload Structure

### Complete Analysis Response

```json
{
  "kundli_id": "Divya-Gupta-Kundli-1-f8a58e79",
  "analysis_date": "2026-04-14T21:12:00Z",
  
  "birth_data": {
    "name": "Divya Gupta",
    "place_name": "Hyderabad",
    "latitude": 17.385,
    "longitude": 78.4867,
    "timezone_offset": 5.5,
    "year": 1981,
    "month": 10,
    "day": 11,
    "hour": 6,
    "minute": 12,
    "second": 0
  },

  "doshas": {
    "major_doshas": [
      {
        "name": "Mangal Dosha",
        "detected": true,
        "severity": "moderate",
        "description": "Mars is placed in the 7th house, indicating challenges in marriage and partnerships. However, the dosha is partially cancelled due to Mars' placement in its own sign.",
        "remedies": [
          "Perform Mangal Puja on Tuesdays",
          "Wear red coral (Moonga) gemstone",
          "Chant Mangal Mantra: 'Om Angarakaya Namah'",
          "Donate red items on Tuesdays",
          "Fast on Tuesdays"
        ]
      },
      {
        "name": "Kaal Sarp Dosha",
        "detected": false,
        "severity": "mild",
        "description": "Not present in this chart.",
        "remedies": []
      },
      {
        "name": "Pitra Dosha",
        "detected": false,
        "severity": "mild",
        "description": "Not present in this chart.",
        "remedies": []
      },
      {
        "name": "Guru Chandal Dosha",
        "detected": false,
        "severity": "mild",
        "description": "Not present in this chart.",
        "remedies": []
      },
      {
        "name": "Kemadruma Dosha",
        "detected": false,
        "severity": "mild",
        "description": "Not present in this chart.",
        "remedies": []
      },
      {
        "name": "Grahan Dosha",
        "detected": false,
        "severity": "mild",
        "description": "Not present in this chart.",
        "remedies": []
      },
      {
        "name": "Vish Dosha",
        "detected": false,
        "severity": "mild",
        "description": "Not present in this chart.",
        "remedies": []
      },
      {
        "name": "Gandmool Dosha",
        "detected": false,
        "severity": "mild",
        "description": "Not present in this chart.",
        "remedies": []
      }
    ],

    "planetary_avasthas": [
      {
        "planet": "Saturn",
        "avastha_type": "neecha",
        "severity": "moderate",
        "description": "Saturn is debilitated in Aries, indicating weakness in discipline and responsibility. However, the debilitation is cancelled due to Saturn's placement in a friendly sign."
      },
      {
        "planet": "Mars",
        "avastha_type": "retrograde",
        "severity": "mild",
        "description": "Mars is retrograde, indicating introspection in matters of action and courage."
      }
    ],

    "dusthana_afflictions": [
      {
        "house": 8,
        "planets": ["Sun", "Mercury"],
        "severity": "moderate",
        "description": "Sun and Mercury in the 8th house indicate challenges in inheritance, longevity concerns, and occult interests. The 8th house is a dusthana (inauspicious house)."
      },
      {
        "house": 12,
        "planets": ["Venus"],
        "severity": "mild",
        "description": "Venus in the 12th house indicates expenses in matters of relationships and comfort. However, Venus in 12th can also indicate spiritual inclinations."
      }
    ],

    "d_chart_afflictions": [
      {
        "chart_type": "D9",
        "affliction_type": "debilitation",
        "severity": "moderate",
        "description": "In the D9 (Navamsha) chart, Jupiter is debilitated, indicating challenges in marriage and partnership matters.",
        "planets": ["Jupiter"]
      },
      {
        "chart_type": "D60",
        "affliction_type": "matru_shrapa",
        "severity": "severe",
        "description": "Mother's curse (Matru Shrapa) is indicated in the D60 chart. This requires specific remedial measures.",
        "planets": ["Moon"]
      }
    ]
  },

  "active_timelines": {
    "current_mahadasha": {
      "planet": "Venus",
      "start_date": "2004-11-29",
      "end_date": "2024-11-29",
      "duration_years": 20.0,
      "progress_percent": 95.2,
      "days_remaining": 227
    },

    "current_antardasha": {
      "planet": "Mercury",
      "start_date": "2020-11-29",
      "end_date": "2023-09-30",
      "duration_years": 2.83,
      "progress_percent": 100.0,
      "days_remaining": 0
    },

    "negative_periods": [
      {
        "type": "sade_sati",
        "start_date": "2025-01-15",
        "end_date": "2032-06-20",
        "days_remaining": 2987,
        "severity": "severe",
        "description": "Saturn's 7.5-year transit over natal Moon (Sade Sati) begins soon. This is a challenging period requiring careful navigation. The ascending phase (Saturn in 12th from Moon) will last approximately 2.5 years."
      },
      {
        "type": "maraka",
        "start_date": "2026-12-18",
        "end_date": "2027-10-06",
        "days_remaining": 555,
        "severity": "moderate",
        "description": "Jupiter Mahadasha (lord of 7th house) is a Maraka period. This period requires attention to health and relationships."
      }
    ]
  },

  "summary": {
    "total_doshas": 8,
    "severe_count": 0,
    "moderate_count": 1,
    "mild_count": 7,
    "active_negative_periods": 2
  }
}
```

---

## Data Model Definitions

### Dosha
```python
{
  "name": str,              # Dosha name
  "detected": bool,         # Whether present
  "severity": str,          # "severe" | "moderate" | "mild"
  "description": str,       # Detailed explanation
  "remedies": List[str]     # Suggested Upayas (remedies)
}
```

### Avastha
```python
{
  "planet": str,            # Planet name
  "avastha_type": str,      # "neecha" | "asta" | "yuddha" | "retrograde"
  "severity": str,          # "severe" | "moderate" | "mild"
  "description": str        # Explanation
}
```

### DusthanaAffliction
```python
{
  "house": int,             # 6, 8, or 12
  "planets": List[str],     # Planets in this house
  "severity": str,          # "severe" | "moderate" | "mild"
  "description": str        # Explanation
}
```

### DChartAffliction
```python
{
  "chart_type": str,        # "D9" | "D6" | "D8" | "D30" | "D60"
  "affliction_type": str,   # Type of affliction
  "severity": str,          # "severe" | "moderate" | "mild"
  "description": str,       # Explanation
  "planets": List[str]      # Affected planets
}
```

### CurrentDasha
```python
{
  "planet": str,            # Planet ruling dasha
  "start_date": str,        # "YYYY-MM-DD"
  "end_date": str,          # "YYYY-MM-DD"
  "duration_years": float,  # Total duration
  "progress_percent": float,# 0-100
  "days_remaining": int     # Days until end
}
```

### NegativePeriod
```python
{
  "type": str,              # "sade_sati" | "maraka" | "badhaka" | "rahu_mahadasha" | "ketu_mahadasha"
  "start_date": str,        # "YYYY-MM-DD"
  "end_date": str,          # "YYYY-MM-DD"
  "days_remaining": int,    # Days until end
  "severity": str,          # "severe" | "moderate" | "mild"
  "description": str        # Explanation
}
```

### DoshaAnalysisSummary
```python
{
  "total_doshas": int,              # Total doshas detected
  "severe_count": int,              # Count of severe
  "moderate_count": int,            # Count of moderate
  "mild_count": int,                # Count of mild
  "active_negative_periods": int    # Number of active negative periods
}
```

---

## Frontend Integration

### Page Route
- **Path**: `/dosh-dasha-analysis`
- **Component**: `DoshDashaAnalysisPage.tsx`
- **Protected**: Yes (requires authentication)

### State Management
```typescript
interface DoshDashaAnalysisState {
  selectedKundliId: string | null
  kundlis: Array<{id: string, name: string, birthDate: string}>
  analysisData: DoshaAnalysisResponse | null
  loading: boolean
  error: string | null
}
```

### API Integration
```typescript
// Fetch user's kundlis
GET /api/kundlis/list

// Fetch analysis for selected kundli
POST /api/analysis/{kundli_id}
```

---

## Implementation Checklist

### Backend
- [ ] Implement `RulesEngine.detect_mangal_dosha()` with strict Vedic rules
- [ ] Implement all 8 major dosha detection methods
- [ ] Implement `detect_planetary_avasthas()` (Neecha, Asta, Yuddha, Retrograde)
- [ ] Implement `detect_dusthana_afflictions()` (6th, 8th, 12th houses)
- [ ] Implement `detect_d_chart_afflictions()` (D9, D6, D8, D30)
- [ ] Implement `detect_d60_shrapas()` (Past-life curses)
- [ ] Implement `TimelineEngine.get_current_dasha()` (parse dasha JSON)
- [ ] Implement `get_active_negative_periods()` (Sade Sati, Maraka, etc.)
- [ ] Create `/api/analysis/{kundli_id}` endpoint in main.py
- [ ] Add authentication and permission checks

### Frontend
- [ ] Create `DoshDashaAnalysisPage.tsx` component
- [ ] Create Kundli selector dropdown
- [ ] Create Active Alerts dashboard
- [ ] Create Dasha timeline Gantt chart
- [ ] Create Dosha report table with expandable rows
- [ ] Implement dynamic data loading on kundli change
- [ ] Add error handling and loading states
- [ ] Add responsive design for mobile

### Testing
- [ ] Unit tests for dosha detection algorithms
- [ ] Integration tests for timeline calculations
- [ ] API endpoint tests
- [ ] Frontend component tests
- [ ] End-to-end tests with sample kundlis

---

## Notes

- All dates are in ISO 8601 format (YYYY-MM-DD)
- Severity levels: "severe" (70-100), "moderate" (40-69), "mild" (0-39)
- Dasha data is parsed from existing Kundli JSON structure
- D-charts are loaded from filesystem (D1, D9, D6, D8, D30, D60)
- User authentication required for all endpoints
- Analysis results can be cached for performance optimization
