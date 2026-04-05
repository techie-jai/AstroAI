#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Run UI with error capture
"""

import sys
import os
import traceback

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'new-ui'))

try:
    print("Starting UI...")
    from main import AstroAIApplication
    from PyQt6.QtWidgets import QApplication
    
    app = QApplication(sys.argv)
    astro_app = AstroAIApplication()
    
    print("UI started successfully!")
    astro_app.window.show()
    
    # Run for 5 seconds then close
    from PyQt6.QtCore import QTimer
    QTimer.singleShot(5000, app.quit)
    
    sys.exit(app.exec())
    
except Exception as e:
    print(f"ERROR: {e}")
    traceback.print_exc()
    input("Press Enter to continue...")
