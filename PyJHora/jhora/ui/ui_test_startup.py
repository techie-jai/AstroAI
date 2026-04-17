#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
UI Startup Test Script for PyJHora
This script attempts to start the PyJHora UI and captures detailed error information
"""

import sys
import os
import traceback

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)
    print(f"Added to Python path: {pyjhora_root}")

print("=" * 80)
print("PyJHora UI Startup Test")
print("=" * 80)

def test_imports():
    """Test all required imports"""
    print("\n[TEST 1] Testing imports...")
    errors = []
    
    try:
        print("  - Importing PyQt6...")
        from PyQt6.QtWidgets import QApplication, QWidget
        from PyQt6.QtCore import Qt
        print("    ✓ PyQt6 imported successfully")
    except Exception as e:
        errors.append(f"PyQt6 import failed: {e}")
        print(f"    ✗ PyQt6 import failed: {e}")
    
    try:
        print("  - Importing jhora.const...")
        from jhora import const
        print("    ✓ jhora.const imported successfully")
    except Exception as e:
        errors.append(f"jhora.const import failed: {e}")
        print(f"    ✗ jhora.const import failed: {e}")
    
    try:
        print("  - Importing jhora.utils...")
        from jhora import utils
        print("    ✓ jhora.utils imported successfully")
    except Exception as e:
        errors.append(f"jhora.utils import failed: {e}")
        print(f"    ✗ jhora.utils import failed: {e}")
    
    try:
        print("  - Importing jhora.panchanga.drik...")
        from jhora.panchanga import drik
        print("    ✓ jhora.panchanga.drik imported successfully")
    except Exception as e:
        errors.append(f"jhora.panchanga.drik import failed: {e}")
        print(f"    ✗ jhora.panchanga.drik import failed: {e}")
    
    try:
        print("  - Importing jhora.ui.horo_chart_tabs...")
        from jhora.ui.horo_chart_tabs import ChartTabbed
        print("    ✓ jhora.ui.horo_chart_tabs imported successfully")
    except Exception as e:
        errors.append(f"jhora.ui.horo_chart_tabs import failed: {e}")
        print(f"    ✗ jhora.ui.horo_chart_tabs import failed: {e}")
        traceback.print_exc()
    
    return errors

def test_simple_ui():
    """Test creating a simple PyQt6 window"""
    print("\n[TEST 2] Testing simple PyQt6 window creation...")
    try:
        from PyQt6.QtWidgets import QApplication, QWidget, QLabel
        app = QApplication(sys.argv)
        window = QWidget()
        window.setWindowTitle("Test Window")
        label = QLabel("Test Label", window)
        print("    ✓ Simple PyQt6 window created successfully")
        return True
    except Exception as e:
        print(f"    ✗ Simple PyQt6 window creation failed: {e}")
        traceback.print_exc()
        return False

def test_vedic_calendar():
    """Test the simpler VedicCalendar UI"""
    print("\n[TEST 3] Testing VedicCalendar UI...")
    try:
        from PyQt6.QtWidgets import QApplication
        from jhora.ui.test import VedicCalendar
        from jhora.panchanga import drik
        
        app = QApplication(sys.argv)
        calendar = VedicCalendar(start_date=None, place=None, language='English')
        print("    ✓ VedicCalendar UI created successfully")
        return True, calendar
    except Exception as e:
        print(f"    ✗ VedicCalendar UI creation failed: {e}")
        traceback.print_exc()
        return False, None

def test_panchanga_dialog():
    """Test the PanchangaInfoDialog UI"""
    print("\n[TEST 4] Testing PanchangaInfoDialog UI...")
    try:
        from PyQt6.QtWidgets import QApplication
        from jhora.ui.test1 import PanchangaInfoDialog
        from jhora.panchanga import drik
        from jhora import utils
        
        app = QApplication(sys.argv)
        dob = drik.Date(1996, 12, 7)
        tob = (10, 34, 0)
        place = drik.Place('Chennai,India', 13.0878, 80.2785, 5.5)
        jd = utils.julian_day_number(dob, tob)
        
        dialog = PanchangaInfoDialog(language='English', jd=jd, place=place)
        print("    ✓ PanchangaInfoDialog UI created successfully")
        return True, dialog
    except Exception as e:
        print(f"    ✗ PanchangaInfoDialog UI creation failed: {e}")
        traceback.print_exc()
        return False, None

def test_main_chart_ui():
    """Test the main ChartTabbed UI"""
    print("\n[TEST 5] Testing ChartTabbed (Main UI)...")
    try:
        from PyQt6.QtWidgets import QApplication
        from jhora.ui.horo_chart_tabs import ChartTabbed
        
        app = QApplication(sys.argv)
        chart = ChartTabbed()
        print("    ✓ ChartTabbed UI created successfully")
        
        print("  - Setting language to Tamil...")
        chart.language('Tamil')
        print("    ✓ Language set successfully")
        
        print("  - Setting chart data...")
        chart.name('Test User')
        chart.gender(1)
        chart.date_of_birth('1996,12,7')
        chart.time_of_birth('10:34:00')
        chart.place('Chennai,India', 13.0878, 80.2785, 5.5)
        print("    ✓ Chart data set successfully")
        
        print("  - Computing horoscope...")
        chart.compute_horoscope()
        print("    ✓ Horoscope computed successfully")
        
        return True, chart
    except Exception as e:
        print(f"    ✗ ChartTabbed UI creation/operation failed: {e}")
        traceback.print_exc()
        return False, None

def main():
    """Run all tests"""
    print("\nStarting PyJHora UI diagnostic tests...\n")
    
    # Test 1: Imports
    import_errors = test_imports()
    if import_errors:
        print("\n" + "=" * 80)
        print("CRITICAL: Import errors detected. Cannot proceed with UI tests.")
        print("=" * 80)
        for error in import_errors:
            print(f"  - {error}")
        return
    
    # Test 2: Simple UI
    if not test_simple_ui():
        print("\n" + "=" * 80)
        print("CRITICAL: Basic PyQt6 functionality failed.")
        print("=" * 80)
        return
    
    # Test 3: VedicCalendar
    success, calendar = test_vedic_calendar()
    if success:
        print("\n[INFO] VedicCalendar can be used as a working UI alternative")
    
    # Test 4: PanchangaInfoDialog
    success, dialog = test_panchanga_dialog()
    if success:
        print("\n[INFO] PanchangaInfoDialog can be used as a working UI alternative")
    
    # Test 5: Main ChartTabbed UI
    success, chart = test_main_chart_ui()
    if success:
        print("\n" + "=" * 80)
        print("SUCCESS: All UI components working correctly!")
        print("=" * 80)
        print("\nAttempting to show the UI...")
        chart.show()
        sys.exit(QApplication.instance().exec())
    else:
        print("\n" + "=" * 80)
        print("FAILURE: Main ChartTabbed UI has issues")
        print("=" * 80)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("\n" + "=" * 80)
        print("FATAL ERROR during test execution:")
        print("=" * 80)
        print(f"{e}")
        traceback.print_exc()
