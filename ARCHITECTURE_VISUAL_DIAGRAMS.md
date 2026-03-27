# PyJHora Architecture - Visual Diagrams

## 1. System Component Interaction Diagram

```mermaid
graph TB
    subgraph UI["UI Layer (PyQt6)"]
        CT["ChartTabbed<br/>(Main Widget)"]
        IF["Input Form<br/>(Name, DOB, TOB, Place)"]
        TW["Tab Widget<br/>(40+ Tabs)"]
        CS["Chart Styles<br/>(Rendering)"]
        CW["Chakra Widgets<br/>(Visualization)"]
    end

    subgraph CALC["Calculation Engine"]
        HM["Horoscope<br/>(main.py)"]
        CH["Chart Calculations<br/>(charts.py)"]
        HO["House/Aspects<br/>(house.py)"]
        ST["Strength<br/>(strength.py)"]
        YG["Yogas<br/>(yoga.py)"]
        DS["Doshas<br/>(dosha.py)"]
        AR["Arudhas<br/>(arudhas.py)"]
        AV["Ashtaka Varga<br/>(ashtakavarga.py)"]
    end

    subgraph DHASA["Dhasa/Bhukthi Engine"]
        GD["Graha Dhasa<br/>(20+ systems)"]
        RD["Rasi Dhasa<br/>(16+ systems)"]
        AD["Annual Dhasa<br/>(3 systems)"]
        SC["Sudarshana Chakra<br/>(Chakra Dhasa)"]
    end

    subgraph PANCHANGA["Panchanga Module"]
        DR["Drik Calculations<br/>(drik.py)"]
        EPH["Ephemeris Data<br/>(Swiss Ephemeris)"]
        VR["Vratha Finder<br/>(vratha.py)"]
    end

    subgraph DATA["Data & Config"]
        CONST["Constants<br/>(const.py)"]
        UTIL["Utilities<br/>(utils.py)"]
        LANG["Language Files<br/>(lang/)"]
        CITY["World Cities DB<br/>(data/)"]
    end

    CT -->|User Input| IF
    IF -->|Validated Data| HM
    HM -->|Uses| CH
    HM -->|Uses| HO
    HM -->|Uses| ST
    HM -->|Uses| YG
    HM -->|Uses| DS
    HM -->|Uses| AR
    HM -->|Uses| AV
    HM -->|Uses| GD
    HM -->|Uses| RD
    HM -->|Uses| AD
    HM -->|Uses| SC
    HM -->|Uses| DR
    DR -->|Reads| EPH
    DR -->|Uses| VR
    CH -->|Uses| HO
    ST -->|Uses| CH
    YG -->|Uses| CH
    DS -->|Uses| CH
    AR -->|Uses| CH
    AV -->|Uses| CH
    HM -->|Retrieves Data| TW
    TW -->|Renders| CS
    TW -->|Renders| CW
    HM -->|Uses| CONST
    HM -->|Uses| UTIL
    UTIL -->|Uses| LANG
    UTIL -->|Uses| CITY
    CT -->|Configures| CONST
```

## 2. Data Flow - User Input to Chart Display

```mermaid
sequenceDiagram
    participant User
    participant UI as ChartTabbed
    participant Val as Validation
    participant Horo as Horoscope
    participant Calc as Calculations
    participant Disp as Display

    User->>UI: Enter Name, DOB, TOB, Place
    User->>UI: Select Chart Type, Language
    User->>UI: Click Compute Horoscope
    
    UI->>Val: _validate_ui()
    Val-->>UI: Valid/Invalid
    
    alt Invalid Input
        UI->>User: Show Error Message
    else Valid Input
        UI->>Horo: Create Horoscope Object
        Horo->>Calc: Location Resolution
        Horo->>Calc: Date/Time Conversion
        Horo->>Calc: Ayanamsa Calculation
        Horo->>Calc: Calendar Information
        Horo->>Calc: Bhava Chart
        Horo-->>UI: Horoscope Object Ready
        
        UI->>Calc: get_horoscope_information_for_chart()
        Calc->>Calc: Calculate Divisional Charts
        Calc->>Calc: Calculate Planet Positions
        Calc-->>UI: Chart Data
        
        UI->>Calc: _get_*_dhasa_bhukthi()
        Calc->>Calc: Calculate Dhasa Periods
        Calc-->>UI: Dhasa Data
        
        UI->>Calc: get_yogas(), get_doshas()
        Calc->>Calc: Calculate Yogas & Doshas
        Calc-->>UI: Yoga/Dosha Data
        
        UI->>Disp: _update_chart_ui_with_info()
        Disp->>Disp: Populate All Tabs
        Disp->>Disp: Render Charts
        Disp->>Disp: Create Tables
        Disp-->>UI: UI Updated
        
        UI-->>User: Display Complete Horoscope
    end
```

