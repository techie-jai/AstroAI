#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test img2pdf import
"""

import sys
import os

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Testing img2pdf import...")
try:
    import img2pdf
    print("✓ img2pdf imported successfully")
except ImportError as e:
    print(f"✗ Failed to import img2pdf: {e}")
    print("\nTrying to import panchangam without img2pdf...")
    
    # Try importing panchangam to see if it's the issue
    try:
        from jhora.ui import panchangam
        print("✓ panchangam imported successfully")
    except Exception as e2:
        print(f"✗ Failed to import panchangam: {e2}")
        import traceback
        traceback.print_exc()
