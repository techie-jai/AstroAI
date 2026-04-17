#!/usr/bin/env python3
"""Test script to verify dasha data extraction from kundli.json"""

import json
import os
import sys
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from timeline import TimelineEngine

# Find a test kundli file
test_kundli_path = "users/20260414_214550_383afb8e-Check_Dosh/kundli/Check-Dosh_comprehensive_kundli.json"

if not os.path.exists(test_kundli_path):
    print(f"❌ Test kundli not found at {test_kundli_path}")
    exit(1)

# Load the kundli
with open(test_kundli_path, 'r') as f:
    kundli_data = json.load(f)

print("=" * 80)
print("DASHA DATA EXTRACTION TEST")
print("=" * 80)

# Initialize timeline engine
timeline = TimelineEngine()

# Test 1: Check if dasha data exists
print("\n1. Checking dasha data structure...")
jyotishganit_dashas = kundli_data.get("jyotishganit_json", {}).get("dashas", {})
root_dashas = kundli_data.get("dashas", {})

if jyotishganit_dashas:
    print("   ✓ Found dashas in jyotishganit_json")
    mahadashas = jyotishganit_dashas.get("all", {}).get("mahadashas", {})
    print(f"   ✓ Found {len(mahadashas)} mahadashas")
else:
    print("   ✗ No dashas in jyotishganit_json")

if root_dashas:
    print("   ✓ Found dashas at root level")
else:
    print("   ✗ No dashas at root level")

# Test 2: Get current dasha
print("\n2. Testing get_current_dasha()...")
today = datetime.now()
current_maha, current_antar = timeline.get_current_dasha(kundli_data, today)

if current_maha:
    print(f"   ✓ Current Mahadasha: {current_maha.planet}")
    print(f"     Start: {current_maha.start_date}")
    print(f"     End: {current_maha.end_date}")
    print(f"     Progress: {current_maha.progress_percent:.1f}%")
    print(f"     Days Remaining: {current_maha.days_remaining}")
else:
    print("   ✗ No current Mahadasha found")

if current_antar:
    print(f"   ✓ Current Antardasha: {current_antar.planet}")
    print(f"     Start: {current_antar.start_date}")
    print(f"     End: {current_antar.end_date}")
    print(f"     Progress: {current_antar.progress_percent:.1f}%")
    print(f"     Days Remaining: {current_antar.days_remaining}")
else:
    print("   ✗ No current Antardasha found")

# Test 3: Get active dashas with alerts
print("\n3. Testing get_active_dashas()...")
active_dashas = timeline.get_active_dashas(kundli_data, today)

if active_dashas:
    print("   ✓ Active dashas retrieved")
    print(f"   ✓ Maraka dasha: {active_dashas.dasha_alerts.is_maraka_dasha}")
    print(f"   ✓ Dusthana dasha: {active_dashas.dasha_alerts.is_dusthana_dasha}")
    print(f"   ✓ Rahu/Ketu dasha: {active_dashas.dasha_alerts.is_rahu_ketu_dasha}")
    print(f"   ✓ Alert: {active_dashas.dasha_alerts.alert_description}")
else:
    print("   ✗ Failed to get active dashas")

# Test 4: Check horoscope info
print("\n4. Checking horoscope_info for house lords...")
horoscope_info = kundli_data.get("horoscope_info", {})
house_lords = {}
for i in [2, 6, 7, 8, 12]:
    lord = horoscope_info.get(f"house_{i}_lord")
    if lord:
        house_lords[i] = lord
        print(f"   ✓ House {i} lord: {lord}")
    else:
        print(f"   ✗ House {i} lord not found")

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
