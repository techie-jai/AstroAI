#!/usr/bin/env python3
"""Test API response for dasha analysis"""

import requests
import json

# Get a kundli ID from the index
with open('kundli_index.json', 'r') as f:
    index = json.load(f)

# Get first kundli ID
kundli_id = list(index.keys())[0]
print(f"Testing with kundli_id: {kundli_id}")

# Call the API
try:
    response = requests.post(
        f'http://localhost:8000/api/analysis/{kundli_id}',
        headers={'Authorization': 'Bearer test-token'}  # You may need to adjust this
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        
        # Check if active_dashas is present
        if 'active_dashas' in data:
            print("\n✓ active_dashas found in response")
            active_dashas = data['active_dashas']
            
            if 'current_mahadasha' in active_dashas:
                maha = active_dashas['current_mahadasha']
                if maha:
                    print(f"  ✓ Mahadasha: {maha.get('planet')}")
                else:
                    print("  ✗ Mahadasha is null")
            else:
                print("  ✗ current_mahadasha key missing")
            
            if 'current_antardasha' in active_dashas:
                antar = active_dashas['current_antardasha']
                if antar:
                    print(f"  ✓ Antardasha: {antar.get('planet')}")
                else:
                    print("  ✗ Antardasha is null")
            else:
                print("  ✗ current_antardasha key missing")
            
            if 'dasha_alerts' in active_dashas:
                alerts = active_dashas['dasha_alerts']
                print(f"  ✓ Alerts: {alerts.get('alert_description')}")
            else:
                print("  ✗ dasha_alerts key missing")
        else:
            print("\n✗ active_dashas NOT found in response")
            print("Available keys:", list(data.keys()))
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Error: {e}")
