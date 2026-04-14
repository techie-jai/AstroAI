"""
File Manager - Handles local file operations for kundli and chart storage
Saves files to local PC, not Firebase
"""

import os
import json
import uuid
import hashlib
from datetime import datetime
from typing import Dict, Optional, Tuple
import re


class FileManager:
    """Manages local file operations for saving kundli and chart data"""
    
    def __init__(self, base_dir: str = "users"):
        """
        Initialize FileManager
        
        Args:
            base_dir: Base directory for storing user data (default: users/)
        """
        self.base_dir = base_dir
        if not os.path.exists(self.base_dir):
            os.makedirs(self.base_dir)
        
        self.index_file = os.path.join(self.base_dir, "kundli_index.json")
        self._ensure_index_exists()
    
    def create_user_folder(self, user_name: str) -> Tuple[str, str]:
        """
        Create a unique folder for the user
        
        Args:
            user_name: User's name
            
        Returns:
            Tuple of (folder_path, unique_id)
        """
        # Generate unique ID
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = f"{timestamp}_{uuid.uuid4().hex[:8]}"
        
        # Sanitize name for folder
        safe_name = re.sub(r'[^\w\s-]', '', user_name).strip().replace(' ', '_')
        if not safe_name:
            safe_name = "User"
        
        # Create folder name
        folder_name = f"{unique_id}-{safe_name}"
        folder_path = os.path.join(self.base_dir, folder_name)
        
        # Create directory structure - only kundli folder
        os.makedirs(folder_path, exist_ok=True)
        os.makedirs(os.path.join(folder_path, "kundli"), exist_ok=True)
        
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
    
    def save_kundli_json(self, folder_path: str, user_name: str, kundli_data: Dict, 
                        counter: int = None, hash_value: str = None) -> str:
        """
        Save kundli data as JSON
        
        Args:
            folder_path: Path to user's folder
            user_name: User's name for filename
            kundli_data: Kundli data dictionary
            counter: Counter for this kundli (optional, for new naming scheme)
            hash_value: Content hash (optional, for new naming scheme)
            
        Returns:
            Path to saved file
        """
        # Use new naming scheme if hash and counter provided
        if hash_value and counter is not None:
            safe_name = re.sub(r'[^\w\s-]', '', user_name).strip().replace(' ', '-')
            filename = f"{safe_name}-Kundli-{counter}-{hash_value}.json"
        else:
            # Fallback to old naming for backward compatibility
            filename = f"{user_name}_Kundli.json"
        
        file_path = os.path.join(folder_path, "kundli", filename)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(kundli_data, f, indent=2, ensure_ascii=False)
        
        return file_path
    
    def save_comprehensive_kundli(self, folder_path: str, user_name: str, comprehensive_kundli: Dict) -> str:
        """
        Save comprehensive Kundli data as JSON (single file approach)
        
        Args:
            folder_path: Path to user's folder
            user_name: User's name for filename
            comprehensive_kundli: Complete Kundli data dictionary
            
        Returns:
            Path to saved file
        """
        # Sanitize name for filename
        safe_name = re.sub(r'[^\w\s-]', '', user_name).strip().replace(' ', '-')
        if not safe_name:
            safe_name = "User"
        
        filename = f"{safe_name}_comprehensive_kundli.json"
        file_path = os.path.join(folder_path, "kundli", filename)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(comprehensive_kundli, f, indent=2, ensure_ascii=False)
        
        return file_path
    
    def get_comprehensive_kundli(self, folder_path: str, user_name: str) -> Optional[Dict]:
        """
        Get comprehensive Kundli data
        
        Args:
            folder_path: Path to user's folder
            user_name: User's name
            
        Returns:
            Comprehensive Kundli data or None if not found
        """
        # Sanitize name for filename
        safe_name = re.sub(r'[^\w\s-]', '', user_name).strip().replace(' ', '-')
        if not safe_name:
            safe_name = "User"
        
        filename = f"{safe_name}_comprehensive_kundli.json"
        file_path = os.path.join(folder_path, "kundli", filename)
        
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        return None
    
    def has_analysis(self, folder_path: str, user_name: str) -> bool:
        """
        Check if analysis exists for a kundli
        
        Args:
            folder_path: Path to user's folder
            user_name: User's name
            
        Returns:
            True if analysis file exists, False otherwise
        """
        analysis_file = os.path.join(folder_path, "analysis", f"{user_name}_AI_Analysis.txt")
        return os.path.exists(analysis_file)
    
    def get_kundli_json_path(self, folder_path: str, user_name: str) -> Optional[str]:
        """
        Get path to kundli JSON file
        
        Args:
            folder_path: Path to user's folder
            user_name: User's name
            
        Returns:
            Path to kundli JSON file if exists, None otherwise
        """
        file_path = os.path.join(folder_path, "kundli", f"{user_name}_Kundli.json")
        return file_path if os.path.exists(file_path) else None
    
    def read_kundli_json(self, file_path: str) -> Optional[Dict]:
        """
        Read kundli JSON file
        
        Args:
            file_path: Path to kundli JSON file
            
        Returns:
            Kundli data dictionary if file exists, None otherwise
        """
        if not os.path.exists(file_path):
            return None
        
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def create_summary_file(self, folder_path: str, summary_data: Dict) -> str:
        """
        Create a summary file with all information
        
        Args:
            folder_path: Path to user's folder
            summary_data: Summary information
            
        Returns:
            Path to saved file
        """
        file_path = os.path.join(folder_path, "summary.txt")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("ASTROLOGICAL ANALYSIS SUMMARY\n")
            f.write("=" * 80 + "\n\n")
            
            f.write(f"Name: {summary_data.get('name', 'N/A')}\n")
            f.write(f"Date of Birth: {summary_data.get('date', 'N/A')}\n")
            f.write(f"Time of Birth: {summary_data.get('time', 'N/A')}\n")
            f.write(f"Place: {summary_data.get('place', 'N/A')}\n")
            f.write(f"Generated: {summary_data.get('generated_at', 'N/A')}\n\n")
            
            f.write("=" * 80 + "\n")
            f.write("FILES GENERATED\n")
            f.write("=" * 80 + "\n\n")
            
            if summary_data.get('kundli_generated'):
                f.write("✓ Kundli JSON\n")
                f.write("✓ Kundli Text\n\n")
            
            for chart_info in summary_data.get('charts', []):
                f.write(f"✓ {chart_info['type']}: {chart_info['name']}\n")
            
            if summary_data.get('analysis_generated'):
                f.write("\n✓ AI Analysis (Text)\n")
                f.write("✓ AI Analysis (PDF)\n")
        
        return file_path
    
    def _get_timestamp(self) -> str:
        """Get current timestamp as ISO format string"""
        return datetime.now().isoformat()
    
    def _ensure_index_exists(self) -> None:
        """Ensure kundli_index.json exists"""
        if not os.path.exists(self.index_file):
            with open(self.index_file, 'w', encoding='utf-8') as f:
                json.dump({}, f, indent=2)
    
    def _read_index(self) -> Dict:
        """Read kundli index from file"""
        try:
            with open(self.index_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    
    def _write_index(self, index: Dict) -> None:
        """Write kundli index to file"""
        with open(self.index_file, 'w', encoding='utf-8') as f:
            json.dump(index, f, indent=2, ensure_ascii=False)
    
    def generate_kundli_hash(self, kundli_data: Dict) -> str:
        """
        Generate a unique hash from the entire kundli JSON
        
        Args:
            kundli_data: Complete kundli data dictionary
            
        Returns:
            8-character hex hash
        """
        # Convert to sorted JSON string for consistent hashing
        json_str = json.dumps(kundli_data, sort_keys=True, ensure_ascii=False)
        hash_obj = hashlib.sha256(json_str.encode('utf-8'))
        return hash_obj.hexdigest()[:8]
    
    def get_next_kundli_counter(self, user_name: str) -> int:
        """
        Get the next counter for a user's kundli
        
        Args:
            user_name: User's name
            
        Returns:
            Next counter value (1-based)
        """
        index = self._read_index()
        safe_name = re.sub(r'[^\w\s-]', '', user_name).strip().replace(' ', '-')
        
        # Count existing kundlis for this user
        count = 0
        for kundli_id in index.keys():
            if kundli_id.startswith(safe_name + '-Kundli-'):
                count += 1
        
        return count + 1
    
    def lookup_kundli(self, kundli_id: str) -> Optional[Dict]:
        """
        Lookup kundli metadata from index
        
        Args:
            kundli_id: Kundli ID (e.g., 'Jai-Kundli-1-a3b4c5d6')
            
        Returns:
            Kundli metadata dict or None if not found
        """
        index = self._read_index()
        return index.get(kundli_id)
    
    def read_kundli_by_id(self, kundli_id: str) -> Optional[Dict]:
        """
        Read kundli data by ID
        
        Args:
            kundli_id: Kundli ID
            
        Returns:
            Kundli data dict or None if not found
        """
        metadata = self.lookup_kundli(kundli_id)
        if not metadata:
            return None
        
        file_path = metadata.get('file_path')
        if not file_path or not os.path.exists(file_path):
            return None
        
        return self.read_kundli_json(file_path)
    
    def add_to_index(self, kundli_id: str, file_path: str, birth_data: Dict, 
                     generated_at: str, hash_value: str, counter: int, uid: str = None) -> None:
        """
        Add kundli to index
        
        Args:
            kundli_id: Kundli ID
            file_path: Path to kundli JSON file
            birth_data: Birth data dictionary
            generated_at: ISO timestamp
            hash_value: Content hash
            counter: Counter value
            uid: User ID (Firebase UID)
        """
        index = self._read_index()
        index[kundli_id] = {
            'file_path': file_path,
            'user_name': birth_data.get('name', 'User'),
            'birth_data': birth_data,
            'generated_at': generated_at,
            'hash': hash_value,
            'counter': counter,
            'uid': uid
        }
        self._write_index(index)
    
    def save_analysis_text(self, user_folder: str, user_name: str, analysis_text: str) -> str:
        """
        Save analysis text to file (for backward compatibility)
        
        Args:
            user_folder: Path to user folder
            user_name: User's name
            analysis_text: Analysis text content
            
        Returns:
            Path to saved analysis text file
        """
        # Create analysis subfolder if it doesn't exist
        analysis_folder = os.path.join(user_folder, "analysis")
        if not os.path.exists(analysis_folder):
            os.makedirs(analysis_folder)
        
        # Generate filename
        safe_name = user_name.replace(' ', '-')
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{safe_name}_analysis_{timestamp}.txt"
        file_path = os.path.join(analysis_folder, filename)
        
        # Save analysis text
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(analysis_text)
        
        print(f"[FILE_MANAGER] Analysis text saved: {file_path}")
        return file_path
    
    def save_analysis_pdf(self, user_folder: str, user_name: str, pdf_content: bytes) -> str:
        """
        Save analysis PDF to file (for backward compatibility)
        
        Args:
            user_folder: Path to user folder
            user_name: User's name
            pdf_content: PDF content as bytes
            
        Returns:
            Path to saved analysis PDF file
        """
        # Create analysis subfolder if it doesn't exist
        analysis_folder = os.path.join(user_folder, "analysis")
        if not os.path.exists(analysis_folder):
            os.makedirs(analysis_folder)
        
        # Generate filename
        safe_name = user_name.replace(' ', '-')
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{safe_name}_analysis_{timestamp}.pdf"
        file_path = os.path.join(analysis_folder, filename)
        
        # Save PDF content
        with open(file_path, 'wb') as f:
            f.write(pdf_content)
        
        print(f"[FILE_MANAGER] Analysis PDF saved: {file_path}")
        return file_path
