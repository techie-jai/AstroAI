#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Chart Generator - Generates astrological charts using Jyotishganit API
Handles chart generation only (no image rendering)
"""

import sys
import os
from typing import Dict, List, Optional
from PyQt6.QtCore import QObject, pyqtSignal, QThread

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Use Jyotishganit
from jyotishganit_chart_api import JyotishganitChartAPI as AstroChartAPI


class ChartGeneratorWorker(QObject):
    """Worker thread for generating charts"""

    # Signals
    progress = pyqtSignal(int, str)  # progress, message
    chart_generated = pyqtSignal(str, dict, str)  # chart_type, chart_data, chart_text
    kundli_generated = pyqtSignal(dict, str)  # kundli_data, kundli_text
    error = pyqtSignal(str)  # error message
    finished = pyqtSignal(bool, str)  # success, message
    
    def __init__(self, user_data: Dict, chart_style: str = 'south_indian'):
        super().__init__()
        self.user_data = user_data
        self.chart_style = chart_style
        self.api = None
        self.should_stop = False
    
    def stop(self):
        """Stop the generation process"""
        self.should_stop = True
    
    def run(self):
        """Generate kundli and all charts"""
        try:
            # Initialize Jyotishganit API (no ephemeris needed)
            self.progress.emit(0, "Initializing Jyotishganit chart generation...")
            self.api = AstroChartAPI()
            
            # Set birth data
            self.progress.emit(5, "Setting birth data...")
            self.api.set_birth_data(
                name=self.user_data['name'],
                place_name=self.user_data['place_name'],
                latitude=self.user_data['latitude'],
                longitude=self.user_data['longitude'],
                timezone_offset=self.user_data['timezone_offset'],
                year=self.user_data['year'],
                month=self.user_data['month'],
                day=self.user_data['day'],
                hour=self.user_data['hour'],
                minute=self.user_data['minute'],
                second=self.user_data.get('second', 0)
            )
            
            # Generate complete kundli first
            self.progress.emit(8, "Generating complete kundli...")
            try:
                kundli_data = self.api.get_kundli()
                kundli_text = self.api.format_kundli_text()
                self.kundli_generated.emit(kundli_data, kundli_text)
            except Exception as e:
                self.error.emit(f"Warning: Could not generate kundli: {str(e)}")
            
            # Get only D1 chart type (others will be in comprehensive kundli)
            chart_types = ['D1']
            total_charts = len(chart_types)
            
            # Generate each chart
            for i, chart_type in enumerate(chart_types):
                if self.should_stop:
                    self.finished.emit(False, "Generation cancelled by user")
                    return
                
                try:
                    # Calculate progress
                    progress = int(10 + (i / total_charts) * 85)
                    self.progress.emit(progress, f"Generating {chart_type} chart...")
                    
                    # Generate chart
                    chart_data = self.api.get_chart(chart_type)
                    chart_text = self.api.format_chart_text(chart_data)
                    
                    # Emit chart generated signal
                    self.chart_generated.emit(chart_type, chart_data, chart_text)
                    
                except Exception as e:
                    self.error.emit(f"Error generating {chart_type}: {str(e)}")
            
            self.progress.emit(95, "Finalizing...")
            self.finished.emit(True, f"Successfully generated kundli and D1 chart")
            
        except Exception as e:
            self.error.emit(f"Chart generation failed: {str(e)}")
            self.finished.emit(False, str(e))
