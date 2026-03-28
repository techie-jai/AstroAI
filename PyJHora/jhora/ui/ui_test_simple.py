#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Simple UI Test Script for PyJHora - No GUI display
"""

import sys
import os
import traceback

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("=" * 80)
print("PyJHora UI Simple Test (No GUI)")
print("=" * 80)

def test_all_imports():
    """Test all imports without creating UI"""
    print("\n[TEST] Testing all imports...")
    
    try:
        print("  1. PyQt6...")
        from PyQt6.QtWidgets import QApplication
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        return False
    
    try:
        print("  2. jhora.const...")
        from jhora import const
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  3. jhora.utils...")
        from jhora import utils
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  4. jhora.panchanga.drik...")
        from jhora.panchanga import drik
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  5. jhora.ui.test (VedicCalendar)...")
        from jhora.ui.test import VedicCalendar
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  6. jhora.ui.test1 (PanchangaInfoDialog)...")
        from jhora.ui.test1 import PanchangaInfoDialog
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  7. jhora.ui.horo_chart_tabs (ChartTabbed)...")
        from jhora.ui.horo_chart_tabs import ChartTabbed
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    return True

def test_instantiation():
    """Test instantiating UI classes without showing them"""
    print("\n[TEST] Testing UI class instantiation (no display)...")
    
    try:
        print("  1. Creating QApplication...")
        from PyQt6.QtWidgets import QApplication
        # Check if QApplication already exists
        app = QApplication.instance()
        if app is None:
            app = QApplication(sys.argv)
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  2. Instantiating ChartTabbed...")
        from jhora.ui.horo_chart_tabs import ChartTabbed
        chart = ChartTabbed()
        print("     ✓ Success - ChartTabbed created")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  3. Setting language...")
        chart.language('English')
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  4. Setting chart data...")
        chart.name('Test User')
        chart.gender(1)
        chart.date_of_birth('1996,12,7')
        chart.time_of_birth('10:34:00')
        chart.place('Chennai,India', 13.0878, 80.2785, 5.5)
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  5. Computing horoscope...")
        chart.compute_horoscope()
        print("     ✓ Success")
    except Exception as e:
        print(f"     ✗ Failed: {e}")
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    try:
        if test_all_imports():
            print("\n" + "=" * 80)
            print("All imports successful!")
            print("=" * 80)
            
            if test_instantiation():
                print("\n" + "=" * 80)
                print("SUCCESS: UI can be created and used!")
                print("=" * 80)
                print("\nThe UI is working. To actually display it, run:")
                print("  python -m jhora.ui.horo_chart_tabs")
            else:
                print("\n" + "=" * 80)
                print("FAILURE: UI instantiation failed")
                print("=" * 80)
        else:
            print("\n" + "=" * 80)
            print("FAILURE: Import errors detected")
            print("=" * 80)
    except Exception as e:
        print("\n" + "=" * 80)
        print("FATAL ERROR:")
        print("=" * 80)
        print(f"{e}")
        traceback.print_exc()
