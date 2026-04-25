#!/usr/bin/env python3
"""
Complete test of the Google Maps CSV fallback flow
"""

import requests
import json

print("=" * 70)
print("COMPLETE GOOGLE MAPS CSV FALLBACK TEST")
print("=" * 70)

# Test 1: Backend CSV endpoint
print("\n1. Testing Backend CSV Endpoint")
print("-" * 70)
try:
    response = requests.get("http://localhost:8000/api/cities/search?query=Mumbai", timeout=5)
    print(f"✅ Backend responding: Status {response.status_code}")
    
    data = response.json()
    print(f"✅ CSV returned {len(data)} results")
    
    if data:
        first = data[0]
        print(f"\n   First result:")
        print(f"   - name: {first.get('name')}")
        print(f"   - city: {first.get('city')}")
        print(f"   - country: {first.get('country')}")
        print(f"   - latitude: {first.get('latitude')}")
        print(f"   - longitude: {first.get('longitude')}")
        
        # Simulate what component does
        print(f"\n   Component will display:")
        print(f"   - main_text: {first.get('city') or first.get('name')}")
        print(f"   - secondary_text: {first.get('country')}")
        
except Exception as e:
    print(f"❌ Error: {e}")

# Test 2: Simulate component conversion
print("\n\n2. Simulating Component Conversion")
print("-" * 70)
try:
    response = requests.get("http://localhost:8000/api/cities/search?query=Delhi", timeout=5)
    csv_results = response.json()
    
    # This is what the component does
    csv_predictions = [
        {
            "place_id": f"csv_{idx}_{city['city']}",
            "description": city['name'],
            "main_text": city['city'] or city['name'],
            "secondary_text": city['country'],
            "csvData": city,
        }
        for idx, city in enumerate(csv_results)
    ]
    
    print(f"✅ Converted {len(csv_predictions)} CSV results to predictions")
    
    if csv_predictions:
        pred = csv_predictions[0]
        print(f"\n   First prediction object:")
        print(f"   - place_id: {pred['place_id']}")
        print(f"   - main_text: '{pred['main_text']}'")
        print(f"   - secondary_text: '{pred['secondary_text']}'")
        print(f"   - csvData: {pred['csvData']}")
        
        # Check if main_text is empty
        if pred['main_text']:
            print(f"\n   ✅ main_text is NOT empty: '{pred['main_text']}'")
        else:
            print(f"\n   ❌ main_text IS EMPTY!")
            
except Exception as e:
    print(f"❌ Error: {e}")

# Test 3: Test multiple queries
print("\n\n3. Testing Multiple Queries")
print("-" * 70)
queries = ["Mumbai", "Delhi", "Hospital", "Airport", "New York"]

for query in queries:
    try:
        response = requests.get(f"http://localhost:8000/api/cities/search?query={query}", timeout=5)
        data = response.json()
        
        if data:
            first = data[0]
            main_text = first.get('city') or first.get('name')
            print(f"✅ '{query}' → Found: '{main_text}' ({len(data)} results)")
        else:
            print(f"⚠️  '{query}' → No results")
            
    except Exception as e:
        print(f"❌ '{query}' → Error: {e}")

print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
print("""
If all tests show ✅:
1. Backend CSV endpoint is working
2. Data is being returned correctly
3. Component conversion is correct
4. main_text should be visible in dropdown

If you still don't see text in dropdown:
1. Check browser console for errors
2. Check if predictions are being set
3. Verify React is rendering the component
4. Check CSS is not hiding the text
""")
