import os
import csv
import json
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from typing import Optional, List, Dict
from firebase_admin import firestore
from google.cloud.firestore import Increment

from models import (
    BirthData, GenerateKundliRequest, GenerateAnalysisRequest,
    KundliResponse, AnalysisResponse, ErrorResponse, CreateProfileRequest
)
from firebase_config import FirebaseConfig, FirebaseService
from astrology_service import AstrologyService
from gemini_service import GeminiService
from auth import verify_token, get_current_user
from file_manager import FileManager
from pdf_generator import PDFGenerator
from analysis_formatter import AnalysisFormatter
from fastapi.responses import FileResponse

load_dotenv()

app = FastAPI(
    title="AstroAI API",
    description="Vedic Astrology API with AI Analysis",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:50530",  # Browser preview proxy
    "http://192.168.1.36:3000",  # Local network IP
    "http://192.168.1.36:3001",
    "http://192.168.1.36:8000",
    "http://172.23.0.3:3000",  # Docker internal network
    "http://172.23.0.2:3000",  # Docker internal network (alternative)
    "https://kendraa.ai",  # Production domain
    "https://www.kendraa.ai",  # Production domain with www
    "http://kendraa.ai",  # HTTP fallback
    "http://www.kendraa.ai",  # HTTP fallback with www
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

astrology_service = AstrologyService()
file_manager = FileManager(base_dir=os.path.join(os.path.dirname(__file__), '..', 'users'))

# Initialize Gemini service
try:
    gemini_service = GeminiService()
except ValueError as e:
    print(f"[WARNING] Gemini service not initialized: {str(e)}")
    gemini_service = None


# Initialize Firebase on module load
try:
    FirebaseConfig.initialize()
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"⚠️ Firebase initialization warning: {str(e)}")


def format_kundli_text(kundli_data: dict, birth_data: dict) -> str:
    """
    Format kundli data as readable text
    
    Args:
        kundli_data: Kundli data dictionary
        birth_data: Birth data dictionary
        
    Returns:
        Formatted kundli text
    """
    text = "=" * 80 + "\n"
    text += "VEDIC KUNDLI (BIRTH CHART)\n"
    text += "=" * 80 + "\n\n"
    
    # Birth Information
    text += "BIRTH INFORMATION\n"
    text += "-" * 80 + "\n"
    text += f"Name: {birth_data.get('name', 'N/A')}\n"
    text += f"Date of Birth: {birth_data.get('year', 'N/A')}-{birth_data.get('month', 'N/A')}-{birth_data.get('day', 'N/A')}\n"
    text += f"Time of Birth: {birth_data.get('hour', 'N/A')}:{birth_data.get('minute', 'N/A')}\n"
    text += f"Place of Birth: {birth_data.get('place_name', 'N/A')}\n"
    text += f"Latitude: {birth_data.get('latitude', 'N/A')}\n"
    text += f"Longitude: {birth_data.get('longitude', 'N/A')}\n"
    text += f"Timezone Offset: {birth_data.get('timezone_offset', 'N/A')}\n\n"
    
    # Horoscope Information
    horoscope_info = kundli_data.get('horoscope_info', {})
    if horoscope_info:
        text += "ASTROLOGICAL INFORMATION\n"
        text += "-" * 80 + "\n"
        for key, value in list(horoscope_info.items())[:20]:
            formatted_key = key.replace('_', ' ').title()
            text += f"{formatted_key}: {value}\n"
        text += "\n"
    
    text += "=" * 80 + "\n"
    return text


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AstroAI API",
        "version": "1.0.0"
    }


@app.post("/api/auth/verify-token")
async def verify_firebase_token(token: str):
    """
    Verify Firebase ID token
    
    Args:
        token: Firebase ID token
        
    Returns:
        User information if token is valid
    """
    decoded = FirebaseService.verify_token(token)
    if not decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_info = FirebaseService.get_user(decoded['uid'])
    return {
        "uid": decoded['uid'],
        "email": decoded.get('email'),
        "user_info": user_info
    }


