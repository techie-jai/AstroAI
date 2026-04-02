#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Gemini Analyzer - Sends kundli data to Google Gemini API for astrological analysis
"""

import json
import os
from typing import Dict, Optional
from PyQt6.QtCore import QObject, pyqtSignal, QThread
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime

try:
    from local_values import GEMINI_API_KEY
except ImportError:
    GEMINI_API_KEY = None


class GeminiAnalyzerWorker(QObject):
    """Worker thread for Gemini API analysis"""
    
    analysis_complete = pyqtSignal(str, str)  # (analysis_text, analysis_pdf_path)
    error = pyqtSignal(str)  # (error_message)
    progress = pyqtSignal(str)  # (status_message)
    
    def __init__(self, kundli_json_path: str, api_key: str):
        super().__init__()
        self.kundli_json_path = kundli_json_path
        self.api_key = api_key
        self.kundli_data = None
    
    def run(self):
        """Run the analysis"""
        try:
            self.progress.emit("Loading kundli data...")
            
            # Load kundli JSON
            if not os.path.exists(self.kundli_json_path):
                self.error.emit(f"Kundli file not found: {self.kundli_json_path}")
                return
            
            with open(self.kundli_json_path, 'r', encoding='utf-8') as f:
                self.kundli_data = json.load(f)
            
            self.progress.emit("Sending data to Gemini API...")
            
            # Send to Gemini API (both JSON and prompt)
            analysis_result = self._analyze_with_gemini(self.kundli_data)
            
            self.progress.emit("Generating PDF report...")
            
            # Save analysis as PDF file
            analysis_pdf_path = self._save_analysis_pdf(analysis_result)
            
            self.progress.emit("Analysis complete")
            self.analysis_complete.emit(analysis_result, analysis_pdf_path)
            
        except Exception as e:
            self.error.emit(f"Analysis failed: {str(e)}")
    
    def _analyze_with_gemini(self, kundli_data: Dict) -> str:
        """
        Send kundli data to Gemini API for analysis
        Sends both the JSON kundli data and the prompt to the API
        
        Args:
            kundli_data: Dictionary containing kundli information (JSON)
            
        Returns:
            Analysis result as string
        """
        try:
            import google.generativeai as genai
        except ImportError:
            raise ImportError("google-generativeai package not installed. Install with: pip install google-generativeai")
        
        # Configure Gemini API
        genai.configure(api_key=self.api_key)
        
        # Create the prompt with the JSON kundli data
        prompt = f"""Act as a professional astrologer, deeply analyse the json provided and let me know your insights into person's life, career, wealth, health, marriage, kids and things that stood out in that person's kundli.

Kundli Data (JSON):
{json.dumps(kundli_data, indent=2, ensure_ascii=False)}

Please provide a comprehensive astrological analysis covering:
1. Life Overview
2. Career and Professional Life
3. Wealth and Financial Prospects
4. Health and Wellness
5. Marriage and Relationships
6. Children and Family
7. Key Highlights and Notable Planetary Influences

