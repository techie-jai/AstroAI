from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime


class BirthData(BaseModel):
    """Birth data input model"""
    name: str = Field(..., min_length=1, max_length=100)
    place_name: str = Field(..., min_length=1, max_length=500)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timezone_offset: float = Field(..., ge=-12, le=14)
    year: int = Field(..., ge=1900, le=2100)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    hour: int = Field(..., ge=0, le=23)
    minute: int = Field(..., ge=0, le=59)
    second: int = Field(default=0, ge=0, le=59)


class GenerateKundliRequest(BaseModel):
    """Request to generate kundli"""
    birth_data: BirthData
    include_charts: bool = Field(default=True, description="Include divisional charts")
    chart_types: Optional[List[str]] = Field(
        default=["D1", "D7", "D9", "D10"],
        description="List of chart types to generate"
    )


class GenerateAnalysisRequest(BaseModel):
    """Request to generate AI analysis"""
    kundli_id: str = Field(..., description="ID of stored kundli")
    analysis_type: str = Field(default="comprehensive", description="Type of analysis")


class UserProfile(BaseModel):
    """User profile model"""
    uid: str
    email: str
    display_name: Optional[str] = None
    created_at: datetime
    last_login: datetime
    subscription_tier: str = Field(default="free")
    total_calculations: int = Field(default=0)


class CalculationHistory(BaseModel):
    """Calculation history entry"""
    calculation_id: str
    user_id: str
    birth_data: Dict[str, Any]
    created_at: datetime
    chart_types: List[str]
    status: str = Field(default="completed")
    result_summary: Optional[Dict[str, Any]] = None


class ChartData(BaseModel):
    """Chart data response model"""
    chart_type: str
    chart_name: str
    signification: str
    planets: List[Dict[str, Any]]
    houses: Dict[int, List[Dict[str, Any]]]
    ascendant: Optional[Dict[str, Any]]
    birth_data: Dict[str, Any]


class KundliResponse(BaseModel):
    """Kundli response model"""
    kundli_id: str
    user_id: str
    birth_data: Dict[str, Any]
    horoscope_info: Dict[str, Any]
    charts: Optional[Dict[str, ChartData]] = None
    created_at: datetime
    file_paths: Optional[Dict[str, str]] = None


class AnalysisResponse(BaseModel):
    """Analysis response model"""
    analysis_id: str
    kundli_id: str
    analysis_text: str
    analysis_pdf_path: Optional[str] = None
    created_at: datetime
    analysis_type: str


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None
    status_code: int


class CreateProfileRequest(BaseModel):
    """Request to create user profile"""
    token: str = Field(..., description="Firebase ID token")
    display_name: Optional[str] = Field(None, description="Optional display name")


class Dosha(BaseModel):
    """Dosha detection result"""
    name: str = Field(..., description="Name of the dosha (e.g., Mangal Dosha)")
    is_present: bool = Field(..., description="Whether dosha is present")
    is_cancelled: bool = Field(default=False, description="Whether dosha is cancelled by Bhanga yogas")
    severity: str = Field(..., description="Severity level: severe, moderate, mild")
    description: str = Field(..., description="Detailed explanation of the dosha")
    cancellation_reasons: List[str] = Field(default_factory=list, description="Reasons why dosha is cancelled (Dosha Bhanga)")
    remedies: List[str] = Field(default_factory=list, description="Suggested remedies (Upayas)")
    detected: bool = Field(default=False, description="[DEPRECATED] Use is_present instead")


class Avastha(BaseModel):
    """Planetary avastha (state/condition)"""
    planet: str = Field(..., description="Planet name")
    avastha_type: str = Field(..., description="Type: neecha, asta, yuddha, retrograde")
    severity: str = Field(..., description="Severity: severe, moderate, mild")
    description: str = Field(..., description="Explanation of the avastha")


class DusthanaAffliction(BaseModel):
    """Affliction in dusthana houses (6, 8, 12)"""
    house: int = Field(..., ge=6, le=12, description="House number (6, 8, or 12)")
    planets: List[str] = Field(..., description="Planets in this dusthana house")
    severity: str = Field(..., description="Severity: severe, moderate, mild")
    description: str = Field(..., description="Explanation of the affliction")


