#!/usr/bin/env python
# Test if img2pdf is the issue
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Testing img2pdf import...")
try:
    import img2pdf
    print("img2pdf imported successfully")
    print(f"img2pdf version: {img2pdf.__version__ if hasattr(img2pdf, '__version__') else 'unknown'}")
except Exception as e:
    print(f"img2pdf import failed: {e}")

print("\nTesting if we can import panchangam without img2pdf...")
# Temporarily make img2pdf unavailable
import sys
sys.modules['img2pdf'] = None

try:
    from jhora.ui import panchangam
    print("panchangam imported successfully without img2pdf!")
except Exception as e:
    print(f"panchangam import failed: {e}")
    import traceback
    traceback.print_exc()
