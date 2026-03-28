#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test each import from horo_chart_tabs.py individually
"""

import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Testing horo_chart_tabs.py imports one by one...\n")

imports = [
    ("PyQt6 imports", "from PyQt6 import QtCore, QtGui"),
    ("PyQt6.QtWidgets", "from PyQt6.QtWidgets import QWidget, QApplication"),
    ("PIL", "from PIL import Image"),
    ("numpy", "import numpy as np"),
    ("jhora.const", "from jhora import const"),
    ("jhora.utils", "from jhora import utils"),
    ("jhora.panchanga.drik", "from jhora.panchanga import drik"),
    ("jhora.panchanga.pancha_paksha", "from jhora.panchanga import pancha_paksha"),
    ("jhora.panchanga.vratha", "from jhora.panchanga import vratha"),
    ("jhora.horoscope.main", "from jhora.horoscope import main"),
    ("jhora.horoscope.prediction.general", "from jhora.horoscope.prediction import general"),
    ("jhora.horoscope.match.compatibility", "from jhora.horoscope.match import compatibility"),
    ("jhora.horoscope.chart.ashtakavarga", "from jhora.horoscope.chart import ashtakavarga"),
    ("jhora.horoscope.chart.yoga", "from jhora.horoscope.chart import yoga"),
    ("jhora.horoscope.chart.raja_yoga", "from jhora.horoscope.chart import raja_yoga"),
    ("jhora.horoscope.chart.dosha", "from jhora.horoscope.chart import dosha"),
    ("jhora.horoscope.chart.charts", "from jhora.horoscope.chart import charts"),
    ("jhora.horoscope.chart.strength", "from jhora.horoscope.chart import strength"),
    ("jhora.horoscope.chart.arudhas", "from jhora.horoscope.chart import arudhas"),
    ("jhora.horoscope.chart.house", "from jhora.horoscope.chart import house"),
    ("jhora.ui.varga_chart_dialog", "from jhora.ui import varga_chart_dialog"),
    ("jhora.ui.options_dialog", "from jhora.ui import options_dialog"),
    ("jhora.ui.mixed_chart_dialog", "from jhora.ui import mixed_chart_dialog"),
    ("jhora.ui.dhasa_bhukthi_options_dialog", "from jhora.ui import dhasa_bhukthi_options_dialog"),
    ("jhora.ui.vratha_finder", "from jhora.ui import vratha_finder"),
    ("jhora.ui.pancha_pakshi_sastra_widget", "from jhora.ui import pancha_pakshi_sastra_widget"),
    ("jhora.ui.conjunction", "from jhora.ui import conjunction"),
    ("jhora.ui.panchangam.PanchangaInfoDialog", "from jhora.ui.panchangam import PanchangaInfoDialog"),
    ("jhora.horoscope.dhasa.graha.vimsottari", "from jhora.horoscope.dhasa.graha import vimsottari"),
    ("jhora.ui.chart_styles", "from jhora.ui.chart_styles import EastIndianChart"),
    ("jhora.ui.label_grid", "from jhora.ui.label_grid import LabelGrid"),
    ("jhora.horoscope.dhasa.sudharsana_chakra", "from jhora.horoscope.dhasa import sudharsana_chakra"),
    ("jhora.ui.chakra", "from jhora.ui.chakra import KotaChakra"),
]

failed_imports = []
for i, (name, import_stmt) in enumerate(imports, 1):
    try:
        print(f"{i:2d}. {name:50s} ... ", end='', flush=True)
        exec(import_stmt)
        print("OK")
    except Exception as e:
        print(f"FAILED: {e}")
        failed_imports.append((name, str(e)))

if failed_imports:
    print("\n" + "="*80)
    print("FAILED IMPORTS:")
    print("="*80)
    for name, error in failed_imports:
        print(f"  {name}: {error}")
else:
    print("\n" + "="*80)
    print("All imports successful! Now testing full ChartTabbed import...")
    print("="*80)
    try:
        from jhora.ui.horo_chart_tabs import ChartTabbed
        print("OK - ChartTabbed imported successfully!")
    except Exception as e:
        print(f"FAILED - ChartTabbed import failed: {e}")
        import traceback
        traceback.print_exc()
