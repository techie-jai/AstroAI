#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
PyJHora UI Simple Debug - No special characters
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
print("PyJHora UI Simple Debug")
print("="*80)
print("Python: " + sys.executable)
print("Version: " + sys.version)
print("="*80)

try:
    print("\n[1] Importing PyQt6...")
    from PyQt6.QtWidgets import QApplication
    print("[OK] PyQt6 imported")
    
    print("[2] Creating QApplication...")
    app = QApplication(sys.argv)
    print("[OK] QApplication created")
    
    print("[3] Importing jhora modules...")
    from jhora import const, utils
    print("[OK] jhora modules imported")
    
    print("[4] Importing horoscope modules...")
    from jhora.horoscope import main
    from jhora.horoscope.chart import ashtakavarga, yoga, raja_yoga, dosha, charts, strength, arudhas, house
    print("[OK] horoscope modules imported")
    
    print("[5] Importing UI modules...")
    from jhora.ui import varga_chart_dialog, options_dialog, mixed_chart_dialog
    from jhora.ui import dhasa_bhukthi_options_dialog, vratha_finder, pancha_pakshi_sastra_widget
    from jhora.ui import conjunction
    from jhora.ui.options_dialog import OptionDialog
    from jhora.ui.panchangam import PanchangaInfoDialog
    from jhora.ui.chart_styles import EastIndianChart, WesternChart, SouthIndianChart, NorthIndianChart, SudarsanaChakraChart
    from jhora.ui.label_grid import LabelGrid
    print("[OK] UI modules imported")
    
    print("[6] Importing ChartTabbed...")
    from jhora.ui.horo_chart_tabs import ChartTabbed
    print("[OK] ChartTabbed imported")
    
    print("[7] Creating ChartTabbed instance...")
    chart = ChartTabbed()
    print("[OK] ChartTabbed instance created")
    
    print("[8] Setting language...")
    chart.language('English')
    print("[OK] Language set")
    
    print("[9] Showing UI...")
    chart.show()
    print("[OK] UI shown")
    
    print("\n" + "="*80)
    print("SUCCESS! Starting event loop...")
    print("="*80)
    sys.exit(app.exec())
    
except Exception as e:
    print("\n[ERROR] " + str(e))
    print("\nFull traceback:")
    traceback.print_exc()
    print("\n" + "="*80)
    sys.exit(1)
