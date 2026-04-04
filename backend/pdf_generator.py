"""
PDF Generator - Creates professional PDF reports for astrological analysis
Uses reportlab for high-quality PDF generation with proper formatting
"""

from io import BytesIO
from datetime import datetime
from typing import Dict, Optional
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from analysis_formatter import AnalysisFormatter


class PDFGenerator:
    """Generates professional PDF reports for astrological analysis"""
    
    @staticmethod
    def generate_analysis_pdf(
        analysis_text: str,
        kundli_data: Dict,
        birth_data: Dict,
        user_name: str
    ) -> bytes:
        """
        Generate a professional PDF report for astrological analysis
        
        Args:
            analysis_text: AI-generated analysis text
            kundli_data: Kundli data dictionary
            birth_data: Birth information dictionary
            user_name: Name of the person
            
        Returns:
            PDF content as bytes
        """
        # Create PDF in memory
        pdf_buffer = BytesIO()
        
        doc = SimpleDocTemplate(
            pdf_buffer,
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
        
        # Title style
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a3a52'),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # Heading style
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
        
        # Body text style
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12,
            leading=16
        )
        
        # Metadata style
        metadata_style = ParagraphStyle(
            'Metadata',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#666666'),
            alignment=TA_CENTER,
            spaceAfter=12
        )
        
        # Add title
        elements.append(Paragraph("ASTROLOGICAL ANALYSIS REPORT", title_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Add person name
        person_name_style = ParagraphStyle(
            'PersonName',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#1a3a52'),
            alignment=TA_CENTER,
            spaceAfter=12,
            fontName='Helvetica-Bold'
        )
        elements.append(Paragraph(f"For: {user_name}", person_name_style))
        
        # Add timestamp
        timestamp = datetime.now().strftime("%B %d, %Y at %H:%M:%S")
        elements.append(Paragraph(f"Generated on: {timestamp}", metadata_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Add birth information section
        elements.append(Paragraph("Birth Information", heading_style))
        
        birth_info_data = [
            ['Field', 'Value'],
            ['Name', birth_data.get('name', 'N/A')],
            ['Date of Birth', f"{birth_data.get('year', 'N/A')}-{birth_data.get('month', 'N/A')}-{birth_data.get('day', 'N/A')}"],
            ['Time of Birth', f"{birth_data.get('hour', 'N/A')}:{birth_data.get('minute', 'N/A')}"],
            ['Place of Birth', birth_data.get('place_name', 'N/A')],
            ['Latitude', f"{birth_data.get('latitude', 'N/A')}"],
            ['Longitude', f"{birth_data.get('longitude', 'N/A')}"],
            ['Timezone Offset', f"{birth_data.get('timezone_offset', 'N/A')}"],
        ]
        
        birth_table = Table(birth_info_data, colWidths=[2*inch, 4*inch])
        birth_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c5aa0')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')])
        ]))
        
        elements.append(birth_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Add planetary positions summary if available
        if kundli_data:
            try:
                planetary_summary = PDFGenerator._extract_planetary_summary(kundli_data)
                if planetary_summary:
                    elements.append(Paragraph("Planetary Positions Summary", heading_style))
                    
                    table_data = [['Planet', 'Sign', 'Degree']]
                    table_data.extend(planetary_summary)
                    
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
        
        # Add main analysis section
        elements.append(Paragraph("Detailed Astrological Analysis", heading_style))
        elements.append(Spacer(1, 0.15*inch))
        
        # Format analysis text first
        formatted_text = AnalysisFormatter.format_analysis(analysis_text)
        
        # Parse analysis text and add with proper formatting
        lines = formatted_text.split('\n')
        for line in lines:
            stripped = line.strip()
            
            if not stripped:
                elements.append(Spacer(1, 0.1*inch))
            elif AnalysisFormatter._is_section_heading(stripped):
                elements.append(Spacer(1, 0.1*inch))
                elements.append(Paragraph(stripped, heading_style))
                elements.append(Spacer(1, 0.1*inch))
            elif AnalysisFormatter._is_numbered_point(stripped):
                elements.append(Spacer(1, 0.08*inch))
                elements.append(Paragraph(stripped, body_style))
            else:
                elements.append(Paragraph(stripped, body_style))
        
        # Add footer
        elements.append(Spacer(1, 0.3*inch))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#999999'),
            alignment=TA_CENTER
        )
        elements.append(Paragraph(
            "This analysis is based on astrological principles and is for informational purposes only. "
            "It is not a substitute for professional advice.",
            footer_style
        ))
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF content
        pdf_buffer.seek(0)
        return pdf_buffer.getvalue()
    
    @staticmethod
    def _extract_planetary_summary(kundli_data: Dict) -> list:
        """
        Extract key planetary positions from kundli data for summary table
        
        Args:
            kundli_data: Kundli data dictionary
            
        Returns:
            List of [planet, sign, degree] entries
        """
        try:
            summary = []
            
            if isinstance(kundli_data, dict):
                # Look for planets key
                planets_data = kundli_data.get('planets', {})
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
