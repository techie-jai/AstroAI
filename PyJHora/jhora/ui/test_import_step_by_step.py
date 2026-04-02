#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test imports step by step to find the blocking operation
"""

import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Step 1: Import PyQt6 modules...", end=' ')
sys.stdout.flush()
from PyQt6 import QtCore, QtGui
from PyQt6.QtWidgets import QStyledItemDelegate, QWidget, QVBoxLayout, QHBoxLayout, QTabWidget
from PyQt6.QtGui import QFont, QFontMetrics
from PyQt6.QtCore import Qt, QTimer, QDateTime, QTimeZone
print("[OK]")

print("Step 2: Import datetime...", end=' ')
sys.stdout.flush()
from _datetime import datetime
print("[OK]")

print("Step 3: Import img2pdf...", end=' ')
sys.stdout.flush()
import img2pdf
print("[OK]")

print("Step 4: Import PIL...", end=' ')
sys.stdout.flush()
from PIL import Image
print("[OK]")

print("Step 5: Import jhora.const and utils...", end=' ')
sys.stdout.flush()
from jhora import const, utils
print("[OK]")

print("Step 6: Import jhora.panchanga modules...", end=' ')
sys.stdout.flush()
from jhora.panchanga import drik, pancha_paksha, vratha, info
print("[OK]")

print("Step 7: Import panchangam module itself...", end=' ')
sys.stdout.flush()
import jhora.ui.panchangam
print("[OK]")

print("\nAll imports successful!")
