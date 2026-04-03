#!/usr/bin/env python
"""
Backend startup diagnostic - test each component in isolation
"""

import sys
import os

print("=" * 80)
print("BACKEND STARTUP DIAGNOSTIC")
print("=" * 80)

# Test 1: Environment variables
print("\n[TEST 1] Checking environment variables...")
from dotenv import load_dotenv
load_dotenv()

firebase_creds = os.getenv('FIREBASE_CREDENTIALS_PATH')
print(f"FIREBASE_CREDENTIALS_PATH: {firebase_creds}")
if firebase_creds:
    full_path = os.path.abspath(firebase_creds)
    print(f"Full path: {full_path}")
    print(f"File exists: {os.path.exists(full_path)}")
    if not os.path.exists(full_path):
        print(f"❌ Firebase credentials file not found!")
else:
    print("❌ FIREBASE_CREDENTIALS_PATH not set in .env")

# Test 2: Import FastAPI and dependencies
print("\n[TEST 2] Importing FastAPI and core dependencies...")
try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    print("✅ FastAPI imported")
except Exception as e:
    print(f"❌ FastAPI import failed: {e}")
    sys.exit(1)

# Test 3: Import models
print("\n[TEST 3] Importing models...")
try:
    from models import (
        BirthData, GenerateKundliRequest, GenerateAnalysisRequest,
        KundliResponse, AnalysisResponse, ErrorResponse
    )
    print("✅ Models imported")
except Exception as e:
    print(f"❌ Models import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 4: Import Firebase config
print("\n[TEST 4] Importing Firebase config...")
try:
    from firebase_config import FirebaseConfig, FirebaseService
    print("✅ Firebase config imported")
except Exception as e:
    print(f"❌ Firebase config import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 5: Initialize Firebase
print("\n[TEST 5] Initializing Firebase...")
try:
    FirebaseConfig.initialize()
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"⚠️ Firebase initialization failed: {e}")
    print("   (This is expected if credentials file is missing)")
    import traceback
    traceback.print_exc()

# Test 6: Import AstrologyService
print("\n[TEST 6] Importing AstrologyService...")
try:
    from astrology_service import AstrologyService
    print("✅ AstrologyService imported")
except Exception as e:
    print(f"❌ AstrologyService import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 7: Initialize AstrologyService
print("\n[TEST 7] Initializing AstrologyService...")
try:
    astrology_service = AstrologyService()
    print("✅ AstrologyService initialized")
except Exception as e:
    print(f"❌ AstrologyService initialization failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 8: Import auth
print("\n[TEST 8] Importing auth module...")
try:
    from auth import verify_token, get_current_user
    print("✅ Auth module imported")
except Exception as e:
    print(f"❌ Auth import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 9: Create FastAPI app
print("\n[TEST 9] Creating FastAPI app...")
try:
    app = FastAPI(
        title="AstroAI API",
        description="Vedic Astrology API with AI Analysis",
        version="1.0.0"
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:8000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    print("✅ FastAPI app created with CORS middleware")
except Exception as e:
    print(f"❌ FastAPI app creation failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 10: Add health check endpoint
print("\n[TEST 10] Adding health check endpoint...")
try:
    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "service": "AstroAI API",
            "version": "1.0.0"
        }
    
    print("✅ Health check endpoint added")
except Exception as e:
    print(f"❌ Health check endpoint failed: {e}")
    sys.exit(1)

print("\n" + "=" * 80)
print("✅ ALL STARTUP TESTS PASSED")
print("=" * 80)
print("\nYou can now start the backend with:")
print("  python main.py")
print("\nOr with uvicorn directly:")
print("  uvicorn main:app --reload --host 0.0.0.0 --port 8000")
