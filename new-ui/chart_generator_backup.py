#!/usr/bin/env python

# -*- coding: UTF-8 -*-

"""

Chart Generator - Generates astrological charts using AstroChartAPI

Handles chart generation and image rendering

"""



import sys

import os

from typing import Dict, List, Optional

from PyQt6.QtCore import QObject, pyqtSignal, QThread

from PyQt6.QtWidgets import QWidget

from PyQt6.QtGui import QPixmap, QPainter

from PyQt6.QtCore import Qt



# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Use Jyotishganit
from jyotishganit_chart_api import JyotishganitChartAPI as AstroChartAPI





class ChartGeneratorWorker(QObject):

    """Worker thread for generating charts"""

    

    progress = pyqtSignal(int, str)  # progress, message

    chart_generated = pyqtSignal(str, dict, str)  # chart_type, chart_data, chart_text

    kundli_generated = pyqtSignal(dict, str)  # kundli_data, kundli_text

    error = pyqtSignal(str)  # error message

    finished = pyqtSignal(bool, str)  # success, message)

    

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

            

            # Get all chart types

            chart_types = list(AstroChartAPI.CHART_TYPES.keys())

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

            self.finished.emit(True, f"Successfully generated kundli and {total_charts} charts")

            

        except Exception as e:

            self.error.emit(f"Chart generation failed: {str(e)}")

            self.finished.emit(False, str(e))





class ChartImageRenderer:

    """Renders charts as images"""

    

    def __init__(self, chart_style: str = 'south_indian'):

        """

        Initialize renderer

        

        Args:

            chart_style: Chart style ('south_indian', 'north_indian', 'east_indian')

        """

        self.chart_style = chart_style.lower()

        self.chart_size = 600

    

    def render_chart(self, chart_data: Dict) -> QPixmap:

        """

        Render chart data as an image

        

        Args:

            chart_data: Chart data dictionary from API

            

        Returns:

            QPixmap containing the rendered chart

        """

        # Create a simple chart widget (chart widgets to be implemented)
        # For now, we'll create a simple placeholder widget
        chart_widget = QWidget()
        chart_widget.setFixedSize(self.chart_size, self.chart_size)
        
        # TODO: Implement custom chart rendering for Jyotishganit data

        

        # Render a simple placeholder since custom chart rendering is not yet implemented
        pixmap = QPixmap(self.chart_size, self.chart_size)
        pixmap.fill(Qt.GlobalColor.white)
        
        # Add chart title as text
        painter = QPainter(pixmap)
        painter.setPen(Qt.GlobalColor.black)
        painter.drawText(pixmap.rect(), Qt.AlignmentFlag.AlignCenter, 
                        f"{chart_data.get('chart_name', 'Chart')}\n(Chart rendering to be implemented)")
        painter.end()
        
        return pixmap

    

    def render_chart_simple(self, chart_data: Dict) -> QPixmap:

        """

        Render a simple text-based chart representation

        

        Args:

            chart_data: Chart data dictionary

            

        Returns:

            QPixmap with text representation

        """

        from PyQt6.QtGui import QFont, QColor

        from PyQt6.QtCore import Qt, QRect

        

        width, height = 800, 600

        pixmap = QPixmap(width, height)

        pixmap.fill(QColor(255, 255, 255))

        

        painter = QPainter(pixmap)

        painter.setFont(QFont("Arial", 10))

        

        # Draw title

        title = f"{chart_data['chart_name']} ({chart_data['chart_type']})"

        painter.drawText(QRect(0, 10, width, 30), Qt.AlignmentFlag.AlignCenter, title)

        

        # Draw birth data

        y = 50

        birth_data = chart_data['birth_data']

        painter.drawText(10, y, f"Name: {birth_data['name']}")

        y += 20

        painter.drawText(10, y, f"Date: {birth_data['date']} Time: {birth_data['time']}")

        y += 20

        painter.drawText(10, y, f"Place: {birth_data['place']}")

        y += 30

        

        # Draw ascendant

        asc = chart_data['ascendant']

        painter.drawText(10, y, f"Ascendant: {asc['house_name']}")

        y += 30

        

        # Draw planets

        painter.drawText(10, y, "Planet Positions:")

        y += 20

        

        for planet in chart_data['planets']:

            if planet['id'] != 'L':

                text = f"{planet['name']}: {planet['house_name']}"

                painter.drawText(20, y, text)

                y += 18

                if y > height - 20:

                    break

        

        painter.end()

        return pixmap

