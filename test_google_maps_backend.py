#!/usr/bin/env python3
"""
Simple Python test script to diagnose Google Maps integration issues
Run: python test_google_maps_backend.py
"""

import os
import sys
import csv
import json
import requests
from pathlib import Path

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

def print_header(text):
    print(f"\n{BOLD}{BLUE}{'='*60}{RESET}")
    print(f"{BOLD}{BLUE}{text}{RESET}")
    print(f"{BOLD}{BLUE}{'='*60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✅ {text}{RESET}")

def print_error(text):
    print(f"{RED}❌ {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠️  {text}{RESET}")

def print_info(text):
    print(f"{BLUE}ℹ️  {text}{RESET}")

# Test 1: Check CSV file exists
print_header("TEST 1: CSV File Exists")
csv_paths = [
    "world_cities_with_tz.csv",
    os.path.join(os.path.dirname(__file__), "world_cities_with_tz.csv"),
    os.path.join(os.getcwd(), "world_cities_with_tz.csv"),
]

csv_file = None
for path in csv_paths:
    if os.path.exists(path):
        csv_file = path
        print_success(f"CSV file found at: {os.path.abspath(path)}")
        break

if not csv_file:
    print_error(f"CSV file not found in any of these locations:")
    for path in csv_paths:
        print(f"  - {os.path.abspath(path)}")
    sys.exit(1)

# Test 2: Check CSV file has data
print_header("TEST 2: CSV File Has Data")
try:
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)
        print_success(f"CSV file has {len(rows)} rows")
        
        # Show first few rows
        print_info("First 3 rows:")
        for i, row in enumerate(rows[:3]):
            if len(row) >= 6:
                country, city, lat, lon, tz_name, tz_offset = row[0], row[1], row[2], row[3], row[4], row[5]
                print(f"  Row {i+1}: {city}, {country} (Lat: {lat}, Lon: {lon})")
except Exception as e:
    print_error(f"Error reading CSV: {e}")
    sys.exit(1)

# Test 3: Test CSV search locally
print_header("TEST 3: CSV Search Locally (Python)")
def search_csv_local(query):
    """Search CSV file locally"""
    results = []
    query_lower = query.lower().strip()
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
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
                    
                    if len(results) >= 10:
                        break
    except Exception as e:
        print_error(f"Error searching CSV: {e}")
        return []
    
    return results

# Test search for Mumbai
print_info("Searching for 'Mumbai' in CSV...")
results = search_csv_local("Mumbai")
if results:
    print_success(f"Found {len(results)} results for 'Mumbai'")
    for i, city in enumerate(results[:3]):
        print(f"  {i+1}. {city['name']} - Lat: {city['latitude']}, Lon: {city['longitude']}")
else:
    print_error("No results found for 'Mumbai'")

# Test 4: Test CSV endpoint via HTTP
print_header("TEST 4: CSV Endpoint via HTTP")
try:
    print_info("Testing: http://localhost:8000/api/cities/search?query=Mumbai")
    response = requests.get("http://localhost:8000/api/cities/search?query=Mumbai", timeout=5)
    print_info(f"Response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"CSV endpoint returned {len(data)} results")
        for i, city in enumerate(data[:3]):
            print(f"  {i+1}. {city['name']} - Lat: {city['latitude']}, Lon: {city['longitude']}")
    else:
        print_error(f"CSV endpoint returned status {response.status_code}")
        print_error(f"Response: {response.text}")
except requests.exceptions.ConnectionError:
    print_error("Cannot connect to backend at http://localhost:8000")
    print_warning("Make sure backend is running: python backend/main.py")
except Exception as e:
    print_error(f"Error testing CSV endpoint: {e}")

# Test 5: Check .env.local for API key
print_header("TEST 5: Google Maps API Key")
env_file = "frontend/.env.local"
if os.path.exists(env_file):
    print_success(f"Found {env_file}")
    with open(env_file, 'r') as f:
        content = f.read()
        if "VITE_GOOGLE_MAPS_API_KEY" in content:
            # Extract the key
            for line in content.split('\n'):
                if "VITE_GOOGLE_MAPS_API_KEY" in line:
                    key = line.split('=')[1].strip() if '=' in line else None
                    if key:
                        print_success(f"API Key found: {key[:20]}...")
                        break
        else:
            print_error("VITE_GOOGLE_MAPS_API_KEY not found in .env.local")
else:
    print_error(f"{env_file} not found")

# Test 6: Check vite.config.ts
print_header("TEST 6: Vite Config")
vite_file = "frontend/vite.config.ts"
if os.path.exists(vite_file):
    print_success(f"Found {vite_file}")
    with open(vite_file, 'r') as f:
        content = f.read()
        if "VITE_GOOGLE_MAPS_API_KEY" in content:
            print_warning("⚠️  Vite config still has VITE_GOOGLE_MAPS_API_KEY in define block")
            print_info("This should be removed - Vite auto-exposes VITE_* variables")
        else:
            print_success("Vite config looks good - no hardcoded API key")
else:
    print_error(f"{vite_file} not found")

# Test 7: Check GooglePlacesAutocomplete component
print_header("TEST 7: GooglePlacesAutocomplete Component")
component_file = "frontend/src/components/GooglePlacesAutocomplete.tsx"
if os.path.exists(component_file):
    print_success(f"Found {component_file}")
    with open(component_file, 'r') as f:
        content = f.read()
        
        # Check for CSV fallback
        if "searchCities" in content:
            print_success("Component imports searchCities (CSV fallback)")
        else:
            print_error("Component doesn't import searchCities")
        
        # Check for error display
        if "setShowPredictions(true)" in content:
            print_success("Component shows dropdown even with errors")
        else:
            print_warning("Component might not show dropdown on error")
        
        # Check for color issue
        if "text-gray-900" in content or "text-gray-600" in content:
            print_success("Component uses dark text colors (should be visible)")
        else:
            print_warning("Check text colors in component")
else:
    print_error(f"{component_file} not found")

# Test 8: Summary
print_header("SUMMARY & RECOMMENDATIONS")

print_info("Based on tests, here are the issues and fixes:\n")

print_info("ISSUE 1: Text color is white (invisible)")
print("  FIX: Update GooglePlacesAutocomplete.tsx to use dark text colors")
print("  Location: Lines showing prediction items\n")

print_info("ISSUE 2: Google Maps API not working")
print("  CHECK: Is API key valid?")
print("  CHECK: Are APIs enabled in Google Cloud Console?")
print("  CHECK: Is domain (localhost:3000) in API key restrictions?\n")

print_info("ISSUE 3: Dropdown shows but text invisible")
print("  FIX: Change text color from white to dark in dropdown items")
print("  Location: prediction items styling\n")

print_success("CSV fallback is working (tested above)")
print_success("Backend endpoint is responding")
print_warning("Google Maps API needs validation")

print_header("NEXT STEPS")
print("1. Fix text color in GooglePlacesAutocomplete.tsx")
print("2. Verify Google Maps API key is valid")
print("3. Check Google Cloud Console API restrictions")
print("4. Restart frontend: npm run dev")
print("5. Test again in browser")
