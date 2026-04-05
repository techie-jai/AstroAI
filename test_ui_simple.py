#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Simple test to check if UI starts without errors
"""

import sys
import os
import traceback

print("Starting UI test...")

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'new-ui'))

try:
    print("Testing PyQt6 import...")
    from PyQt6.QtWidgets import QApplication
    print("OK: PyQt6 imported")
    
    print("Testing UI imports...")
    from ui_components import AstroAIMainWindow
    print("OK: ui_components imported")
    
    from chart_generator import ChartGeneratorWorker, ChartImageRenderer
    print("OK: chart_generator imported")
    
    from file_manager import FileManager
    print("OK: file_manager imported")
    
    from main import AstroAIApplication
    print("OK: main imported")
    
    print("\nTesting UI creation...")
    app = QApplication([])
    
    window = AstroAIMainWindow()
    print("OK: UI window created successfully")
    
    app.quit()
    print("OK: UI test completed successfully!")
    
except Exception as e:
    print(f"ERROR: {e}")
    print("Traceback:")
    traceback.print_exc()

print("Test finished.")