class DChartAffliction(BaseModel):
    """D-Chart specific afflictions"""
    chart_type: str = Field(..., description="D-chart type (D9, D6, D8, D30, D60)")
    affliction_type: str = Field(..., description="Type of affliction")
    severity: str = Field(..., description="Severity: severe, moderate, mild")
    description: str = Field(..., description="Explanation")
    planets: Optional[List[str]] = Field(default=None, description="Affected planets")


class CurrentDasha(BaseModel):
    """Current Mahadasha/Antardasha/Pratyantardasha information"""
    planet: str = Field(..., description="Planet ruling the dasha")
    start_date: str = Field(..., description="Start date (YYYY-MM-DD)")
    end_date: str = Field(..., description="End date (YYYY-MM-DD)")
    duration_years: float = Field(..., description="Total duration in years")
    progress_percent: float = Field(..., ge=0, le=100, description="Percentage of dasha completed")
    days_remaining: int = Field(..., description="Days remaining in dasha")
    pratyantardasha: Optional['CurrentDasha'] = Field(None, description="Current Pratyantardasha (sub-sub-period)")


class DashaAlerts(BaseModel):
    """Alert flags for current dasha periods"""
    is_maraka_dasha: bool = Field(..., description="True if in Maraka dasha (2nd/7th lord)")
    is_dusthana_dasha: bool = Field(..., description="True if in Dusthana dasha (6th/8th/12th lord)")
    is_rahu_ketu_dasha: bool = Field(..., description="True if in Rahu or Ketu Mahadasha")
    alert_description: str = Field(..., description="Human-readable description of the alert")


class ActiveDashas(BaseModel):
    """Active dasha periods and alerts"""
    current_mahadasha: Optional[CurrentDasha] = Field(None, description="Current Mahadasha")
    current_antardasha: Optional[CurrentDasha] = Field(None, description="Current Antardasha")
    dasha_alerts: DashaAlerts = Field(..., description="Alert flags for current periods")


class NegativePeriod(BaseModel):
    """Active negative period (Sade Sati, Maraka, etc.)"""
    type: str = Field(..., description="Type: sade_sati, maraka, badhaka, rahu_mahadasha, ketu_mahadasha")
    start_date: str = Field(..., description="Start date (YYYY-MM-DD)")
    end_date: str = Field(..., description="End date (YYYY-MM-DD)")
    days_remaining: int = Field(..., description="Days remaining")
    severity: str = Field(..., description="Severity: severe, moderate, mild")
    description: str = Field(..., description="Explanation of the period")


class DoshaAnalysisSummary(BaseModel):
    """Summary statistics of dosha analysis"""
    total_doshas: int = Field(..., description="Total doshas detected")
    severe_count: int = Field(..., description="Count of severe doshas")
    moderate_count: int = Field(..., description="Count of moderate doshas")
    mild_count: int = Field(..., description="Count of mild doshas")
    active_negative_periods: int = Field(..., description="Number of active negative periods")


class DoshaAnalysisResponse(BaseModel):
    """Complete dosha and timeline analysis response"""
    kundli_id: str = Field(..., description="ID of analyzed kundli")
    analysis_date: datetime = Field(..., description="When analysis was performed")
    birth_data: Dict[str, Any] = Field(..., description="Birth data from kundli")
    
    doshas: Dict[str, Any] = Field(..., description="All detected doshas")
    major_doshas: List[Dosha] = Field(..., description="8 major doshas")
    planetary_avasthas: List[Avastha] = Field(..., description="Planetary states")
    dusthana_afflictions: List[DusthanaAffliction] = Field(..., description="6th, 8th, 12th house afflictions")
    d_chart_afflictions: List[DChartAffliction] = Field(..., description="D-chart specific afflictions")
    
    active_timelines: Dict[str, Any] = Field(..., description="Timeline data")
    current_mahadasha: Optional[CurrentDasha] = Field(None, description="Current Mahadasha")
    current_antardasha: Optional[CurrentDasha] = Field(None, description="Current Antardasha")
    active_dashas: ActiveDashas = Field(..., description="Active dasha periods with alerts")
    negative_periods: List[NegativePeriod] = Field(..., description="Active negative periods")
    
    summary: DoshaAnalysisSummary = Field(..., description="Analysis summary")


