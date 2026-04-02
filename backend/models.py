from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime


class BirthData(BaseModel):
    """Birth data input model"""
    name: str = Field(..., min_length=1, max_length=100)
    place_name: str = Field(..., min_length=1, max_length=100)
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
