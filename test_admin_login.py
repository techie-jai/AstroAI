#!/usr/bin/env python
"""
Test script to verify admin panel login credentials
"""

import os
import sys
import requests
import json
from dotenv import load_dotenv

load_dotenv()

# Configuration
BACKEND_URL = "http://localhost:8000"
ADMIN_EMAIL = "admin@kendraa.ai"
ADMIN_PASSWORD = "Gr@3691215"

# Firebase config
FIREBASE_API_KEY = os.getenv('VITE_FIREBASE_API_KEY')
FIREBASE_AUTH_DOMAIN = os.getenv('VITE_FIREBASE_AUTH_DOMAIN')
FIREBASE_PROJECT_ID = os.getenv('VITE_FIREBASE_PROJECT_ID')

print("=" * 80)
print("ADMIN PANEL LOGIN TEST")
print("=" * 80)
print()

# Step 1: Check Firebase config
print("1. Checking Firebase Configuration...")
print(f"   Project ID: {FIREBASE_PROJECT_ID}")
print(f"   Auth Domain: {FIREBASE_AUTH_DOMAIN}")
print(f"   API Key: {FIREBASE_API_KEY[:20]}..." if FIREBASE_API_KEY else "   API Key: NOT SET")
print()

# Step 2: Test Firebase Authentication
print("2. Testing Firebase Authentication...")
print(f"   Email: {ADMIN_EMAIL}")
print(f"   Password: {'*' * len(ADMIN_PASSWORD)}")
print()

try:
    # Use Firebase REST API to get ID token
    auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    
    auth_payload = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "returnSecureToken": True
    }
    
    print(f"   Sending request to: {auth_url}")
    response = requests.post(auth_url, json=auth_payload)
    
    if response.status_code == 200:
        auth_data = response.json()
        id_token = auth_data.get('idToken')
        user_id = auth_data.get('localId')
        
        print(f"   ✅ Firebase Authentication Successful!")
        print(f"   User ID: {user_id}")
        print(f"   ID Token: {id_token[:50]}...")
        print()
        
        # Step 3: Verify admin token with backend
        print("3. Verifying Admin Token with Backend...")
        print(f"   Backend URL: {BACKEND_URL}/api/admin/auth/verify")
        
        headers = {
            "Authorization": f"Bearer {id_token}",
            "Content-Type": "application/json"
        }
        
        verify_response = requests.post(
            f"{BACKEND_URL}/api/admin/auth/verify",
            headers=headers
        )
        
        if verify_response.status_code == 200:
            verify_data = verify_response.json()
            print(f"   ✅ Admin Verification Successful!")
            print(f"   Response: {json.dumps(verify_data, indent=2)}")
            print()
            print("=" * 80)
            print("✅ LOGIN TEST PASSED - Admin credentials are valid!")
            print("=" * 80)
        else:
            print(f"   ❌ Admin Verification Failed!")
            print(f"   Status Code: {verify_response.status_code}")
            print(f"   Response: {verify_response.text}")
            print()
            print("=" * 80)
            print("❌ LOGIN TEST FAILED - User does not have admin privileges")
            print("=" * 80)
            sys.exit(1)
            
    else:
        error_data = response.json()
        error_msg = error_data.get('error', {}).get('message', 'Unknown error')
        print(f"   ❌ Firebase Authentication Failed!")
        print(f"   Status Code: {response.status_code}")
        print(f"   Error: {error_msg}")
        print()
        print("=" * 80)
        print(f"❌ LOGIN TEST FAILED - {error_msg}")
        print("=" * 80)
        sys.exit(1)
        
except requests.exceptions.ConnectionError as e:
    print(f"   ❌ Connection Error: {str(e)}")
    print()
    print("=" * 80)
    print("❌ LOGIN TEST FAILED - Cannot connect to backend")
    print("   Make sure Docker containers are running: docker compose up -d")
    print("=" * 80)
    sys.exit(1)
    
except Exception as e:
    print(f"   ❌ Error: {str(e)}")
    print()
    print("=" * 80)
    print(f"❌ LOGIN TEST FAILED - {str(e)}")
    print("=" * 80)
    sys.exit(1)
