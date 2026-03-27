#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import sys
import os

# Add PyJHora to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'PyJHora'))

print("Step 1: Importing jhora...")
try:
    import jhora
    print("✓ jhora imported")
except Exception as e:
    print(f"✗ Failed to import jhora: {e}")
    sys.exit(1)

print("\nStep 2: Importing jhora.ui...")
try:
    import jhora.ui
    print("✓ jhora.ui imported")
except Exception as e:
    print(f"✗ Failed to import jhora.ui: {e}")
    sys.exit(1)

print("\nStep 3: Importing jhora.ui.chakra...")
try:
    from jhora.ui import chakra
    print("✓ jhora.ui.chakra imported")
except Exception as e:
    print(f"✗ Failed to import jhora.ui.chakra: {e}")
    sys.exit(1)

print("\nStep 4: Importing jhora.ui.chart_styles...")
try:
    from jhora.ui import chart_styles
    print("✓ jhora.ui.chart_styles imported")
except Exception as e:
    print(f"✗ Failed to import jhora.ui.chart_styles: {e}")
    sys.exit(1)

print("\nStep 5: Importing jhora.ui.horo_chart_tabs...")
try:
    from jhora.ui import horo_chart_tabs
    print("✓ jhora.ui.horo_chart_tabs imported")
except Exception as e:
    print(f"✗ Failed to import jhora.ui.horo_chart_tabs: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\nStep 6: Getting ChartTabbed class...")
try:
    from jhora.ui.horo_chart_tabs import ChartTabbed
    print("✓ ChartTabbed class imported")
except Exception as e:
    print(f"✗ Failed to import ChartTabbed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\nAll imports successful!")
