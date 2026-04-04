"""
Analysis Text Formatter - Cleans and structures astrological analysis output
Removes markdown formatting, adds proper spacing, and creates clear section hierarchy
"""

import re
from typing import List, Tuple


class AnalysisFormatter:
    """Formats raw analysis text for better presentation"""
    
    @staticmethod
    def format_analysis(raw_text: str) -> str:
        """
        Format raw analysis text with proper structure and spacing
        
        Args:
            raw_text: Raw analysis text from Gemini API
            
        Returns:
            Formatted analysis text with proper structure
        """
        if not raw_text:
            return ""
        
        # Step 1: Clean up markdown formatting
        text = AnalysisFormatter._remove_markdown(raw_text)
        
        # Step 2: Parse and structure sections
        text = AnalysisFormatter._structure_sections(text)
        
        # Step 3: Clean up spacing and formatting
        text = AnalysisFormatter._clean_spacing(text)
        
        return text.strip()
    
    @staticmethod
    def _remove_markdown(text: str) -> str:
        """Remove markdown formatting like ** and * """
        # Remove bold markdown (**text** -> text)
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
        
        # Remove italic markdown (*text* -> text)
        text = re.sub(r'\*([^*]+)\*', r'\1', text)
        
        # Remove underscores used for emphasis (_text_ -> text)
        text = re.sub(r'_([^_]+)_', r'\1', text)
        
        return text
    
    @staticmethod
    def _structure_sections(text: str) -> str:
        """Add proper structure and spacing to sections"""
        lines = text.split('\n')
        structured_lines = []
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            if not stripped:
                # Preserve empty lines but limit consecutive ones
                if structured_lines and structured_lines[-1].strip():
                    structured_lines.append('')
                continue
            
            # Detect section headings (numbered or all caps)
            if AnalysisFormatter._is_section_heading(stripped):
                # Add spacing before heading if not at start
                if structured_lines and structured_lines[-1].strip():
                    structured_lines.append('')
                structured_lines.append(stripped)
                structured_lines.append('')
            
            # Detect numbered points (1. 2. 3. etc)
            elif AnalysisFormatter._is_numbered_point(stripped):
                # Add spacing before numbered point
                if structured_lines and structured_lines[-1].strip():
                    structured_lines.append('')
                structured_lines.append(stripped)
                structured_lines.append('')
            
            # Regular paragraph text
            else:
                structured_lines.append(stripped)
        
        return '\n'.join(structured_lines)
    
    @staticmethod
    def _is_section_heading(text: str) -> bool:
        """Check if text is a section heading"""
        # Check for patterns like "I. " or "1. " at start
        if re.match(r'^[IVX]+\.\s+', text):
            return True
        if re.match(r'^\d+\.\s+[A-Z]', text) and len(text) > 20 and text.count(' ') < 10:
            return True
        # Check for all caps headings
        if text.isupper() and len(text) > 5 and len(text) < 100:
            return True
        # Check for quoted headings
        if text.startswith('"') and text.endswith('"') and len(text) > 10:
            return True
        return False
    
    @staticmethod
    def _is_numbered_point(text: str) -> bool:
        """Check if text is a numbered point"""
        # Match patterns like "1. Text" or "1) Text"
        return bool(re.match(r'^\d+[\.\)]\s+', text))
    
    @staticmethod
    def _clean_spacing(text: str) -> str:
        """Clean up spacing and formatting"""
        lines = text.split('\n')
        cleaned_lines = []
        prev_empty = False
        
        for line in lines:
            stripped = line.strip()
            
            if not stripped:
                # Limit consecutive empty lines to 1
                if not prev_empty:
                    cleaned_lines.append('')
                    prev_empty = True
            else:
                cleaned_lines.append(stripped)
                prev_empty = False
        
        # Remove trailing empty lines
        while cleaned_lines and not cleaned_lines[-1].strip():
            cleaned_lines.pop()
        
        return '\n'.join(cleaned_lines)
    
    @staticmethod
    def get_sections(text: str) -> List[Tuple[str, str]]:
        """
        Parse text into sections for structured display
        
        Args:
            text: Formatted analysis text
            
        Returns:
            List of (section_title, section_content) tuples
        """
        sections = []
        current_section = None
        current_content = []
        
        lines = text.split('\n')
        
        for line in lines:
            stripped = line.strip()
            
            if not stripped:
                if current_content:
                    current_content.append('')
                continue
            
            # Check if this is a section heading
            if AnalysisFormatter._is_section_heading(stripped):
                # Save previous section
                if current_section:
                    content = '\n'.join(current_content).strip()
                    if content:
                        sections.append((current_section, content))
                
                current_section = stripped
                current_content = []
            else:
                current_content.append(stripped)
        
        # Save last section
        if current_section:
            content = '\n'.join(current_content).strip()
            if content:
                sections.append((current_section, content))
        
        return sections
