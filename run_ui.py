#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import sys
import os
import traceback

# Change to PyJHora directory
os.chdir(os.path.join(os.path.dirname(__file__), 'PyJHora'))
sys.path.insert(0, os.getcwd())

try:
    print("Starting PyJHora UI...")
    print(f"Working directory: {os.getcwd()}")
    print(f"Python path: {sys.path[:3]}")
    
    from PyQt6.QtWidgets import QApplication
    from jhora.ui.horo_chart_tabs import ChartTabbed
    
    print("Imports successful, creating application...")
    
    app = QApplication(sys.argv)
    chart = ChartTabbed()
    chart.language('English')
    chart.compute_horoscope()
    chart.show()
    
    print("UI window created and shown")
    sys.exit(app.exec())
    
except Exception as e:
    print(f"\n{'='*60}")
    print(f"ERROR: {type(e).__name__}")
    print(f"Message: {e}")
    print(f"{'='*60}\n")
    traceback.print_exc()
    sys.exit(1)
