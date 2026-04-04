#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
API Client - Handles communication with AstroAI backend
"""

import requests
import json
from typing import Dict, Optional
from datetime import datetime


class AstroAIAPIClient:
    """Client for communicating with AstroAI backend API"""
    
    def __init__(self, base_url: str = "http://localhost:8000", auth_token: str = None):
        """
        Initialize API client
        
        Args:
            base_url: Backend API base URL
            auth_token: Firebase auth token for authenticated requests
        """
        self.base_url = base_url.rstrip('/')
        self.auth_token = auth_token
        self.session = requests.Session()
        
        if auth_token:
            self.session.headers.update({
                'Authorization': f'Bearer {auth_token}'
            })
    
    def set_auth_token(self, token: str):
        """Update authentication token"""
        self.auth_token = token
        self.session.headers.update({
            'Authorization': f'Bearer {token}'
        })
    
    def save_kundli(self, birth_data: Dict, kundli_data: Dict, chart_types: list = None) -> Optional[Dict]:
        """
        Save kundli to backend database
        
        Args:
            birth_data: Birth information dictionary
            kundli_data: Generated kundli data
            chart_types: List of chart types generated (default: D1, D7, D9, D10)
            
        Returns:
            Response dictionary with kundli_id or None if failed
        """
        try:
            if chart_types is None:
                chart_types = ['D1', 'D7', 'D9', 'D10']
            
            payload = {
                'birth_data': birth_data,
                'include_charts': True,
                'chart_types': chart_types
            }
            
            url = f"{self.base_url}/api/kundli/generate"
            response = self.session.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[API] Error saving kundli: {response.status_code} - {response.text}")
                return None
        
        except requests.exceptions.ConnectionError:
            print(f"[API] Connection error: Could not reach backend at {self.base_url}")
            return None
        except Exception as e:
            print(f"[API] Error saving kundli: {str(e)}")
            return None
    
    def get_kundli(self, kundli_id: str) -> Optional[Dict]:
        """
        Retrieve kundli from backend
        
        Args:
            kundli_id: Kundli ID to retrieve
            
        Returns:
            Kundli data or None if failed
        """
        try:
            url = f"{self.base_url}/api/kundli/{kundli_id}"
            response = self.session.get(url, timeout=30)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[API] Error retrieving kundli: {response.status_code}")
                return None
        
        except Exception as e:
            print(f"[API] Error retrieving kundli: {str(e)}")
            return None
    
    def generate_analysis(self, kundli_id: str, analysis_type: str = 'comprehensive') -> Optional[Dict]:
        """
        Generate AI analysis for kundli
        
        Args:
            kundli_id: Kundli ID to analyze
            analysis_type: Type of analysis
            
        Returns:
            Analysis result or None if failed
        """
        try:
            payload = {
                'kundli_id': kundli_id,
                'analysis_type': analysis_type
            }
            
            url = f"{self.base_url}/api/analysis/generate"
            response = self.session.post(url, json=payload, timeout=60)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[API] Error generating analysis: {response.status_code}")
                return None
        
        except Exception as e:
            print(f"[API] Error generating analysis: {str(e)}")
            return None
    
    def get_user_profile(self) -> Optional[Dict]:
        """
        Get current user profile
        
        Returns:
            User profile data or None if failed
        """
        try:
            url = f"{self.base_url}/api/user/profile"
            response = self.session.get(url, timeout=30)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[API] Error retrieving profile: {response.status_code}")
                return None
        
        except Exception as e:
            print(f"[API] Error retrieving profile: {str(e)}")
            return None
    
    def is_backend_available(self) -> bool:
        """
        Check if backend is available
        
        Returns:
            True if backend is reachable, False otherwise
        """
        try:
            url = f"{self.base_url}/docs"
            response = self.session.get(url, timeout=5)
            return response.status_code == 200
        except:
            return False
