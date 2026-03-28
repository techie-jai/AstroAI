#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
PyJHora UI Full Debug - Captures all output and errors
"""

import sys
import os
import traceback
import io
from contextlib import redirect_stdout, redirect_stderr

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("="*80)
print("PyJHora UI Full Debug")
print("="*80)
print(f"Python: {sys.executable}")
print(f"Version: {sys.version}")
print("="*80)

try:
    print("\n[1/7] Importing PyQt6...")
    from PyQt6.QtWidgets import QApplication
    print("✓ PyQt6 imported")
    
    print("[2/7] Creating QApplication...")
    app = QApplication(sys.argv)
    print("✓ QApplication created")
    
    print("[3/7] Importing jhora modules...")
    from jhora import const, utils
    print("✓ jhora modules imported")
    
    print("[4/7] Importing horoscope modules...")
    from jhora.horoscope import main
    from jhora.horoscope.chart import ashtakavarga, yoga, raja_yoga, dosha, charts, strength, arudhas, house
    print("✓ horoscope modules imported")
    
    print("[5/7] Importing UI modules...")
    from jhora.ui import varga_chart_dialog, options_dialog, mixed_chart_dialog
    from jhora.ui import dhasa_bhukthi_options_dialog, vratha_finder, pancha_pakshi_sastra_widget
    from jhora.ui import conjunction
    from jhora.ui.options_dialog import OptionDialog
    from jhora.ui.panchangam import PanchangaInfoDialog
    from jhora.ui.chart_styles import EastIndianChart, WesternChart, SouthIndianChart, NorthIndianChart, SudarsanaChakraChart
    from jhora.ui.label_grid import LabelGrid
    print("✓ UI modules imported")
    
    print("[6/7] Importing ChartTabbed...")
    from jhora.ui.horo_chart_tabs import ChartTabbed
    print("✓ ChartTabbed imported")
    
    print("[7/7] Creating ChartTabbed instance...")
    print("  - Initializing ChartTabbed()...")
    chart = ChartTabbed()
    print("  ✓ ChartTabbed instance created")
    
    print("\n[8/7] Setting language...")
    chart.language('English')
    print("✓ Language set")
    
    print("\n[9/7] Showing UI...")
    chart.show()
    print("✓ UI shown")
    
    print("\n" + "="*80)
    print("SUCCESS! Starting event loop...")
    print("="*80)
    sys.exit(app.exec())
    
except Exception as e:
    print(f"\n✗ ERROR: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
    print("\n" + "="*80)
    sys.exit(1)