## 3. Horoscope Initialization Flow

```mermaid
graph TD
    A["Horoscope.__init__<br/>(place, lat, long, tz, dob, tob)"] --> B["Validate<br/>Calculation Type"]
    B --> C["Resolve Location<br/>if needed"]
    C --> D["Create drik.Date<br/>& drik.Place"]
    D --> E["Convert to<br/>Julian Day Number"]
    E --> F["Get Ayanamsa<br/>Value"]
    F --> G["Calculate<br/>Calendar Info"]
    G --> G1["Vaara<br/>Tithi<br/>Nakshatra<br/>Yoga<br/>Karana<br/>Lunar Month"]
    G1 --> H["Calculate<br/>Bhava Chart"]
    H --> H1["House Cusps<br/>Ascendant<br/>Planets in Houses"]
    H1 --> I["Calculate<br/>Annual/Monthly<br/>Chart Date"]
    I --> J["Horoscope Object<br/>Ready"]
```

## 4. Chart Calculation Pipeline

```mermaid
graph LR
    A["Julian Day<br/>Number"] --> B["Divisional<br/>Chart Factor"]
    B --> C["Calculate<br/>Planet Positions"]
    C --> D["Apply<br/>Ayanamsa"]
    D --> E["Determine<br/>Sign & House"]
    E --> F["Check<br/>Retrograde"]
    F --> G["Check<br/>Combustion"]
    G --> H["Chart Data<br/>Dictionary"]
    H --> I["Calculate<br/>Aspects"]
    I --> J["Calculate<br/>Strengths"]
    J --> K["Calculate<br/>Yogas"]
    K --> L["Complete<br/>Chart Info"]
```

## 5. Dhasa Calculation Hierarchy

```mermaid
graph TD
    A["Dhasa Calculation<br/>Request"] --> B{Dhasa Type?}
    
    B -->|Graha Dhasa| C["Graha Dhasa Systems"]
    C --> C1["Vimsottari<br/>20-year cycle"]
    C --> C2["Ashtottari<br/>8-planet cycle"]
    C --> C3["Yogini<br/>27-year cycle"]
    C --> C4["Shodasottari<br/>16-year cycle"]
    C --> C5["Others<br/>Dwadasottari, Dwisatpathi,<br/>Panchottari, Satabdika, etc."]
    
    B -->|Rasi Dhasa| D["Rasi Dhasa Systems"]
    D --> D1["Narayana<br/>12-sign cycle"]
    D --> D2["Sudasa<br/>12-sign cycle"]
    D --> D3["Chara<br/>Moving signs"]
    D --> D4["Others<br/>Drig, Nirayana, Shoola,<br/>Chakra, Brahma, etc."]
    
    B -->|Annual Dhasa| E["Annual Dhasa Systems"]
    E --> E1["Patyayini"]
    E --> E2["Varsha Vimsottari"]
    E --> E3["Varsha Narayana"]
    
    B -->|Chakra Dhasa| F["Sudarshana Chakra<br/>Dhasa"]
    
    C1 --> G["Calculate<br/>Dhasas & Bhuktis"]
    C2 --> G
    C3 --> G
    C4 --> G
    C5 --> G
    D1 --> G
    D2 --> G
    D3 --> G
    D4 --> G
    E1 --> G
    E2 --> G
    E3 --> G
    F --> G
    
    G --> H["Return Periods<br/>with Dates"]
```

## 6. Tab Widget Structure

