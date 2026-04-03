import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from typing import Optional
from firebase_admin import firestore
from google.cloud.firestore import Increment

from models import (
    BirthData, GenerateKundliRequest, GenerateAnalysisRequest,
    KundliResponse, AnalysisResponse, ErrorResponse
)
from firebase_config import FirebaseConfig, FirebaseService
from astrology_service import AstrologyService
from gemini_service import GeminiService
from auth import verify_token, get_current_user
from file_manager import FileManager

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
async def create_user_profile(
    token: str,
    display_name: Optional[str] = None
):
    """
    Create user profile after authentication
    
    Args:
        token: Firebase ID token
        display_name: Optional display name
        
    Returns:
        User profile information
    """
    decoded = FirebaseService.verify_token(token)
    if not decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    uid = decoded['uid']
    email = decoded.get('email')
    
    success = FirebaseService.create_user_profile(uid, email, display_name)
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
    Get stored kundli data from local files
    
    Args:
        kundli_id: Kundli ID
        
    Returns:
        Kundli data
    """
    try:
        print(f"[GET_KUNDLI] Fetching kundli: {kundli_id} for user: {current_user.get('uid')}")
        
        # Get calculation metadata from Firebase to find user folder
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
        
        kundli_data = file_manager.read_kundli_json(kundli_json_path)
        
        if not kundli_data:
            print(f"[GET_KUNDLI] Failed to read kundli data from file")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to read kundli data"
            )
        
        print(f"[GET_KUNDLI] Kundli data loaded from file: {kundli_json_path}")
        
        return {
            "kundli_id": kundli_id,
            "birth_data": birth_data,
            "horoscope_info": kundli_data.get('horoscope_info', {}),
            "generated_at": kundli_data.get('generated_at'),
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
        
        # Save analysis text locally
        print(f"[ANALYSIS] Saving analysis locally...")
        analysis_text_path = file_manager.save_analysis_text(user_folder, user_name, analysis_text)
        print(f"[ANALYSIS] Analysis saved: {analysis_text_path}")
        
        return {
            "analysis_id": request.kundli_id,
            "kundli_id": request.kundli_id,
            "status": "completed",
            "message": "Analysis generated successfully",
            "analysis_text": analysis_text,
            "analysis_text_path": analysis_text_path
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


@app.get("/api/charts/available")
async def get_available_charts():
    """
    Get list of available divisional charts
    
    Returns:
        List of available chart types
    """
    from astro_chart_api import AstroChartAPI
    
    charts = []
    for chart_type, (factor, name, signification) in AstroChartAPI.CHART_TYPES.items():
        charts.append({
            "type": chart_type,
            "factor": factor,
            "name": name,
            "signification": signification
        })
    
    return {
        "total": len(charts),
        "charts": charts
    }


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