class KundliMatchingRequest(BaseModel):
    """Request to calculate kundli matching"""
    boy_data: BirthData = Field(..., description="Boy's birth data")
    girl_data: BirthData = Field(..., description="Girl's birth data")
    method: str = Field(default="North", description="Matching method: North or South")


class AshtakootaScore(BaseModel):
    """Individual Ashtakoota score"""
    key: str = Field(..., description="Score key identifier")
    name: str = Field(..., description="Score name")
    score: float = Field(..., description="Score value")
    max_score: float = Field(..., description="Maximum possible score")
    description: str = Field(..., description="What this score measures")
    interpretation: str = Field(..., description="Interpretation of the score")


class NaaluPoruthamCheck(BaseModel):
    """Naalu Porutham (4 additional checks) result"""
    key: str = Field(..., description="Check key identifier")
    name: str = Field(..., description="Check name")
    status: bool = Field(..., description="Whether check passed")
    description: str = Field(..., description="What this check measures")
    importance: str = Field(..., description="Importance of this check")


class OverallVerdict(BaseModel):
    """Overall compatibility verdict"""
    verdict: str = Field(..., description="Verdict: Excellent, Good, Average, or Poor")
    color: str = Field(..., description="Color code: green, blue, yellow, or red")
    message: str = Field(..., description="Human-readable verdict message")
    percentage: int = Field(..., ge=0, le=100, description="Compatibility percentage")


class KundliMatchingResponse(BaseModel):
    """Complete kundli matching response"""
    match_id: str = Field(..., description="Unique ID for this matching result")
    boy_name: str = Field(..., description="Boy's name")
    girl_name: str = Field(..., description="Girl's name")
    method: str = Field(..., description="Matching method used")
    total_score: float = Field(..., description="Total compatibility score")
    max_score: int = Field(..., description="Maximum possible score (36 for North, 10 for South)")
    timestamp: datetime = Field(..., description="When matching was calculated")
    ashtakoota_scores: List[AshtakootaScore] = Field(..., description="8 Ashtakoota scores")
    naalu_porutham_checks: List[NaaluPoruthamCheck] = Field(..., description="4 Naalu Porutham checks")
    overall_verdict: OverallVerdict = Field(..., description="Overall compatibility verdict")
    file_path: Optional[str] = Field(None, description="Path to saved result file")
    boy_kundli: Optional[dict] = Field(None, description="Boy's generated kundli data")
    girl_kundli: Optional[dict] = Field(None, description="Girl's generated kundli data")


class ChatMessage(BaseModel):
    """Single chat message"""
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(..., description="When message was created")
    tokens_used: int = Field(default=0, description="Tokens used for this message")


class ContextSummary(BaseModel):
    """Conversation context summary (flow/trajectory)"""
    summary: str = Field(..., description="Summarized conversation flow")
    key_topics: List[str] = Field(default_factory=list, description="Key topics discussed")
    generated_at: datetime = Field(..., description="When summary was generated")
    message_count_at_generation: int = Field(..., description="Total messages when summary was generated")
    next_summary_at_message: int = Field(..., description="Message count at which next summary should trigger")


class KundliFacts(BaseModel):
    """Immutable astrological facts extracted from kundli"""
    mahadasha: Optional[str] = Field(None, description="Current Mahadasha")
    antardasha: Optional[str] = Field(None, description="Current Antardasha")
    doshas_present: List[str] = Field(default_factory=list, description="List of doshas present")
    sun_sign: Optional[str] = Field(None, description="Sun sign")
    moon_sign: Optional[str] = Field(None, description="Moon sign")
    major_planets: Dict[str, str] = Field(default_factory=dict, description="Major planet positions")
    extracted_at: datetime = Field(..., description="When facts were extracted")
    extracted_from_messages: int = Field(default=0, description="Message count when extracted")


