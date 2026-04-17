#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Detailed import test to find exact hang location
"""

import sys
import os

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Testing panchangam.py imports step by step...")

try:
    print("1. PyQt6 imports...")
    from PyQt6 import QtCore, QtGui
    from PyQt6.QtWidgets import QStyledItemDelegate, QWidget, QVBoxLayout, QHBoxLayout, QTabWidget, \
                                QTextEdit, QLayout, QLabel, QSizePolicy, QLineEdit, QCompleter, QComboBox, \
                                QPushButton, QApplication, QMessageBox, QFileDialog
    from PyQt6.QtGui import QFont, QFontMetrics
    from PyQt6.QtCore import Qt, QTimer, QDateTime, QTimeZone
    print("   ✓")
    
    print("2. datetime...")
    from _datetime import datetime
    print("   ✓")
    
    print("3. img2pdf...")
    try:
        import img2pdf
        print("   ✓")
    except:
        print("   ✓ (not available)")
    
    print("4. PIL...")
    from PIL import Image
    print("   ✓")
    
    print("5. jhora.const...")
    from jhora import const
    print("   ✓")
    
    print("6. jhora.utils...")
    from jhora import utils
    print("   ✓")
    
    print("7. jhora.panchanga.drik...")
    from jhora.panchanga import drik
    print("   ✓")
    
    print("8. jhora.panchanga.pancha_paksha...")
    from jhora.panchanga import pancha_paksha
    print("   ✓")
    
    print("9. jhora.panchanga.vratha...")
    from jhora.panchanga import vratha
    print("   ✓")
    
    print("10. jhora.panchanga.info...")
    from jhora.panchanga import info
    print("   ✓")
    
    print("\nAll panchangam.py imports successful!")
    print("Now testing the full panchangam module import...")
    
    print("11. jhora.ui.panchangam...")
    from jhora.ui import panchangam
    print("   ✓")
    
    print("\nSUCCESS: All imports work!")
    
except Exception as e:
    print(f"\n   ✗ ERROR: {e}")
    import traceback
    traceback.print_exc()
