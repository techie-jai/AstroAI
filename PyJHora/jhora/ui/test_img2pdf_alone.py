#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test img2pdf import alone
"""

import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Testing img2pdf import...", end=' ')
sys.stdout.flush()

try:
    import img2pdf
    print("[OK]")
    print("img2pdf imported successfully!")
except Exception as e:
    print("[FAILED]")
    print("Error: " + str(e))
    import traceback
    traceback.print_exc()
    sys.exit(1)