Format your response in a clear, readable manner."""
        
        # Call Gemini API with both prompt and JSON data
        model = genai.GenerativeModel('gemini-3-pro-preview')
        response = model.generate_content(prompt)
        
        return response.text
    
    def _save_analysis_pdf(self, analysis_text: str) -> str:
        """
        Save analysis result as a professional PDF file
        
        Args:
            analysis_text: Analysis text from Gemini API
            
        Returns:
            Path to saved PDF file
        """
        # Get the directory of the kundli JSON file
        kundli_dir = os.path.dirname(self.kundli_json_path)
        
        # Create analysis PDF file path
        analysis_pdf_path = os.path.join(kundli_dir, "kundli_analyzed.pdf")
        
        # Create PDF document
        doc = SimpleDocTemplate(
            analysis_pdf_path,
            pagesize=A4,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        # Container for PDF elements
        elements = []
        
        # Define custom styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a3a52'),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#2c5aa0'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold',
            borderColor=colors.HexColor('#2c5aa0'),
            borderWidth=1,
            borderPadding=8
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12,
            leading=16
        )
        
        # Add title
        elements.append(Paragraph("ASTROLOGICAL ANALYSIS REPORT", title_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Add metadata
        metadata_style = ParagraphStyle(
            'Metadata',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#666666'),
            alignment=TA_CENTER,
            spaceAfter=12
        )
        
        timestamp = datetime.now().strftime("%B %d, %Y at %H:%M:%S")
        elements.append(Paragraph(f"Generated on: {timestamp}", metadata_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Extract key planetary positions from kundli data for a summary table
        if self.kundli_data:
            try:
                # Create a summary table with key planetary positions
                summary_data = self._extract_planetary_summary()
                if summary_data:
                    elements.append(Paragraph("Planetary Positions Summary", heading_style))
                    
                    # Create table
                    table_data = [['Planet', 'Sign', 'Degree']]
                    for planet_info in summary_data:
                        table_data.append(planet_info)
                    
                    table = Table(table_data, colWidths=[2*inch, 2*inch, 2*inch])
                    table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c5aa0')),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, 0), 11),
                        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')),
                        ('FONTSIZE', (0, 1), (-1, -1), 10),
                        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')])
                    ]))
                    
                    elements.append(table)
                    elements.append(Spacer(1, 0.3*inch))
            except Exception as e:
                print(f"Warning: Could not extract planetary summary: {e}")
        
        # Add main analysis
        elements.append(Paragraph("Detailed Analysis", heading_style))
        
        # Parse analysis text and add with proper formatting
        analysis_paragraphs = analysis_text.split('\n\n')
        for para in analysis_paragraphs:
            if para.strip():
                # Check if this is a section heading (numbered or bold)
                if para.strip().startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.')):
                    elements.append(Paragraph(para.strip(), heading_style))
                else:
                    elements.append(Paragraph(para.strip(), body_style))
        
        # Add footer
        elements.append(Spacer(1, 0.3*inch))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#999999'),
            alignment=TA_CENTER
        )
        elements.append(Paragraph("This analysis is based on astrological principles and is for informational purposes only.", footer_style))
        
        # Build PDF
        doc.build(elements)
        
        return analysis_pdf_path
    
    def _extract_planetary_summary(self) -> list:
        """
        Extract key planetary positions from kundli data for summary table
        
        Returns:
            List of [planet, sign, degree] entries
        """
        try:
            summary = []
            
            # Try to extract from different possible kundli data structures
            if isinstance(self.kundli_data, dict):
                # Look for planets key or similar
                planets_data = self.kundli_data.get('planets', {})
                if planets_data:
                    for planet, data in planets_data.items():
                        if isinstance(data, dict):
                            sign = data.get('sign', 'N/A')
                            degree = data.get('degree', 'N/A')
                            if isinstance(degree, (int, float)):
                                degree = f"{degree:.2f}°"
                            summary.append([planet.capitalize(), str(sign), str(degree)])
            
            return summary[:9] if summary else []  # Return top 9 planets
        except Exception as e:
            print(f"Error extracting planetary summary: {e}")
            return []


class GeminiAnalyzer:
    """Main class for Gemini analysis"""
    
    def __init__(self, api_key: str):
        """
        Initialize Gemini Analyzer
        
        Args:
            api_key: AIzaSyA35okxwCp8oGyfScvbbprSpFJRkVnT0oE
        """
        self.api_key = api_key
        self.worker = None
        self.worker_thread = None
    
    def analyze_kundli(self, kundli_json_path: str, on_complete, on_error, on_progress):
        """
        Analyze kundli using Gemini API in a separate thread
        
        Args:
            kundli_json_path: Path to kundli JSON file
            on_complete: Callback function for completion (receives analysis_text)
            on_error: Callback function for errors (receives error_message)
            on_progress: Callback function for progress updates (receives status_message)
        """
        # Create worker
        self.worker = GeminiAnalyzerWorker(kundli_json_path, self.api_key)
        self.worker_thread = QThread()
        self.worker.moveToThread(self.worker_thread)
        
        # Connect signals
        self.worker_thread.started.connect(self.worker.run)
        self.worker.analysis_complete.connect(on_complete)
        self.worker.error.connect(on_error)
        self.worker.progress.connect(on_progress)
        
        # Start thread
        self.worker_thread.start()
    
    def stop(self):
        """Stop the analysis"""
        if self.worker_thread:
            self.worker_thread.quit()
            self.worker_thread.wait()
