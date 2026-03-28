#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test with timeout to identify where hang occurs
"""

import sys
import os
import signal
import traceback

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

class TimeoutError(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutError("Operation timed out")

# Set up timeout (only works on Unix-like systems)
if hasattr(signal, 'SIGALRM'):
    signal.signal(signal.SIGALRM, timeout_handler)

print("Testing imports with detailed tracking...")

try:
    print("1. PyQt6.QtWidgets...")
    from PyQt6.QtWidgets import QApplication
    print("   ✓")
    
    print("2. jhora.const...")
    from jhora import const
    print("   ✓")
    
    print("3. jhora.utils...")
    from jhora import utils
    print("   ✓")
    
    print("4. jhora.panchanga.drik...")
    from jhora.panchanga import drik
    print("   ✓")
    
    print("5. jhora.panchanga.vratha...")
    from jhora.panchanga import vratha
    print("   ✓")
    
    print("6. jhora.horoscope.main...")
    from jhora.horoscope import main
    print("   ✓")
    
    print("7. jhora.ui.chart_styles...")
    from jhora.ui import chart_styles
    print("   ✓")
    
    print("8. jhora.ui.panchangam...")
    from jhora.ui import panchangam
    print("   ✓")
    
    print("9. jhora.ui.horo_chart_tabs...")
    from jhora.ui import horo_chart_tabs
    print("   ✓")
    
    print("\nAll imports successful!")
    
except TimeoutError:
    print("\n   ✗ TIMEOUT - This import is hanging!")
    traceback.print_exc()
except Exception as e:
    print(f"\n   ✗ ERROR: {e}")
    traceback.print_exc()
