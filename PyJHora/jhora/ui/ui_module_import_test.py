#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
PyJHora UI Module Import Test
==============================
Tests individual UI module imports to identify which one is failing.
"""

import sys
import os
import traceback

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("="*80)
print("PyJHora UI Module Import Test")
print("="*80)

modules_to_test = [
    ('varga_chart_dialog', 'from jhora.ui import varga_chart_dialog'),
    ('options_dialog', 'from jhora.ui import options_dialog'),
    ('mixed_chart_dialog', 'from jhora.ui import mixed_chart_dialog'),
    ('dhasa_bhukthi_options_dialog', 'from jhora.ui import dhasa_bhukthi_options_dialog'),
    ('vratha_finder', 'from jhora.ui import vratha_finder'),
    ('pancha_pakshi_sastra_widget', 'from jhora.ui import pancha_pakshi_sastra_widget'),
    ('conjunction', 'from jhora.ui import conjunction'),
    ('OptionDialog', 'from jhora.ui.options_dialog import OptionDialog'),
    ('PanchangaInfoDialog', 'from jhora.ui.panchangam import PanchangaInfoDialog'),
    ('Chart Styles', 'from jhora.ui.chart_styles import EastIndianChart, WesternChart, SouthIndianChart, NorthIndianChart, SudarsanaChakraChart'),
    ('LabelGrid', 'from jhora.ui.label_grid import LabelGrid'),
    ('ChartTabbed', 'from jhora.ui.horo_chart_tabs import ChartTabbed'),
]

for module_name, import_statement in modules_to_test:
    try:
        print(f"\n[TEST] Importing {module_name}...", end=' ')
        exec(import_statement)
        print("✓ SUCCESS")
    except Exception as e:
        print(f"✗ FAILED")
        print(f"Error: {e}")
        print("Traceback:")
        traceback.print_exc()
        print("\nStopping at first failure.")
        sys.exit(1)

print("\n" + "="*80)
print("All UI modules imported successfully!")
print("="*80)
