#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
Gemini Analyzer - Sends kundli data to Google Gemini API for astrological analysis
"""

import json
import os
from typing import Dict, Optional
from PyQt6.QtCore import QObject, pyqtSignal, QThread


class GeminiAnalyzerWorker(QObject):
    """Worker thread for Gemini API analysis"""
    
    analysis_complete = pyqtSignal(str, str)  # (analysis_text, analysis_json_path)
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
            
            self.progress.emit("Saving analysis...")
            
            # Save analysis as JSON file
            analysis_json_path = self._save_analysis_json(analysis_result)
            
            self.progress.emit("Analysis complete")
            self.analysis_complete.emit(analysis_result, analysis_json_path)
            
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
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        return response.text
    
    def _save_analysis_json(self, analysis_text: str) -> str:
        """
        Save analysis result as JSON file named 'kundli_analyzed'
        
        Args:
            analysis_text: Analysis text from Gemini API
            
        Returns:
            Path to saved JSON file
        """
        # Get the directory of the kundli JSON file
        kundli_dir = os.path.dirname(self.kundli_json_path)
        
        # Create analysis JSON file path
        analysis_json_path = os.path.join(kundli_dir, "kundli_analyzed.json")
        
        # Prepare analysis data
        analysis_data = {
            "analysis": analysis_text,
            "kundli_source": self.kundli_json_path,
            "kundli_data": self.kundli_data
        }
        
        # Save as JSON
        with open(analysis_json_path, 'w', encoding='utf-8') as f:
            json.dump(analysis_data, f, indent=2, ensure_ascii=False)
        
        return analysis_json_path


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