class ConversationMetadata(BaseModel):
    """Conversation metadata and statistics"""
    kundli_id: str = Field(..., description="Associated kundli ID")
    user_id: str = Field(..., description="User ID")
    created_at: datetime = Field(..., description="When conversation started")
    last_activity: datetime = Field(..., description="Last message timestamp")
    total_messages: int = Field(default=0, description="Total messages in conversation")
    total_tokens_used: int = Field(default=0, description="Total tokens used")
    status: str = Field(default="active", description="Status: active or archived")
    summary_version: int = Field(default=0, description="Version of context summary")


# Palmistry Models
class PalmLine(BaseModel):
    """Palm line analysis"""
    name: str = Field(..., description="Name of the line (e.g., Heart Line)")
    description: str = Field(..., description="Physical description of the line")
    meaning: str = Field(..., description="Astrological meaning and interpretation")
    strength: str = Field(..., description="Strength level: strong, moderate, or faint")


class PalmMount(BaseModel):
    """Planetary mount analysis"""
    name: str = Field(..., description="Name of the mount")
    planet: str = Field(..., description="Associated planet")
    description: str = Field(..., description="Description of the mount")
    prominence: str = Field(..., description="Prominence level: prominent, normal, or flat")


class PalmMetadata(BaseModel):
    """Complete palmistry metadata extracted by AI"""
    palmistry_id: str = Field(..., description="Unique palmistry reading ID")
    user_id: str = Field(..., description="User ID")
    created_at: datetime = Field(..., description="When reading was created")
    handedness: str = Field(..., description="User's handedness: left or right")
    hand_type: str = Field(..., description="Hand type (e.g., Air, Fire, Water, Earth)")
    elemental_type: str = Field(..., description="Elemental classification")
    palm_shape: str = Field(..., description="Palm shape (Square, Rectangular, etc.)")
    finger_length: str = Field(..., description="Finger length relative to palm")
    major_lines: Dict[str, PalmLine] = Field(..., description="Major palm lines")
    mounts: Dict[str, PalmMount] = Field(..., description="Planetary mounts")
    special_marks: List[str] = Field(default_factory=list, description="Special markings (Mystic Cross, Tridents, etc.)")
    finger_gaps: Optional[str] = Field(None, description="Notable finger gaps")
    overall_reading: str = Field(..., description="Overall palmistry reading summary")
    life_areas: Dict[str, Dict[str, Any]] = Field(..., description="Life area scores and descriptions")
    dominant_hand_analysis: Optional[Dict[str, str]] = Field(None, description="Analysis of dominant hand")
    non_dominant_hand_analysis: Optional[Dict[str, str]] = Field(None, description="Analysis of non-dominant hand")


class PalmistryAnalysisRequest(BaseModel):
    """Request to analyze palm images"""
    left_hand_image: str = Field(..., description="Base64 encoded left hand image")
    right_hand_image: str = Field(..., description="Base64 encoded right hand image")
    handedness: str = Field(..., description="User's handedness: left or right")
    name: Optional[str] = Field(None, description="Optional name to identify the reading")


class PalmistryAnalysisResponse(BaseModel):
    """Response from palmistry analysis"""
    palmistry_id: str = Field(..., description="Unique palmistry reading ID")
    handedness: str = Field(..., description="User's handedness")
    hand_type: str = Field(..., description="Hand type")
    elemental_type: str = Field(..., description="Elemental type")
    palm_shape: str = Field(..., description="Palm shape")
    finger_length: str = Field(..., description="Finger length")
    major_lines: Dict[str, PalmLine] = Field(..., description="Major palm lines")
    mounts: Dict[str, PalmMount] = Field(..., description="Planetary mounts")
    overall_reading: str = Field(..., description="Overall reading")
    life_areas: Dict[str, Dict[str, Any]] = Field(..., description="Life area scores")
    created_at: datetime = Field(..., description="When reading was created")
    metadata: Optional[PalmMetadata] = Field(None, description="Complete metadata")


class PalmistryListResponse(BaseModel):
    """List of user's palmistry readings"""
    readings: List[Dict[str, Any]] = Field(..., description="List of palmistry readings")
