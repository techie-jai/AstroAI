#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
PyJHora UI Startup Debug Script
================================
This script attempts to start the PyJHora UI with detailed step-by-step debugging.
"""

import sys
import os
import traceback

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("="*80)
print("PyJHora UI Startup Debug Script")
print("="*80)
print(f"Python Version: {sys.version}")
print(f"Python Executable: {sys.executable}")
print(f"Current Directory: {os.getcwd()}")
print(f"PyJHora Root: {pyjhora_root}")
print("="*80)

def debug_step(step_name):
    print(f"\n[STEP] {step_name}")
    print("-" * 80)

try:
    debug_step("Importing PyQt6")
    from PyQt6.QtWidgets import QApplication
    from PyQt6.QtCore import Qt
    print("✓ PyQt6 imported successfully")
    
    debug_step("Creating QApplication")
    App = QApplication(sys.argv)
    print("✓ QApplication created successfully")
    
    debug_step("Importing jhora modules")
    from jhora import const, utils
    print("✓ jhora.const and jhora.utils imported")
    
    debug_step("Importing horoscope modules")
    from jhora.horoscope import main
    print("✓ jhora.horoscope.main imported")
    
    debug_step("Importing chart modules")
    from jhora.horoscope.chart import ashtakavarga, yoga, raja_yoga, dosha, charts, strength, arudhas, house
    print("✓ Chart modules imported")
    
    debug_step("Importing UI modules")
    from jhora.ui import varga_chart_dialog, options_dialog, mixed_chart_dialog
    from jhora.ui import dhasa_bhukthi_options_dialog, vratha_finder, pancha_pakshi_sastra_widget
    from jhora.ui import conjunction
    from jhora.ui.options_dialog import OptionDialog
    from jhora.ui.panchangam import PanchangaInfoDialog
    from jhora.ui.chart_styles import EastIndianChart, WesternChart, SouthIndianChart, NorthIndianChart, SudarsanaChakraChart
    from jhora.ui.label_grid import LabelGrid
    print("✓ UI modules imported")
    
    debug_step("Importing ChartTabbed class")
    from jhora.ui.horo_chart_tabs import ChartTabbed
    print("✓ ChartTabbed class imported")
    
    debug_step("Creating ChartTabbed instance")
    chart = ChartTabbed()
    print("✓ ChartTabbed instance created")
    
    debug_step("Setting language to English")
    chart.language('English')
    print("✓ Language set to English")
    
    debug_step("Showing UI window")
    chart.show()
    print("✓ UI window shown")
    
    debug_step("Starting Qt event loop")
    print("UI loaded successfully! Starting event loop...")
    print("="*80)
    sys.exit(App.exec())
    
except ImportError as e:
    print(f"\n✗ Import Error: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
    sys.exit(1)
    
except Exception as e:
    print(f"\n✗ Error: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
    sys.exit(1)
