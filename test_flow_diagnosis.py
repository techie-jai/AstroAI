#!/usr/bin/env python3
"""
Diagnose the exact flow issue
"""

import requests
import json

print("=" * 70)
print("FLOW DIAGNOSIS: Google Maps vs CSV")
print("=" * 70)

# Simulate what happens in the component
print("\n1. Component Initialization")
print("-" * 70)
print("✓ Component mounts")
print("✓ Tries to load Google Maps API")
print("✓ If Google Maps fails → googleMapsReady = false")
print("✓ If Google Maps succeeds → googleMapsReady = true")

print("\n2. User Types 'Mumbai'")
print("-" * 70)
print("✓ handleInputChange called with 'Mumbai'")
print("✓ setLoading(true)")
print("✓ setError(null)")

print("\n3. Check if Google Maps Ready")
print("-" * 70)
print("? Is googleMapsReady true?")
print("  - If YES: Try Google Maps API first")
print("  - If NO: Skip to CSV search")

print("\n4. Try Google Maps API")
print("-" * 70)
print("? Does Google Maps return predictions?")
print("  - If YES: Show Google Maps results")
print("  - If NO: Fall back to CSV")

print("\n5. Fall Back to CSV")
print("-" * 70)
print("Testing CSV endpoint...")

try:
    response = requests.get("http://localhost:8000/api/cities/search?query=Mumbai", timeout=5)
    print(f"✓ CSV endpoint status: {response.status_code}")
    
    data = response.json()
    print(f"✓ CSV returned {len(data)} results")
    
    if data:
        print(f"✓ First result: {data[0]['city']}, {data[0]['country']}")
        print(f"✓ Latitude: {data[0]['latitude']}")
        print(f"✓ Longitude: {data[0]['longitude']}")
        
except Exception as e:
    print(f"✗ CSV endpoint error: {e}")

print("\n6. Convert CSV to Predictions")
print("-" * 70)
print("✓ Map CSV results to prediction format")
print("✓ Set main_text = city.city || city.name")
print("✓ Set secondary_text = city.country")
print("✓ Store csvData for later use")

print("\n7. Set Predictions State")
print("-" * 70)
print("✓ setPredictions(csvPredictions)")
print("✓ setShowPredictions(true)")
print("✓ setLoading(false)")

print("\n8. Render Dropdown")
print("-" * 70)
print("✓ Check if showPredictions === true")
print("✓ Check if predictions.length > 0")
print("✓ Map predictions and render buttons")
print("✓ Display main_text in each button")

print("\n" + "=" * 70)
print("POTENTIAL ISSUES")
print("=" * 70)

issues = [
    ("Google Maps loads but returns no results", "CSV should be triggered as fallback"),
    ("Google Maps fails to load", "CSV should be used immediately"),
    ("CSV endpoint not called", "Check if CSV search function is working"),
    ("CSV returns data but not displayed", "Check if predictions state is set"),
    ("Predictions state set but not rendered", "Check if showPredictions is true"),
    ("showPredictions true but text not visible", "Check if main_text is populated"),
]

for i, (issue, solution) in enumerate(issues, 1):
    print(f"\n{i}. {issue}")
    print(f"   → {solution}")

print("\n" + "=" * 70)
print("DEBUGGING STEPS")
print("=" * 70)

print("""
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type in location field
4. Look for these logs:
   - [GooglePlaces] Trying Google Maps API for: Mumbai
   - [GooglePlaces] Google Maps API error, falling back to CSV
   - [GooglePlaces] Using CSV search for: Mumbai
   - [GooglePlaces] CSV search returned: X results
   - [GooglePlaces] Showing X CSV predictions
   - [GooglePlaces] First prediction: {...}
   - [GooglePlaces] Rendering prediction 0: Mumbai, India India

5. If you see all these logs → Everything is working
6. If logs stop at some point → That's where the issue is
7. Check Network tab for /api/cities/search request
8. Verify response has data
""")

print("\n" + "=" * 70)
print("QUICK CHECK")
print("=" * 70)

# Test if the CSV endpoint is accessible
print("\nTesting CSV endpoint accessibility...")
try:
    response = requests.get("http://localhost:8000/api/cities/search?query=test", timeout=5)
    if response.status_code == 200:
        print("✅ CSV endpoint is accessible and returning data")
    else:
        print(f"❌ CSV endpoint returned status {response.status_code}")
except Exception as e:
    print(f"❌ Cannot reach CSV endpoint: {e}")
    print("   Make sure backend is running on port 8000")
