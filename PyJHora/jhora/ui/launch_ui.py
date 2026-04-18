#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
PyJHora UI Launcher - Minimal launcher that works around import issues
"""

import sys
import os

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Starting PyJHora UI...")
print("This may take a moment while loading all modules...")

if __name__ == "__main__":
    try:
        # Set up exception hook for better error reporting
        def except_hook(cls, exception, traceback):
            print('Exception occurred:')
            sys.__excepthook__(cls, exception, traceback)
        sys.excepthook = except_hook
        
        # Import and create the application
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
        print("\nThis might be due to missing dependencies.")
        print("Please ensure all required packages are installed:")
        print("  - PyQt6")
        print("  - PIL (Pillow)")
        print("  - numpy")
        print("  - pyswisseph")
        import traceback
        traceback.print_exc()
        sys.exit(1)
        
    except Exception as e:
        print(f"\nError starting UI: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