```mermaid
graph TD
    TW["Tab Widget<br/>(40+ Tabs)"]
    
    TW --> T1["Tab 1: Panchangam<br/>(Calendar Info)"]
    TW --> T2["Tab 2: Bhaava<br/>(Houses)"]
    TW --> T3["Tab 3: Pancha Pakshi<br/>(Bird Omens)"]
    TW --> T4["Tabs 4-28: Divisional Charts<br/>(Raasi, Hora, Drekkana, Navamsa, etc.)"]
    TW --> T5["Tabs 29-34: Strength Tables<br/>(Vimsopaka, Vaiseshikamsa, Shad Bala, Bhava Bala, etc.)"]
    TW --> T6["Tabs 35-55: Dhasa/Bhukthi<br/>(Vimsottari, Ashtottari, Yogini, Narayana, Sudasa, etc.)"]
    TW --> T7["Tab 56: Ashtaka Varga<br/>(Bindus & Sodhana)"]
    TW --> T8["Tab 57: Argala<br/>(Intervention)"]
    TW --> T9["Tab 58: Shodhaya<br/>(Ashtaka Varga Sodhana)"]
    TW --> T10["Tab 59: Yogas<br/>(100+ Yogas)"]
    TW --> T10a["Tab 60: Doshas<br/>(Mangal, Nadi, Bhakoot, etc.)"]
    TW --> T11["Tab 61: Chakras<br/>(Kota, Kaala, Sarvatobadra, etc.)"]
    TW --> T12["Tab 62: Compatibility<br/>(Marriage Match)"]
    
    T1 --> T1a["Vaara, Tithi, Nakshatra<br/>Yoga, Karana<br/>Lunar Month, Tamil Calendar<br/>Sunrise/Sunset"]
    T2 --> T2a["House Cusps<br/>Planets in Houses<br/>House Lords<br/>Karakas"]
    T4 --> T4a["Chart Visualization<br/>Planet Positions<br/>Sign Placements<br/>House Positions"]
    T5 --> T5a["Strength Values<br/>Bala Calculations<br/>Comparative Analysis"]
    T6 --> T6a["Dhasa Periods<br/>Bhukthi Periods<br/>Dates & Durations<br/>Current Period Highlight"]
    T7 --> T7a["Argala Planets<br/>Virodhargala<br/>Intervention Analysis"]
    T10 --> T10b["Yoga Names<br/>Yoga Descriptions<br/>Benefic/Malefic Status"]
    T10a --> T10c["Dosha Names<br/>Dosha Descriptions<br/>Severity Levels"]
    T11 --> T11a["Chakra Visualization<br/>Chakra Positions<br/>Chakra Analysis"]
    T12 --> T12a["Compatibility Score<br/>Porutham Matches<br/>Star Compatibility<br/>Detailed Analysis"]
```

## 7. Chart Rendering Pipeline

```mermaid
graph TD
    A["Chart Data<br/>(Planet Positions)"] --> B["Select Chart Style<br/>(South/North/East/West)"]
    B --> C["Create Chart Widget<br/>(SouthIndianChart, etc.)"]
    C --> D["Calculate Cell Positions<br/>based on Chart Type"]
    D --> E["Map Planets to Cells"]
    E --> F["Render Chart Grid"]
    F --> G["Draw Zodiac Signs"]
    G --> H["Draw House Numbers"]
    H --> I["Draw Planets in Cells"]
    I --> J["Draw Ascendant Marker"]
    J --> K["Apply Colors & Styling"]
    K --> L["Add Legend & Labels"]
    L --> M["Display in Tab"]
```

## 8. Calculation Dependencies

```mermaid
graph TD
    JD["Julian Day Number"]
    
    JD --> AY["Ayanamsa<br/>Calculation"]
    JD --> PP["Planet Positions<br/>(Ephemeris)"]
    JD --> HC["House Cusps<br/>(Bhava)"]
    JD --> TI["Tithi<br/>(Lunar Day)"]
    JD --> NK["Nakshatra<br/>(Star)"]
    JD --> VA["Vaara<br/>(Day of Week)"]
    JD --> YG["Yoga<br/>(Auspicious Time)"]
    JD --> KA["Karana<br/>(Half Lunar Day)"]
    
    PP --> DC["Divisional Charts<br/>(D1, D2, D3, D9, etc.)"]
    HC --> DC
    AY --> DC
    
    DC --> AS["Ashtaka Varga<br/>(Bindus)"]
    DC --> AR["Arudha Padas<br/>(Derived Lagnas)"]
    DC --> YO["Yogas<br/>(Combinations)"]
    DC --> DO["Doshas<br/>(Afflictions)"]
    DC --> ST["Strength<br/>(Bala)"]
    DC --> DR["Drishti<br/>(Aspects)"]
    
    PP --> DB["Dhasa/Bhukthi<br/>(Period Calculations)"]
    TI --> DB
    NK --> DB
    
    AS --> SH["Shodhaya<br/>(Sodhana)"]
    AR --> AG["Argala<br/>(Intervention)"]
    
    DC --> CH["Chart Display<br/>(Visualization)"]
    ST --> CH
    YO --> CH
    DO --> CH
    DB --> CH
    SH --> CH
    AG --> CH
```

