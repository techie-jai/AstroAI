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
from auth import verify_token, get_current_user

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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

astrology_service = AstrologyService()


# Initialize Firebase on module load
try:
    FirebaseConfig.initialize()
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"⚠️ Firebase initialization warning: {str(e)}")


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
    Generate kundli from birth data
    
    Args:
        request: Birth data and generation options
        
    Returns:
        Generated kundli data
    """
    try:
        print(f"[KUNDLI] Starting generation for user: {current_user.get('uid')}")
        birth_data_dict = request.birth_data.dict()
        print(f"[KUNDLI] Birth data: {birth_data_dict}")
        
        result = astrology_service.generate_kundli(birth_data_dict)
        print(f"[KUNDLI] Generation result: success={result.get('success')}")
        
        if not result.get('success'):
            error_msg = result.get('error', 'Failed to generate kundli')
            print(f"[KUNDLI] Generation failed: {error_msg}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        kundli_id = result['kundli_id']
        print(f"[KUNDLI] Generated kundli_id: {kundli_id}")
        
        calculation_data = {
            'birth_data': birth_data_dict,
            'chart_types': request.chart_types or ['D1', 'D7', 'D9', 'D10'],
            'result_summary': {
                'kundli_id': kundli_id,
                'generated_at': result['generated_at']
            }
        }
        
        print(f"[KUNDLI] Saving calculation to Firebase...")
        saved_id = FirebaseService.save_calculation(current_user['uid'], calculation_data)
        print(f"[KUNDLI] Calculation saved: {saved_id}")
        
        print(f"[KUNDLI] Saving kundli data to Firestore...")
        db = firestore.client()
        db.collection('kundlis').document(kundli_id).set({
            'user_id': current_user['uid'],
            'birth_data': birth_data_dict,
            'horoscope_info': result['data'].get('horoscope_info', {}),
            'generated_at': result['generated_at'],
            'calculation_id': saved_id
        })
        print(f"[KUNDLI] Kundli data saved")
        
        print(f"[KUNDLI] Ensuring user profile exists...")
        user_profile = FirebaseService.get_user_profile(current_user['uid'])
        if not user_profile:
            print(f"[KUNDLI] User profile doesn't exist, creating...")
            FirebaseService.create_user_profile(
                current_user['uid'],
                current_user.get('email', ''),
                current_user.get('display_name')
            )
        
        print(f"[KUNDLI] Updating user profile...")
        FirebaseService.update_user_profile(
            current_user['uid'],
            {'total_calculations': Increment(1)}
        )
        print(f"[KUNDLI] User profile updated")
        
        response_data = {
            "kundli_id": kundli_id,
            "calculation_id": saved_id,
            "birth_data": birth_data_dict,
            "generated_at": result['generated_at'],
            "horoscope_info_keys": list(result['data'].get('horoscope_info', {}).keys())[:10]
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
    Get stored kundli data
    
    Args:
        kundli_id: Kundli ID
        
    Returns:
        Kundli data
    """
    try:
        print(f"[GET_KUNDLI] Fetching kundli: {kundli_id} for user: {current_user.get('uid')}")
        db = firestore.client()
        
        # Try to get from kundlis collection
        kundli_doc = db.collection('kundlis').document(kundli_id).get()
        
        if kundli_doc.exists:
            kundli_data = kundli_doc.to_dict()
            print(f"[GET_KUNDLI] Found kundli in kundlis collection")
            
            # Verify ownership
            if kundli_data.get('user_id') != current_user['uid']:
                print(f"[GET_KUNDLI] Unauthorized access attempt")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized"
                )
            
            return {
                "kundli_id": kundli_id,
                "birth_data": kundli_data.get('birth_data'),
                "horoscope_info": kundli_data.get('horoscope_info', {}),
                "generated_at": kundli_data.get('generated_at'),
                "calculation_id": kundli_data.get('calculation_id')
            }
        
        print(f"[GET_KUNDLI] Kundli not found: {kundli_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kundli not found"
        )
    
    except Exception as e:
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
    Generate AI analysis for kundli
    
    Args:
        request: Analysis request with kundli ID
        
    Returns:
        Analysis result
    """
    try:
        calculations = FirebaseService.get_user_calculations(current_user['uid'])
        
        # Find the calculation with matching kundli_id
        birth_data = None
        for calc in calculations:
            if calc.get('result_summary', {}).get('kundli_id') == request.kundli_id:
                birth_data = calc.get('birth_data')
                break
        
        if not birth_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kundli not found"
            )
        
        # Generate kundli data for analysis
        kundli_result = astrology_service.generate_kundli(birth_data)
        
        if not kundli_result.get('success'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to generate kundli for analysis"
            )
        
        # Create analysis data
        analysis_data = {
            'analysis_text': 'Analysis generated successfully',
            'analysis_type': request.analysis_type,
            'kundli_data': kundli_result.get('data'),
            'pdf_path': None
        }
        
        analysis_id = FirebaseService.save_analysis(
            current_user['uid'],
            request.kundli_id,
            analysis_data
        )
        
        if not analysis_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save analysis"
            )
        
        return {
            "analysis_id": analysis_id,
            "kundli_id": request.kundli_id,
            "status": "completed",
            "message": "Analysis generated successfully",
            "kundli_data": kundli_result.get('data')
        }
    
    except Exception as e:
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
        reload=True
    )
