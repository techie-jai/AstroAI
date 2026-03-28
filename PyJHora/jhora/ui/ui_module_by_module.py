#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Test each UI module import one by one
"""

import sys
import os
import traceback

# Add the PyJHora root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
pyjhora_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if pyjhora_root not in sys.path:
    sys.path.insert(0, pyjhora_root)

print("Testing UI module imports one by one...")
print("="*80)

modules = [
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
]

for name, import_stmt in modules:
    print("[TEST] Importing " + name + "...", end=' ')
    sys.stdout.flush()
    try:
        exec(import_stmt)
        print("[OK]")
        sys.stdout.flush()
    except Exception as e:
        print("[FAILED]")
        print("Error: " + str(e))
        traceback.print_exc()
        sys.exit(1)

print("="*80)
print("All UI modules imported successfully!")