@app.post("/api/auth/create-profile")
async def create_user_profile(request: CreateProfileRequest):
    """
    Create user profile after authentication
    
    Args:
        request: CreateProfileRequest with token and optional display_name
        
    Returns:
        User profile information
    """
    decoded = FirebaseService.verify_token(request.token)
    if not decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    uid = decoded['uid']
    email = decoded.get('email')
    
    success = FirebaseService.create_user_profile(uid, email, request.display_name)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user profile"
        )
    
    profile = FirebaseService.get_user_profile(uid)
    return {
        "message": "Profile created successfully",
        "profile": profile
    }


@app.get("/api/user/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user profile
    
    Returns:
        User profile information
    """
    profile = FirebaseService.get_user_profile(current_user['uid'])
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    
    return profile


@app.put("/api/user/profile")
async def update_user_profile(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Update user profile
    
    Args:
        data: Profile data to update
        
    Returns:
        Updated profile information
    """
    success = FirebaseService.update_user_profile(current_user['uid'], data)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )
    
    profile = FirebaseService.get_user_profile(current_user['uid'])
    return profile


@app.post("/api/kundli/generate")
async def generate_kundli(
    request: GenerateKundliRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate kundli from birth data and save locally
    
    Args:
        request: Birth data and generation options
        
    Returns:
        Generated kundli data with file paths
    """
    try:
        print(f"[KUNDLI] Starting generation for user: {current_user.get('uid')}")
        birth_data_dict = request.birth_data.dict()
        user_name = birth_data_dict.get('name', 'User')
        
        # Create user folder
        print(f"[KUNDLI] Creating user folder...")
        user_folder, unique_id = file_manager.create_user_folder(user_name)
        
        # Save user info
        print(f"[KUNDLI] Saving user info...")
        user_info = birth_data_dict.copy()
        user_info['uid'] = current_user['uid']
        user_info['unique_id'] = unique_id
        file_manager.save_user_info(user_folder, user_info)
        
        # Generate kundli
        print(f"[KUNDLI] Generating kundli data...")
        result = astrology_service.generate_kundli(birth_data_dict)
        
        if not result.get('success'):
            error_msg = result.get('error', 'Failed to generate kundli')
            print(f"[KUNDLI] Generation failed: {error_msg}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        kundli_id = result['kundli_id']
        kundli_data = result['data']
        print(f"[KUNDLI] Generated kundli_id: {kundli_id}")
        
        # Format kundli text
        print(f"[KUNDLI] Formatting kundli text...")
        kundli_text = format_kundli_text(kundli_data, birth_data_dict)
        
        # Save kundli files locally
        print(f"[KUNDLI] Saving kundli files locally...")
        kundli_json_path = file_manager.save_kundli_json(user_folder, user_name, kundli_data)
        kundli_text_path = file_manager.save_kundli_text(user_folder, user_name, kundli_text)
        print(f"[KUNDLI] Kundli saved: {kundli_json_path}")
        
        # Generate charts
        print(f"[KUNDLI] Generating divisional charts...")
        chart_types = request.chart_types or ['D1', 'D7', 'D9', 'D10']
        charts_result = astrology_service.generate_charts(birth_data_dict, chart_types)
        
        charts_dict = {}
        if charts_result.get('success'):
            charts_dict = charts_result.get('charts', {})
            print(f"[KUNDLI] Generated {len(charts_dict)} charts")
            for chart_type, chart_data in charts_dict.items():
                # Format chart text
                chart_text_result = astrology_service.format_chart_text(birth_data_dict, chart_type)
                chart_text = chart_text_result.get('text', '') if chart_text_result.get('success') else ''
                
                # Save chart JSON and text
                file_manager.save_chart_json(user_folder, chart_type, chart_data)
                file_manager.save_chart_text(user_folder, chart_type, chart_text)
                print(f"[KUNDLI] Saved chart: {chart_type}")
        else:
            print(f"[KUNDLI] Chart generation failed: {charts_result.get('error', 'Unknown error')}")
        
        # Save complete kundli data to Firebase for LLM access
        print(f"[KUNDLI] Saving complete kundli data to Firebase...")
        kundli_firebase_data = {
            'kundli_id': kundli_id,
            'birth_data': birth_data_dict,
            'horoscope_info': kundli_data.get('horoscope_info', {}),
            'chart_types': request.chart_types or ['D1', 'D7', 'D9', 'D10'],
            'charts': charts_dict,
            'generated_at': result['generated_at'],
            'user_folder': user_folder,
            'unique_id': unique_id
        }
        kundli_firebase_id = FirebaseService.save_kundli(current_user['uid'], kundli_firebase_data)
        print(f"[KUNDLI] Kundli data saved to Firebase: {kundli_firebase_id}")
        
        # Save to Firebase for auth/tracking only
        print(f"[KUNDLI] Saving calculation metadata to Firebase...")
        calculation_data = {
            'birth_data': birth_data_dict,
            'chart_types': request.chart_types or ['D1', 'D7', 'D9', 'D10'],
            'result_summary': {
                'kundli_id': kundli_id,
                'user_folder': user_folder,
                'unique_id': unique_id,
                'generated_at': result['generated_at']
            }
        }
        saved_id = FirebaseService.save_calculation(current_user['uid'], calculation_data)
        print(f"[KUNDLI] Calculation metadata saved: {saved_id}")
        
        # Ensure user profile exists
        print(f"[KUNDLI] Ensuring user profile exists...")
        user_profile = FirebaseService.get_user_profile(current_user['uid'])
        if not user_profile:
            print(f"[KUNDLI] Creating user profile...")
            FirebaseService.create_user_profile(
                current_user['uid'],
                current_user.get('email', ''),
                current_user.get('display_name')
            )
        
        # Update user profile
        print(f"[KUNDLI] Updating user profile...")
        FirebaseService.update_user_profile(
            current_user['uid'],
            {'total_calculations': Increment(1)}
        )
        
        response_data = {
            "kundli_id": kundli_id,
            "unique_id": unique_id,
            "user_folder": user_folder,
            "kundli_json_path": kundli_json_path,
            "kundli_text_path": kundli_text_path,
            "birth_data": birth_data_dict,
            "generated_at": result['generated_at'],
            "firebase_kundli_id": kundli_firebase_id,
            "horoscope_info_keys": list(kundli_data.get('horoscope_info', {}).keys())[:10]
        }
        print(f"[KUNDLI] Returning response: {response_data}")
        return response_data
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[KUNDLI] ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/api/charts/generate")
async def generate_charts(
    request: GenerateKundliRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate divisional charts
    
    Args:
        request: Birth data and chart types
        
    Returns:
        Generated charts data
    """
    try:
        birth_data_dict = request.birth_data.dict()
        chart_types = request.chart_types or ['D1', 'D7', 'D9', 'D10']
        
        result = astrology_service.generate_charts(birth_data_dict, chart_types)
        
        if not result.get('success'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get('error', 'Failed to generate charts')
            )
        
        return {
            "charts": result['charts'],
            "generated_at": result['generated_at'],
            "chart_count": len(result['charts'])
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/kundli/{kundli_id}")
async def get_kundli(
    kundli_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get stored kundli data from Firebase (for LLM access)
    
    Args:
        kundli_id: Kundli ID
        
    Returns:
        Complete kundli data including horoscope_info
    """
    try:
        print(f"[GET_KUNDLI] Fetching kundli: {kundli_id} for user: {current_user.get('uid')}")
        
        # Try to get kundli from Firebase first (for LLM access)
        kundli_data = FirebaseService.get_kundli(current_user['uid'], kundli_id)
        
        if kundli_data:
            print(f"[GET_KUNDLI] Kundli data loaded from Firebase")
            return kundli_data
        
        # Fallback: Get from local files if not in Firebase
        print(f"[GET_KUNDLI] Kundli not found in Firebase, trying local files...")
        calculations = FirebaseService.get_user_calculations(current_user['uid'])
        print(f"[GET_KUNDLI] Found {len(calculations)} calculations")
        
        user_folder = None
        birth_data = None
        
        for calc in calculations:
            result_summary = calc.get('result_summary', {})
            calc_kundli_id = result_summary.get('kundli_id')
            
            if calc_kundli_id == kundli_id:
                user_folder = result_summary.get('user_folder')
                birth_data = calc.get('birth_data')
                print(f"[GET_KUNDLI] Found matching calculation")
                break
        
        if not user_folder or not birth_data:
            print(f"[GET_KUNDLI] Kundli metadata not found for ID: {kundli_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kundli not found"
            )
        
        # Read kundli JSON from local file
        user_name = birth_data.get('name', 'User')
        kundli_json_path = file_manager.get_kundli_json_path(user_folder, user_name)
        
        if not kundli_json_path:
            print(f"[GET_KUNDLI] Kundli JSON file not found for user: {user_name}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kundli file not found"
            )
        
        kundli_file_data = file_manager.read_kundli_json(kundli_json_path)
        
        if not kundli_file_data:
            print(f"[GET_KUNDLI] Failed to read kundli data from file")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to read kundli data"
            )
        
        print(f"[GET_KUNDLI] Kundli data loaded from file: {kundli_json_path}")
        
        return {
            "kundli_id": kundli_id,
            "birth_data": birth_data,
            "horoscope_info": kundli_file_data.get('horoscope_info', {}),
            "generated_at": kundli_file_data.get('generated_at'),
            "kundli_json_path": kundli_json_path
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[GET_KUNDLI] ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/calculations/history")
async def get_calculation_history(
    limit: int = 20,
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's calculation history
    
    Args:
        limit: Maximum number of records to return
        
    Returns:
        List of calculations
    """
    try:
        calculations = FirebaseService.get_user_calculations(current_user['uid'], limit)
        
        return {
            "total": len(calculations),
            "calculations": calculations
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/kundlis/list")
async def get_user_kundlis(
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all kundlis for current user (for LLM access)
    
    Args:
        limit: Maximum number of kundlis to return
        
    Returns:
        List of kundli documents with all data
    """
    try:
        print(f"[GET_KUNDLIS] Fetching kundlis for user: {current_user.get('uid')}")
        kundlis = FirebaseService.get_user_kundlis(current_user['uid'], limit)
        print(f"[GET_KUNDLIS] Found {len(kundlis)} kundlis")
        
        return {
            "total": len(kundlis),
            "kundlis": kundlis
        }
    
    except Exception as e:
        print(f"[GET_KUNDLIS] ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/planet/{chart_type}/{planet_name}")
async def get_planet_position(
    chart_type: str,
    planet_name: str,
    birth_data: BirthData = Depends(),
    current_user: dict = Depends(get_current_user)
):
    """
    Get planet position in a specific chart
    
    Args:
        chart_type: Chart type (D1, D9, etc.)
        planet_name: Planet name
        birth_data: Birth data
        
    Returns:
        Planet position information
    """
    try:
        result = astrology_service.get_planet_position(
            birth_data.dict(),
            chart_type,
            planet_name
        )
        
        if not result.get('success'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get('error')
            )
        
        return result['planet']
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/house/{chart_type}/{house_number}")
async def get_planets_in_house(
    chart_type: str,
    house_number: int,
    birth_data: BirthData = Depends(),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all planets in a specific house
    
    Args:
        chart_type: Chart type (D1, D9, etc.)
        house_number: House number (1-12)
        birth_data: Birth data
        
    Returns:
        List of planets in the house
    """
    try:
        if house_number < 1 or house_number > 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="House number must be between 1 and 12"
            )
        
        result = astrology_service.get_planets_in_house(
            birth_data.dict(),
            chart_type,
            house_number
        )
        
        if not result.get('success'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get('error')
            )
        
        return {
            "house": house_number,
            "chart_type": chart_type,
            "planets": result['planets']
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/user/calculations")
async def get_user_calculations(
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's calculation history with metadata
    
    Returns:
        List of user's past kundli generations
    """
    try:
        print(f"[USER_CALCS] Fetching calculations for user: {current_user.get('uid')}")
        calculations = FirebaseService.get_user_calculations(current_user['uid'], limit=50)
        
        formatted_calcs = []
        for calc in calculations:
            result_summary = calc.get('result_summary', {})
            birth_data = calc.get('birth_data', {})
            formatted_calcs.append({
                'calculation_id': calc.get('calculation_id'),
                'kundli_id': result_summary.get('kundli_id'),
                'name': birth_data.get('name', 'Unknown'),
                'birth_date': f"{birth_data.get('year', '')}-{birth_data.get('month', '')}-{birth_data.get('day', '')}",
                'birth_time': f"{birth_data.get('hour', '')}:{birth_data.get('minute', '')}",
                'place': birth_data.get('place_name', 'Unknown'),
                'generation_date': calc.get('created_at'),
                'has_analysis': False,
                'has_insights': False
            })
        
        print(f"[USER_CALCS] Returning {len(formatted_calcs)} calculations")
        return {
            'total': len(formatted_calcs),
            'calculations': formatted_calcs
        }
    
    except Exception as e:
        print(f"[USER_CALCS] ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/user/load-session")
async def load_user_session(
    current_user: dict = Depends(get_current_user)
):
    """
    Load user session data on login
    
    Returns:
        User profile, recent calculations, and latest kundli metadata
    """
    try:
        print(f"[SESSION] Loading session for user: {current_user.get('uid')}")
        
        user_profile = FirebaseService.get_user_profile(current_user['uid'])
        calculations = FirebaseService.get_user_calculations(current_user['uid'], limit=5)
        
        latest_kundli = None
        if calculations:
            latest_calc = calculations[0]
            result_summary = latest_calc.get('result_summary', {})
            birth_data = latest_calc.get('birth_data', {})
            latest_kundli = {
                'kundli_id': result_summary.get('kundli_id'),
                'name': birth_data.get('name', 'Unknown'),
                'birth_date': f"{birth_data.get('year', '')}-{birth_data.get('month', '')}-{birth_data.get('day', '')}",
                'place': birth_data.get('place_name', 'Unknown'),
                'generation_date': latest_calc.get('created_at')
            }
        
        recent_calculations = []
        for calc in calculations:
            result_summary = calc.get('result_summary', {})
            birth_data = calc.get('birth_data', {})
            recent_calculations.append({
                'calculation_id': calc.get('calculation_id'),
                'kundli_id': result_summary.get('kundli_id'),
                'name': birth_data.get('name', 'Unknown'),
                'birth_date': f"{birth_data.get('year', '')}-{birth_data.get('month', '')}-{birth_data.get('day', '')}",
                'generation_date': calc.get('created_at')
            })
        
        print(f"[SESSION] Session loaded successfully")
        return {
            'user_profile': user_profile,
            'latest_kundli': latest_kundli,
            'recent_calculations': recent_calculations,
            'total_calculations': len(calculations)
        }
    
    except Exception as e:
        print(f"[SESSION] ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/dashboard/insights/{kundli_id}")
async def get_dashboard_insights(
    kundli_id: str,
    force_refresh: bool = False,
    current_user: dict = Depends(get_current_user)
):
    """
    Get or generate dashboard insights for a kundli
    
    Args:
        kundli_id: Kundli ID
        force_refresh: Force regenerate insights
        
    Returns:
        Dashboard insights with cards data
    """
    try:
        print(f"[INSIGHTS] Fetching insights for kundli_id: {kundli_id}, force_refresh: {force_refresh}")
        
        db = FirebaseConfig.get_db()
        
        if not force_refresh:
            try:
                insights_doc = db.collection('calculations').where('result_summary.kundli_id', '==', kundli_id).stream()
                for doc in insights_doc:
                    calc_data = doc.to_dict()
                    if calc_data.get('dashboard_insights'):
                        print(f"[INSIGHTS] Found cached insights")
                        return calc_data.get('dashboard_insights')
            except Exception as e:
                print(f"[INSIGHTS] Could not retrieve cached insights: {str(e)}")
        
        print(f"[INSIGHTS] Generating new insights for kundli_id: {kundli_id}")
        
        calculations = FirebaseService.get_user_calculations(current_user['uid'])
        kundli_data = None
        user_folder = None
        birth_data = None
        
        for calc in calculations:
            result_summary = calc.get('result_summary', {})
            if result_summary.get('kundli_id') == kundli_id:
                user_folder = result_summary.get('user_folder')
                birth_data = calc.get('birth_data', {})
                break
        
        if not user_folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Kundli {kundli_id} not found"
            )
        
        kundli_json_path = os.path.join(user_folder, f"{birth_data.get('name', 'User')}_Kundli.json")
        if os.path.exists(kundli_json_path):
            with open(kundli_json_path, 'r') as f:
                kundli_data = json.load(f)
        
        if not kundli_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kundli data not found"
            )
        
        if not gemini_service:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini service not available"
            )
        
        horoscope_info = kundli_data.get('horoscope_info', {})
        horoscope_text = json.dumps(horoscope_info, indent=2)[:3000]
        
        prompt = f"""Based on this Vedic astrology kundli data for {birth_data.get('name', 'the person')}, 
generate a JSON response with the following structure (return ONLY valid JSON):
{{
  "important_aspects": "2-3 sentences about key planetary positions and their significance",
  "good_times": "2-3 sentences about upcoming favorable periods based on planetary transits",
  "challenges": "2-3 sentences about potential challenges or cautions",
  "interesting_facts": "2-3 interesting astrological facts about this person's chart"
}}

Kundli Data:
{horoscope_text}

Birth Data: Name: {birth_data.get('name')}, Date: {birth_data.get('year')}-{birth_data.get('month')}-{birth_data.get('day')} {birth_data.get('hour')}:{birth_data.get('minute')}, Place: {birth_data.get('place_name')}"""
        
        response_text = gemini_service.generate_response(prompt)
        
        try:
            insights_json = json.loads(response_text)
        except json.JSONDecodeError:
            json_match = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_match >= 0 and json_end > json_match:
                insights_json = json.loads(response_text[json_match:json_end])
            else:
                insights_json = {
                    "important_aspects": "Unable to generate insights at this time",
                    "good_times": "Please try again later",
                    "challenges": "Please try again later",
                    "interesting_facts": "Please try again later"
                }
        
        insights_data = {
            'kundli_id': kundli_id,
            'generated_at': firestore.SERVER_TIMESTAMP,
            'important_aspects': insights_json.get('important_aspects', ''),
            'good_times': insights_json.get('good_times', ''),
            'challenges': insights_json.get('challenges', ''),
            'interesting_facts': insights_json.get('interesting_facts', '')
        }
        
        try:
            calculations = FirebaseService.get_user_calculations(current_user['uid'])
            for calc in calculations:
                result_summary = calc.get('result_summary', {})
                if result_summary.get('kundli_id') == kundli_id:
                    db.collection('calculations').document(calc.get('calculation_id')).update({
                        'dashboard_insights': insights_data
                    })
                    break
        except Exception as e:
            print(f"[INSIGHTS] Could not save insights to Firebase: {str(e)}")
        
        print(f"[INSIGHTS] Insights generated successfully")
        return insights_data
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[INSIGHTS] ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/api/analysis/generate")
async def generate_analysis(
    request: GenerateAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate AI analysis for kundli from local files
    
    Args:
        request: Analysis request with kundli ID and user folder
        
    Returns:
        Analysis result
    """
    try:
        print(f"[ANALYSIS] Generating analysis for kundli_id: {request.kundli_id}, user: {current_user.get('uid')}")
        
        # Get calculation metadata from Firebase to find user folder
        print(f"[ANALYSIS] Fetching user calculations...")
        calculations = FirebaseService.get_user_calculations(current_user['uid'])
        print(f"[ANALYSIS] Found {len(calculations)} calculations")
        
        user_folder = None
        birth_data = None
        
        for calc in calculations:
            result_summary = calc.get('result_summary', {})
            calc_kundli_id = result_summary.get('kundli_id')
            print(f"[ANALYSIS] Checking calculation with kundli_id: {calc_kundli_id}")
            
            if calc_kundli_id == request.kundli_id:
                user_folder = result_summary.get('user_folder')
                birth_data = calc.get('birth_data')
                print(f"[ANALYSIS] Found matching calculation")
                break
        
        if not user_folder or not birth_data:
            print(f"[ANALYSIS] Kundli metadata not found for ID: {request.kundli_id}")
            print(f"[ANALYSIS] Available kundli IDs: {[c.get('result_summary', {}).get('kundli_id') for c in calculations]}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kundli not found"
            )
        
        print(f"[ANALYSIS] Found user folder: {user_folder}")
        
        # Read kundli JSON from local file
        user_name = birth_data.get('name', 'User')
        kundli_json_path = file_manager.get_kundli_json_path(user_folder, user_name)
        
        if not kundli_json_path:
            print(f"[ANALYSIS] Kundli JSON file not found for user: {user_name}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kundli file not found"
            )
        
        kundli_data = file_manager.read_kundli_json(kundli_json_path)
        
        if not kundli_data:
            print(f"[ANALYSIS] Failed to read kundli data from file")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to read kundli data"
            )
        
        print(f"[ANALYSIS] Kundli data loaded from file: {kundli_json_path}")
        
        # Generate analysis using Gemini API
        if not gemini_service:
            print(f"[ANALYSIS] ERROR: Gemini service not initialized")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Gemini API key not configured. Please set GEMINI_API_KEY in environment variables."
            )
        
        print(f"[ANALYSIS] Generating analysis with Gemini API...")
        try:
            analysis_text = gemini_service.generate_analysis(
                kundli_data=kundli_data,
                user_name=user_name,
                analysis_type=request.analysis_type
            )
            print(f"[ANALYSIS] Analysis generated successfully")
        except Exception as e:
            print(f"[ANALYSIS] ERROR generating analysis: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate analysis: {str(e)}"
            )
        
        # Format analysis text for better presentation
        print(f"[ANALYSIS] Formatting analysis text...")
        formatted_analysis_text = AnalysisFormatter.format_analysis(analysis_text)
        
        # Save analysis text locally
        print(f"[ANALYSIS] Saving analysis locally...")
        analysis_text_path = file_manager.save_analysis_text(user_folder, user_name, formatted_analysis_text)
        print(f"[ANALYSIS] Analysis saved: {analysis_text_path}")
        
        # Generate PDF report
        print(f"[ANALYSIS] Generating PDF report...")
        try:
            pdf_content = PDFGenerator.generate_analysis_pdf(
                analysis_text=analysis_text,
                kundli_data=kundli_data,
                birth_data=birth_data,
                user_name=user_name
            )
            
            # Save PDF to file
            analysis_pdf_path = file_manager.save_analysis_pdf(user_folder, user_name, pdf_content)
            print(f"[ANALYSIS] PDF saved: {analysis_pdf_path}")
        except Exception as e:
            print(f"[ANALYSIS] Warning: Could not generate PDF: {str(e)}")
            analysis_pdf_path = None
        
        return {
            "analysis_id": request.kundli_id,
            "kundli_id": request.kundli_id,
            "status": "completed",
            "message": "Analysis generated successfully",
            "analysis_text": formatted_analysis_text,
            "analysis_text_path": analysis_text_path,
            "analysis_pdf_path": analysis_pdf_path
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ANALYSIS] ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/analysis/download/{kundli_id}")
async def download_analysis_pdf(
    kundli_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Download AI analysis as PDF
    
    Args:
        kundli_id: Kundli ID to download analysis for
        
    Returns:
        PDF file for download
    """
    try:
        print(f"[DOWNLOAD] Downloading analysis PDF for kundli_id: {kundli_id}, user: {current_user.get('uid')}")
        
        # Get calculation metadata from Firebase to find user folder
        calculations = FirebaseService.get_user_calculations(current_user['uid'])
        
        user_folder = None
        birth_data = None
        
        for calc in calculations:
            result_summary = calc.get('result_summary', {})
            calc_kundli_id = result_summary.get('kundli_id')
            
            if calc_kundli_id == kundli_id:
                user_folder = result_summary.get('user_folder')
                birth_data = calc.get('birth_data')
                break
        
        if not user_folder or not birth_data:
            print(f"[DOWNLOAD] Kundli not found for ID: {kundli_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kundli not found"
            )
        
        # Get PDF file path
        user_name = birth_data.get('name', 'User')
        pdf_filename = f"{user_name}_AI_Analysis.pdf"
        pdf_path = os.path.join(user_folder, "analysis", pdf_filename)
        
        if not os.path.exists(pdf_path):
            print(f"[DOWNLOAD] PDF file not found: {pdf_path}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis PDF not found. Please generate the analysis first."
            )
        
        print(f"[DOWNLOAD] Returning PDF file: {pdf_path}")
        
        # Return PDF file
        return FileResponse(
            path=pdf_path,
            filename=pdf_filename,
            media_type="application/pdf"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[DOWNLOAD] ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/api/chat/message")
async def send_chat_message(
    kundli_id: str,
    user_message: str,
    chat_history: List[Dict] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Send a chat message and get AI response about kundli
    
    Args:
        kundli_id: Kundli ID to chat about
        user_message: User's message
        chat_history: Previous chat messages
        
    Returns:
        AI response
    """
    try:
        print(f"[CHAT] Processing message for kundli_id: {kundli_id}, user: {current_user.get('uid')}")
        
        if not gemini_service:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini service not available"
            )
        
        calculations = FirebaseService.get_user_calculations(current_user['uid'])
        kundli_data = None
        user_folder = None
        birth_data = None
        
        for calc in calculations:
            result_summary = calc.get('result_summary', {})
            if result_summary.get('kundli_id') == kundli_id:
                user_folder = result_summary.get('user_folder')
                birth_data = calc.get('birth_data', {})
                break
        
        if not user_folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Kundli {kundli_id} not found"
            )
        
        kundli_json_path = os.path.join(user_folder, f"{birth_data.get('name', 'User')}_Kundli.json")
        if os.path.exists(kundli_json_path):
            with open(kundli_json_path, 'r') as f:
                kundli_data = json.load(f)
        
        if not kundli_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kundli data not found"
            )
        
        horoscope_info = kundli_data.get('horoscope_info', {})
        horoscope_text = json.dumps(horoscope_info, indent=2)[:2000]
        
        chat_context = f"""You are an expert Vedic astrology advisor. You have access to the following kundli (birth chart) data for {birth_data.get('name', 'the person')}:

Birth Information:
- Name: {birth_data.get('name')}
- Date: {birth_data.get('year')}-{birth_data.get('month')}-{birth_data.get('day')}
- Time: {birth_data.get('hour')}:{birth_data.get('minute')}
- Place: {birth_data.get('place_name')}
- Latitude: {birth_data.get('latitude')}
- Longitude: {birth_data.get('longitude')}

Kundli Data (Key Astrological Information):
{horoscope_text}

Please answer the user's question about their kundli with accurate astrological insights. Be specific, helpful, and reference the actual data from their chart when possible."""
        
        history_text = ""
        if chat_history:
            for msg in chat_history[-5:]:
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                history_text += f"{role.upper()}: {content}\n"
        
        full_prompt = f"""{chat_context}

Previous conversation:
{history_text}

User: {user_message}

Please provide a helpful and accurate response based on the kundli data provided."""
        
        response_text = gemini_service.generate_response(full_prompt)
        
        print(f"[CHAT] Response generated successfully")
        return {
            'kundli_id': kundli_id,
            'user_message': user_message,
            'response': response_text,
            'timestamp': firestore.SERVER_TIMESTAMP
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[CHAT] ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/chat/history/{kundli_id}")
async def get_chat_history(
    kundli_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get chat history for a kundli
    
    Args:
        kundli_id: Kundli ID
        
    Returns:
        Chat history messages
    """
    try:
        print(f"[CHAT_HISTORY] Fetching history for kundli_id: {kundli_id}, user: {current_user.get('uid')}")
        
        db = FirebaseConfig.get_db()
        
        try:
            history_docs = db.collection('chat_history')\
                .where('kundli_id', '==', kundli_id)\
                .where('user_id', '==', current_user['uid'])\
                .order_by('timestamp')\
                .stream()
            
            messages = []
            for doc in history_docs:
                msg = doc.to_dict()
                messages.append({
                    'role': msg.get('role'),
                    'content': msg.get('content'),
                    'timestamp': msg.get('timestamp')
                })
            
            print(f"[CHAT_HISTORY] Found {len(messages)} messages")
            return {
                'kundli_id': kundli_id,
                'messages': messages
            }
        except Exception as e:
            print(f"[CHAT_HISTORY] Could not retrieve from Firestore: {str(e)}")
            return {
                'kundli_id': kundli_id,
                'messages': []
            }
    
    except Exception as e:
        print(f"[CHAT_HISTORY] ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/api/cities/search")
async def search_cities(query: str = "") -> List[Dict]:
    """Search for cities by name or partial match"""
    try:
        cities_file = os.path.join(
            os.path.dirname(__file__),
            "..",
            "PyJHora",
            "jhora",
            "data",
            "world_cities_with_tz.csv"
        )
        
        if not os.path.exists(cities_file):
            raise HTTPException(status_code=404, detail="Cities database not found")
        
        results = []
        query_lower = query.lower().strip()
        
        with open(cities_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) >= 6:
                    country, city_name, lat, lon, tz_name, tz_offset = row[0], row[1], row[2], row[3], row[4], row[5]
                    
                    if query_lower and query_lower not in city_name.lower():
                        continue
                    
                    try:
                        results.append({
                            "name": f"{city_name},{country[:2]}",
                            "city": city_name,
                            "country": country,
                            "latitude": float(lat),
                            "longitude": float(lon),
                            "timezone": float(tz_offset),
                            "timezone_name": tz_name
                        })
                    except (ValueError, IndexError):
                        continue
                    
                    if len(results) >= 50:
                        break
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching cities: {str(e)}")


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False
    )
