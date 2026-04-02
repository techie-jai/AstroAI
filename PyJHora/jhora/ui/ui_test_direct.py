#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Direct UI Test - Test main ChartTabbed without intermediate imports
"""

import sys
import os
import traceback

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Testing main ChartTabbed UI directly...")

try:
    print("1. Importing PyQt6...")
    from PyQt6.QtWidgets import QApplication
    print("   ✓ Success")
    
    print("2. Creating QApplication...")
    app = QApplication(sys.argv)
    print("   ✓ Success")
    
    print("3. Importing ChartTabbed...")
    from jhora.ui.horo_chart_tabs import ChartTabbed
    print("   ✓ Success")
    
    print("4. Creating ChartTabbed instance...")
    chart = ChartTabbed()
    print("   ✓ Success")
    
    print("5. Setting language...")
    chart.language('English')
    print("   ✓ Success")
    
    print("6. Setting chart data...")
    chart.name('Test User')
    chart.gender(1)
    chart.date_of_birth('1996,12,7')
    chart.time_of_birth('10:34:00')
    chart.place('Chennai,India', 13.0878, 80.2785, 5.5)
    print("   ✓ Success")
    
    print("7. Computing horoscope...")
    chart.compute_horoscope()
    print("   ✓ Success")
    
    print("\n" + "=" * 80)
    print("SUCCESS: UI is working correctly!")
    print("=" * 80)
    print("\nTo display the UI, uncomment the following lines:")
    print("# chart.show()")
    print("# sys.exit(app.exec())")
    
except Exception as e:
    print("\n" + "=" * 80)
    print("ERROR:")
    print("=" * 80)
    print(f"{e}")
    traceback.print_exc()
    sys.exit(1)
