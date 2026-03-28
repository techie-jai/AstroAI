#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
PyJHora UI Launcher
===================
This is the main entry point to start the PyJHora Vedic Astrology application.

Usage:
    python START_UI.py

The application will open with the main chart interface where you can:
- Enter birth details (date, time, place)
- Generate horoscope charts
- View panchanga information
- Calculate dashas and predictions
"""

import sys
import os

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

if __name__ == "__main__":
    print("="*80)
    print("PyJHora - Vedic Astrology Software")
    print("="*80)
    print("\nStarting application...")
    print("Please wait while modules are loading...")
    
    try:
        # Set up exception hook
        def except_hook(cls, exception, traceback):
            sys.__excepthook__(cls, exception, traceback)
        sys.excepthook = except_hook
        
        # Create Qt Application
        from PyQt6.QtWidgets import QApplication
        App = QApplication(sys.argv)
        
        # Import and create the main chart interface
        from jhora.ui.horo_chart_tabs import ChartTabbed
        chart = ChartTabbed()
        
        # Set default language to English
        chart.language('English')
        
        # Show the main window
        chart.show()
        
        print("\nApplication started successfully!")
        print("The PyJHora window should now be visible.")
        print("="*80)
        
        # Start the Qt event loop
        sys.exit(App.exec())
        
    except ImportError as e:
        print("\n" + "="*80)
        print("ERROR: Missing required dependencies")
        print("="*80)
        print(f"\n{e}\n")
        print("Please ensure the following packages are installed:")
        print("  - PyQt6")
        print("  - Pillow (PIL)")
        print("  - numpy")
        print("  - pyswisseph")
        print("\nYou can install them using:")
        print("  pip install PyQt6 Pillow numpy pyswisseph")
        sys.exit(1)
        
    except Exception as e:
        print("\n" + "="*80)
        print("ERROR: Failed to start application")
        print("="*80)
        print(f"\n{e}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)
