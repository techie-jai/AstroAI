#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
PyJHora UI Diagnostic Test
==========================
This script attempts to start the PyJHora UI and captures detailed error information.
"""

import sys
import os
import traceback

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Starting PyJHora UI Diagnostic Test...")
print(f"Python Path: {sys.path}")
print(f"Python Version: {sys.version}")
print(f"Current Working Directory: {os.getcwd()}")
print(f"Checking for pyswisseph in site-packages...")
import site
print(f"Site Packages: {site.getsitepackages()}")

def check_module(module_name):
    try:
        mod = __import__(module_name)
        print(f"Successfully imported {module_name} from {getattr(mod, '__file__', 'unknown location')}")
        return True
    except ImportError as e:
        print(f"Failed to import {module_name}: {e}")
        return False

# Check required dependencies
required_modules = ['PyQt6', 'PIL', 'numpy', 'pyswisseph']
missing_modules = []
for mod in required_modules:
    if not check_module(mod):
        missing_modules.append(mod)

if missing_modules:
    print("\nERROR: Missing required dependencies")
    print("="*80)
    print("Please install the following packages:")
    for mod in missing_modules:
        print(f"  - {mod}")
    print("\nYou can install them using:")
    print("  pip install " + " ".join(missing_modules))
    sys.exit(1)

try:
    # Set up exception hook for detailed error reporting
    def except_hook(cls, exception, traceback):
        print('Exception occurred:')
        sys.__excepthook__(cls, exception, traceback)
    sys.excepthook = except_hook
    
    # Import and create the application
    print("Loading PyQt6 QApplication...")
    from PyQt6.QtWidgets import QApplication
    App = QApplication(sys.argv)
    
    # Import the main chart UI
    print("Loading chart interface...")
    from jhora.ui.horo_chart_tabs import ChartTabbed
    
    # Create the chart window
    print("Creating chart window...")
    chart = ChartTabbed()
    
    # Set default language
    chart.language('English')
    
    # Show the window
    print("Displaying UI...")
    chart.show()
    
    print("UI loaded successfully!")
    print("You can now use the PyJHora interface.")
    
    # Start the application event loop
    sys.exit(App.exec())
    
except ImportError as e:
    print(f"\nImport Error: {e}")
    print("\nThis might be due to missing dependencies or incorrect module paths.")
    traceback.print_exc()
    sys.exit(1)
    
except Exception as e:
    print(f"\nError starting UI: {e}")
    traceback.print_exc()
    sys.exit(1)