## 9. UI Update Flow

```mermaid
graph TD
    A["compute_horoscope()<br/>Triggered"] --> B["_validate_ui()"]
    B --> C["Create Horoscope<br/>Object"]
    C --> D["_recreate_chart_tab_widgets()"]
    D --> E["_update_chart_ui_with_info()"]
    
    E --> E1["_update_panchanga_tab_information()"]
    E --> E2["_update_bhaava_tab_information()"]
    E --> E3["_update_chart_tab_information()<br/>for each divisional chart"]
    E --> E4["_update_*_bala_table_information()<br/>for each strength type"]
    E --> E5["_update_*_dhasa_table_information()<br/>for each dhasa system"]
    E --> E6["_update_yoga_list_information()"]
    E --> E7["_update_dosha_list_information()"]
    E --> E8["_update_drishti_table_information()"]
    E --> E9["_update_saham_table_information()"]
    E --> E10["_update_argala_table_information()"]
    E --> E11["_update_shodhaya_table_information()"]
    E --> E12["_update_chakra_information()"]
    E --> E13["_update_compatibility_information()"]
    
    E1 --> F["All Tabs<br/>Populated"]
    E2 --> F
    E3 --> F
    E4 --> F
    E5 --> F
    E6 --> F
    E7 --> F
    E8 --> F
    E9 --> F
    E10 --> F
    E11 --> F
    E12 --> F
    E13 --> F
    
    F --> G["Display to User"]
```

## 10. Module Dependency Graph

```mermaid
graph TB
    subgraph UI["UI Layer"]
        HCT["horo_chart_tabs.py<br/>(Main)"]
        CS["chart_styles.py"]
        CK["chakra.py"]
        LG["label_grid.py"]
        OD["options_dialog.py"]
        VCD["varga_chart_dialog.py"]
        DBO["dhasa_bhukthi_options_dialog.py"]
        MCD["mixed_chart_dialog.py"]
        PAN["panchangam.py"]
        PPS["pancha_pakshi_sastra_widget.py"]
        CNJ["conjunction.py"]
        VRF["vratha_finder.py"]
    end
    
    subgraph CALC["Calculation"]
        HM["main.py<br/>(Horoscope)"]
        CH["charts.py"]
        HO["house.py"]
        ST["strength.py"]
        YG["yoga.py"]
        RY["raja_yoga.py"]
        DS["dosha.py"]
        AR["arudhas.py"]
        AV["ashtakavarga.py"]
        SP["sphuta.py"]
    end
    
    subgraph DHASA["Dhasa"]
        GD["graha/"]
        RD["rasi/"]
        AD["annual/"]
        SC["sudharsana_chakra.py"]
    end
    
    subgraph PANCHANGA["Panchanga"]
        DR["drik.py"]
        VR["vratha.py"]
        PP["pancha_paksha.py"]
    end
    
    subgraph SUPPORT["Support"]
        CONST["const.py"]
        UTIL["utils.py"]
        LANG["lang/"]
        DATA["data/"]
    end
    
    HCT --> CS
    HCT --> CK
    HCT --> LG
    HCT --> OD
    HCT --> VCD
    HCT --> DBO
    HCT --> MCD
    HCT --> PAN
    HCT --> PPS
    HCT --> CNJ
    HCT --> VRF
    
    HCT --> HM
    CS --> HM
    CK --> HM
    
    HM --> CH
    HM --> HO
    HM --> ST
    HM --> YG
    HM --> RY
    HM --> DS
    HM --> AR
    HM --> AV
    HM --> SP
    
    HM --> GD
    HM --> RD
    HM --> AD
    HM --> SC
    
    HM --> DR
    HM --> VR
    HM --> PP
    
    CH --> HO
    ST --> CH
    YG --> CH
    RY --> CH
    DS --> CH
    AR --> CH
    AV --> CH
    SP --> CH
    
    HM --> CONST
    HM --> UTIL
    UTIL --> LANG
    UTIL --> DATA
    DR --> DATA
    
    HCT --> CONST
    HCT --> UTIL
```

