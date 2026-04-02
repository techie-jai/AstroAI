#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
File Manager - Handles file operations for AstroAI chart generation
Creates user directories and saves charts in multiple formats
"""

import os
import json
import uuid
from datetime import datetime
from typing import Dict, List
import re


class FileManager:
    """Manages file operations for saving user data and charts"""
    
    def __init__(self, base_dir: str = "users"):
        """
        Initialize FileManager
        
        Args:
            base_dir: Base directory for storing user data
        """
        self.base_dir = base_dir
        if not os.path.exists(self.base_dir):
            os.makedirs(self.base_dir)
    
    def create_user_folder(self, name: str) -> tuple:
        """
        Create a unique folder for the user
        
        Args:
            name: User's name
            
        Returns:
            Tuple of (folder_path, unique_id)
        """
        # Generate unique ID
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = f"{timestamp}_{uuid.uuid4().hex[:8]}"
        
        # Sanitize name for folder
        safe_name = re.sub(r'[^\w\s-]', '', name).strip().replace(' ', '_')
        if not safe_name:
            safe_name = "User"
        
        # Create folder name
        folder_name = f"{unique_id}-{safe_name}"
        folder_path = os.path.join(self.base_dir, folder_name)
        
        # Create directory structure
        os.makedirs(folder_path, exist_ok=True)
        os.makedirs(os.path.join(folder_path, "charts", "json"), exist_ok=True)
        os.makedirs(os.path.join(folder_path, "charts", "text"), exist_ok=True)
        os.makedirs(os.path.join(folder_path, "charts", "images"), exist_ok=True)
        
        return folder_path, unique_id
    
    def save_user_info(self, folder_path: str, user_data: Dict) -> str:
        """
        Save user information to JSON file
        
        Args:
            folder_path: Path to user's folder
            user_data: Dictionary containing user birth data
            
        Returns:
            Path to saved file
        """
        file_path = os.path.join(folder_path, "user_info.json")
        
        # Add metadata
        user_data['generated_at'] = datetime.now().isoformat()
        user_data['version'] = '1.0.0'
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(user_data, f, indent=2, ensure_ascii=False)
        
        return file_path
    
    def save_chart_json(self, folder_path: str, chart_type: str, chart_data: Dict) -> str:
        """
        Save chart data as JSON
        
        Args:
            folder_path: Path to user's folder
            chart_type: Chart type (e.g., 'D1', 'D9')
            chart_data: Chart data dictionary
            
        Returns:
            Path to saved file
        """
        file_path = os.path.join(folder_path, "charts", "json", f"{chart_type}.json")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(chart_data, f, indent=2, ensure_ascii=False)
        
        return file_path
    
    def save_chart_text(self, folder_path: str, chart_type: str, chart_text: str) -> str:
        """
        Save chart as formatted text
        
        Args:
            folder_path: Path to user's folder
            chart_type: Chart type (e.g., 'D1', 'D9')
            chart_text: Formatted text representation
            
        Returns:
            Path to saved file
        """
        file_path = os.path.join(folder_path, "charts", "text", f"{chart_type}.txt")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(chart_text)
        
        return file_path
    
    def save_chart_image(self, folder_path: str, chart_type: str, image_data) -> str:
        """
        Save chart as PNG image
        
        Args:
            folder_path: Path to user's folder
            chart_type: Chart type (e.g., 'D1', 'D9')
            image_data: QPixmap or PIL Image object
            
        Returns:
            Path to saved file
        """
        file_path = os.path.join(folder_path, "charts", "images", f"{chart_type}.png")
        
        # Handle QPixmap
        if hasattr(image_data, 'save'):
            image_data.save(file_path)
        else:
            # Handle PIL Image
            image_data.save(file_path, 'PNG')
        
        return file_path
    
    def get_all_chart_files(self, folder_path: str) -> Dict[str, List[str]]:
        """
        Get list of all generated chart files
        
        Args:
            folder_path: Path to user's folder
            
        Returns:
            Dictionary with file types as keys and file lists as values
        """
        charts_dir = os.path.join(folder_path, "charts")
        
        result = {
            'json': [],
            'text': [],
            'images': []
        }
        
        for file_type in result.keys():
            type_dir = os.path.join(charts_dir, file_type)
            if os.path.exists(type_dir):
                result[file_type] = [
                    os.path.join(type_dir, f) 
                    for f in os.listdir(type_dir) 
                    if os.path.isfile(os.path.join(type_dir, f))
                ]
        
        return result
    
    def create_summary_file(self, folder_path: str, summary_data: Dict) -> str:
        """
        Create a summary file with all chart information
        
        Args:
            folder_path: Path to user's folder
            summary_data: Summary information
            
        Returns:
            Path to saved file
        """
        file_path = os.path.join(folder_path, "charts_summary.txt")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("ASTROLOGICAL CHARTS SUMMARY\n")
            f.write("=" * 80 + "\n\n")
            
            f.write(f"Name: {summary_data.get('name', 'N/A')}\n")
            f.write(f"Date of Birth: {summary_data.get('date', 'N/A')}\n")
            f.write(f"Time of Birth: {summary_data.get('time', 'N/A')}\n")
            f.write(f"Place: {summary_data.get('place', 'N/A')}\n")
            f.write(f"Generated: {summary_data.get('generated_at', 'N/A')}\n\n")
            
            f.write("=" * 80 + "\n")
            f.write("CHARTS GENERATED\n")
            f.write("=" * 80 + "\n\n")
            
            for chart_info in summary_data.get('charts', []):
                f.write(f"{chart_info['type']}: {chart_info['name']}\n")
                f.write(f"  Signification: {chart_info['signification']}\n\n")
        
        return file_path
    
    def _get_timestamp(self) -> str:
        """Get current timestamp as ISO format string"""
        return datetime.now().isoformat()
