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
        # Resolve to absolute path - prioritize parent directory (project root)
        if os.path.isabs(base_dir):
            # Absolute path provided, use as-is
            self.base_dir = os.path.normpath(base_dir)
        else:
            # For relative paths, always use parent directory (project root)
            # This ensures we use E:\25. Codes\17. AstroAI V3\AstroAi\users
            # not E:\25. Codes\17. AstroAI V3\AstroAi\backend\users
            parent_path = os.path.normpath(os.path.abspath(os.path.join("..", base_dir)))
            
            # If parent path exists, use it (preferred for project root)
            if os.path.exists(parent_path):
                self.base_dir = parent_path
            # Otherwise check current directory
            elif os.path.exists(base_dir):
                self.base_dir = os.path.abspath(base_dir)
            # Default to parent directory
            else:
                self.base_dir = parent_path
        
        if not os.path.exists(self.base_dir):
            os.makedirs(self.base_dir)
        
        print(f"[FILE_MANAGER] Using users directory: {self.base_dir}")
        
        # Note: Per-user index files are created in each user folder
        # No global index file is used anymore
    
    def get_or_create_user_folder(self, user_name: str, uid: str = None, email: str = None) -> Tuple[str, str]:
        """
        Get existing user folder or create a new one if it doesn't exist
        
        Args:
            user_name: User's name
            uid: Firebase UID (optional)
            email: User's email (optional)
            
        Returns:
            Tuple of (folder_path, unique_id)
        """
        # If email provided, check if user folder already exists
        if email:
            safe_email = re.sub(r'[^\w.-]', '', email).strip()
            expected_folder_name = f"user_{safe_email}"
            # Look for existing folder with this email
            for folder_name in os.listdir(self.base_dir):
                folder_path = os.path.join(self.base_dir, folder_name)
                if os.path.isdir(folder_path) and folder_name == expected_folder_name:
                    print(f"[FILE_MANAGER] Found existing user folder: {folder_path}")
                    return folder_path, uid
        
        # If no existing folder found, create a new one
        return self.create_user_folder(user_name, uid=uid, email=email)
    
    def create_user_folder(self, user_name: str, uid: str = None, email: str = None) -> Tuple[str, str]:
        """
        Create a unique folder for the user with new structure
        
        Args:
            user_name: User's name
            uid: Firebase UID (optional)
            email: User's email (optional)
            
        Returns:
            Tuple of (folder_path, unique_id)
        """
        # Generate unique ID for internal use
        unique_id = uid if uid else uuid.uuid4().hex[:8]
        
        # Create folder name - use email if provided, otherwise use sanitized user name
        if email:
            # Use email as folder name with user_ prefix (simple and clean)
            safe_email = re.sub(r'[^\w.-]', '', email).strip()
            folder_name = f"user_{safe_email}"
        else:
            # Fallback: use sanitized user name
            safe_name = re.sub(r'[^\w\s-]', '', user_name).strip().replace(' ', '_')
            if not safe_name:
                safe_name = "User"
            folder_name = safe_name
        
        folder_path = os.path.join(self.base_dir, folder_name)
        
        # Create directory structure with 4 main subfolders
        os.makedirs(folder_path, exist_ok=True)
        os.makedirs(os.path.join(folder_path, "Astrology"), exist_ok=True)
        os.makedirs(os.path.join(folder_path, "Palmistry"), exist_ok=True)
        os.makedirs(os.path.join(folder_path, "Numerology"), exist_ok=True)
        os.makedirs(os.path.join(folder_path, "Chats"), exist_ok=True)
        
        print(f"[FILE_MANAGER] Created user folder structure: {folder_path}")
        
        return folder_path, unique_id
    
    def save_user_info(self, folder_path: str, user_data: Dict, kundli_id: str = None) -> str:
        """
        Save user information to JSON file in the kundli subfolder
        
        Args:
            folder_path: Path to user's folder
            user_data: Dictionary containing user birth data
            kundli_id: Kundli ID for new structure (optional)
            
        Returns:
            Path to saved file
        """
        # Save in kundli subfolder if kundli_id provided
        if kundli_id:
            file_path = os.path.join(folder_path, "Astrology", kundli_id, "user_info.json")
        else:
            # Fallback to old structure (user folder level)
            file_path = os.path.join(folder_path, "user_info.json")
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Add metadata
        user_data['generated_at'] = datetime.now().isoformat()
        user_data['version'] = '1.0.0'
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(user_data, f, indent=2, ensure_ascii=False)
        
        return file_path
    
    def create_kundli_subfolder(self, folder_path: str, kundli_id: str) -> str:
        """
        Create a subfolder for a specific kundli
        
        Args:
            folder_path: Path to user's folder
            kundli_id: Kundli ID
            
        Returns:
            Path to kundli subfolder
        """
        kundli_folder = os.path.join(folder_path, "Astrology", kundli_id)
        os.makedirs(kundli_folder, exist_ok=True)
        return kundli_folder
    
    def get_astrology_path(self, folder_path: str) -> str:
        """Get Astrology folder path"""
        return os.path.join(folder_path, "Astrology")
    
    def get_palmistry_path(self, folder_path: str) -> str:
        """Get Palmistry folder path"""
        return os.path.join(folder_path, "Palmistry")
    
    def get_numerology_path(self, folder_path: str) -> str:
        """Get Numerology folder path"""
        return os.path.join(folder_path, "Numerology")
    
    def get_chats_path(self, folder_path: str) -> str:
        """Get Chats folder path"""
        return os.path.join(folder_path, "Chats")
    
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
        # Normalize the path to resolve any .. references
        file_path = os.path.normpath(file_path)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(kundli_data, f, indent=2, ensure_ascii=False)
        
        return file_path
    
    def save_comprehensive_kundli(self, folder_path: str, user_name: str, comprehensive_kundli: Dict, kundli_id: str = None) -> str:
        """
        Save comprehensive Kundli data as JSON (single file approach)
        
        Args:
            folder_path: Path to user's folder
            user_name: User's name for filename
            comprehensive_kundli: Complete Kundli data dictionary
            kundli_id: Kundli ID for new structure (optional)
            
        Returns:
            Path to saved file
        """
        # Sanitize name for filename
        safe_name = re.sub(r'[^\w\s-]', '', user_name).strip().replace(' ', '-')
        if not safe_name:
            safe_name = "User"
        
        filename = f"{safe_name}_comprehensive_kundli.json"
        
        # Use new Astrology structure if kundli_id provided
        if kundli_id:
            file_path = os.path.join(folder_path, "Astrology", kundli_id, filename)
        else:
            # Fallback to old structure for backward compatibility
            file_path = os.path.join(folder_path, "kundli", filename)
        
        # Normalize the path to resolve any .. references
        file_path = os.path.normpath(file_path)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Ensure D10 data is included in the comprehensive kundli
        kundli_to_save = comprehensive_kundli.copy()
        
        # Add D10 data if not already present (for LLM analysis)
        if 'd10_chart' not in kundli_to_save and 'd10_chart' in comprehensive_kundli:
            kundli_to_save['d10_chart'] = comprehensive_kundli['d10_chart']
        if 'd10_raw' not in kundli_to_save and 'd10_raw' in comprehensive_kundli:
            kundli_to_save['d10_raw'] = comprehensive_kundli['d10_raw']
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(kundli_to_save, f, indent=2, ensure_ascii=False)
        
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
    
    def has_analysis(self, folder_path: str, user_name: str, kundli_id: str = None) -> bool:
        """
        Check if analysis exists for a kundli
        
        Args:
            folder_path: Path to user's folder
            user_name: User's name
            kundli_id: Kundli ID for new structure (optional)
            
        Returns:
            True if analysis file exists, False otherwise
        """
        # Check new structure first if kundli_id provided
        if kundli_id:
            analysis_file = os.path.join(folder_path, "Astrology", kundli_id, "analysis.txt")
            if os.path.exists(analysis_file):
                return True
            analysis_file = os.path.join(folder_path, "Astrology", kundli_id, "analysis.pdf")
            if os.path.exists(analysis_file):
                return True
        
        # Check old structure for backward compatibility
        analysis_folder = os.path.join(folder_path, "analysis")
        if not os.path.isdir(analysis_folder):
            return False
        
        safe_name = user_name.replace(' ', '-')
        for file in os.listdir(analysis_folder):
            if file.endswith(".txt"):
                if file.startswith(f"{safe_name}_analysis_"):
                    return True
                if file == f"{user_name}_AI_Analysis.txt":
                    return True
        return False
    
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
    
    def _get_user_index_file(self, user_folder: str) -> str:
        """
        Get path to per-user kundli index file
        
        Args:
            user_folder: Path to user's folder
            
        Returns:
            Path to user's kundli_index.json
        """
        return os.path.join(user_folder, "kundli_index.json")
    
    def _ensure_user_index_exists(self, user_folder: str) -> None:
        """Ensure per-user kundli_index.json exists"""
        index_file = self._get_user_index_file(user_folder)
        if not os.path.exists(index_file):
            with open(index_file, 'w', encoding='utf-8') as f:
                json.dump({}, f, indent=2)
    
    def _read_user_index(self, user_folder: str) -> Dict:
        """Read per-user kundli index from file"""
        index_file = self._get_user_index_file(user_folder)
        try:
            with open(index_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    
    def _write_user_index(self, user_folder: str, index: Dict) -> None:
        """Write per-user kundli index to file"""
        self._ensure_user_index_exists(user_folder)
        index_file = self._get_user_index_file(user_folder)
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(index, f, indent=2, ensure_ascii=False)
    
    def _read_index(self) -> Dict:
        """
        Read all kundlis from all user folders (global index)
        
        This is for backward compatibility with existing code that expects
        a global index. It aggregates all per-user indexes into one dict.
        
        Returns:
            Dictionary with all kundlis from all users
        """
        global_index = {}
        try:
            for folder_name in os.listdir(self.base_dir):
                folder_path = os.path.join(self.base_dir, folder_name)
                if os.path.isdir(folder_path):
                    user_index = self._read_user_index(folder_path)
                    global_index.update(user_index)
        except (OSError, PermissionError):
            pass
        
        return global_index
    
    def _write_index(self, global_index: Dict) -> None:
        """
        Write global index back to per-user index files
        
        This takes a global index (aggregated from all users) and writes
        each kundli back to its corresponding user's kundli_index.json
        
        Args:
            global_index: Dictionary with all kundlis from all users
        """
        try:
            # Group kundlis by user folder
            user_kundlis = {}
            
            for kundli_id, kundli_data in global_index.items():
                if isinstance(kundli_data, dict):
                    file_path = kundli_data.get('file_path', '')
                    if file_path:
                        # Extract user folder from file path
                        # file_path is like: users/user_email/Astrology/kundli_id/...
                        if '\\' in file_path:
                            parts = file_path.split('\\')
                        else:
                            parts = file_path.split('/')
                        
                        # Find the user folder (should be at index 1 if path starts with 'users')
                        if len(parts) >= 2 and parts[0] == 'users':
                            user_folder_name = parts[1]
                            user_folder_path = os.path.join(self.base_dir, user_folder_name)
                            
                            if user_folder_path not in user_kundlis:
                                user_kundlis[user_folder_path] = {}
                            
                            user_kundlis[user_folder_path][kundli_id] = kundli_data
            
            # Write each user's kundlis to their index file
            for user_folder_path, kundlis in user_kundlis.items():
                self._write_user_index(user_folder_path, kundlis)
                print(f"[FILE_MANAGER] Updated index for user folder: {user_folder_path}")
        
        except Exception as e:
            print(f"[FILE_MANAGER] Error writing global index: {str(e)}")
    
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
    
    def get_next_kundli_counter(self, user_folder: str, user_name: str) -> int:
        """
        Get the next counter for a user's kundli
        
        Args:
            user_folder: Path to user's folder
            user_name: User's name
            
        Returns:
            Next counter value (1-based)
        """
        index = self._read_user_index(user_folder)
        safe_name = re.sub(r'[^\w\s-]', '', user_name).strip().replace(' ', '-')
        
        # Count existing kundlis for this user
        count = 0
        for kundli_id in index.keys():
            if kundli_id.startswith(safe_name + '-Kundli-'):
                count += 1
        
        return count + 1
    
    def lookup_kundli(self, user_folder_or_id: str, kundli_id: str = None) -> Optional[Dict]:
        """
        Lookup kundli metadata from user's index
        
        Supports two calling conventions for backward compatibility:
        1. lookup_kundli(user_folder, kundli_id) - New per-user index
        2. lookup_kundli(kundli_id) - Legacy global index (searches all user folders)
        
        Args:
            user_folder_or_id: Either user folder path or kundli_id (if kundli_id param is None)
            kundli_id: Kundli ID (e.g., 'Jai-Kundli-1-a3b4c5d6') - optional for backward compat
            
        Returns:
            Kundli metadata dict or None if not found
        """
        # If kundli_id is provided, use new per-user index approach
        if kundli_id is not None:
            user_folder = user_folder_or_id
            index = self._read_user_index(user_folder)
            return index.get(kundli_id)
        
        # Backward compatibility: search all user folders for the kundli_id
        # This is slower but maintains compatibility with existing code
        search_kundli_id = user_folder_or_id
        try:
            for folder_name in os.listdir(self.base_dir):
                folder_path = os.path.join(self.base_dir, folder_name)
                if os.path.isdir(folder_path):
                    index = self._read_user_index(folder_path)
                    if search_kundli_id in index:
                        return index.get(search_kundli_id)
        except (OSError, PermissionError):
            pass
        
        return None
    
    def read_kundli_by_id(self, user_folder_or_id: str, kundli_id: str = None) -> Optional[Dict]:
        """
        Read kundli data by ID
        
        Supports two calling conventions for backward compatibility:
        1. read_kundli_by_id(user_folder, kundli_id) - New per-user approach
        2. read_kundli_by_id(kundli_id) - Legacy global search
        
        Args:
            user_folder_or_id: Either user folder path or kundli_id
            kundli_id: Kundli ID (optional for backward compat)
            
        Returns:
            Kundli data dict or None if not found
        """
        metadata = self.lookup_kundli(user_folder_or_id, kundli_id)
        if not metadata:
            return None
        
        file_path = metadata.get('file_path')
        if not file_path or not os.path.exists(file_path):
            return None
        
        return self.read_kundli_json(file_path)
    
    def add_to_index(self, user_folder: str, kundli_id: str, file_path: str, birth_data: Dict, 
                     generated_at: str, hash_value: str, counter: int, uid: str = None) -> None:
        """
        Add kundli to user's index
        
        Args:
            user_folder: Path to user's folder
            kundli_id: Kundli ID
            file_path: Path to kundli JSON file
            birth_data: Birth data dictionary
            generated_at: ISO timestamp
            hash_value: Content hash
            counter: Counter value
            uid: User ID (Firebase UID)
        """
        index = self._read_user_index(user_folder)
        index[kundli_id] = {
            'file_path': file_path,
            'user_name': birth_data.get('name', 'User'),
            'birth_data': birth_data,
            'generated_at': generated_at,
            'hash': hash_value,
            'counter': counter,
            'uid': uid
        }
        self._write_user_index(user_folder, index)
    
    def save_analysis_text(self, user_folder: str, user_name: str, analysis_text: str, kundli_id: str = None) -> str:
        """
        Save analysis text to file in the same kundli subfolder
        
        Args:
            user_folder: Path to user folder
            user_name: User's name
            analysis_text: Analysis text content
            kundli_id: Kundli ID for new structure (optional)
            
        Returns:
            Path to saved analysis text file
        """
        # Use new structure if kundli_id provided
        if kundli_id:
            # Save in the same kundli subfolder
            analysis_folder = os.path.join(user_folder, "Astrology", kundli_id)
            filename = "analysis.txt"
        else:
            # Fallback to old structure
            analysis_folder = os.path.join(user_folder, "analysis")
            safe_name = user_name.replace(' ', '-')
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{safe_name}_analysis_{timestamp}.txt"
        
        # Ensure directory exists
        os.makedirs(analysis_folder, exist_ok=True)
        
        file_path = os.path.join(analysis_folder, filename)
        
        # Save analysis text
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(analysis_text)
        
        print(f"[FILE_MANAGER] Analysis text saved: {file_path}")
        return file_path
    
    def save_analysis_pdf(self, user_folder: str, user_name: str, pdf_content: bytes, kundli_id: str = None) -> str:
        """
        Save analysis PDF to file in the same kundli subfolder
        
        Args:
            user_folder: Path to user folder
            user_name: User's name
            pdf_content: PDF content as bytes
            kundli_id: Kundli ID for new structure (optional)
            
        Returns:
            Path to saved analysis PDF file
        """
        print(f"[FILE_MANAGER] save_analysis_pdf called with kundli_id={kundli_id}, user_folder={user_folder}")
        
        # Use new structure if kundli_id provided
        if kundli_id:
            # Save in the same kundli subfolder
            analysis_folder = os.path.join(user_folder, "Astrology", kundli_id)
            filename = "analysis.pdf"
            print(f"[FILE_MANAGER] Using new structure: {analysis_folder}")
        else:
            # Fallback to old structure
            analysis_folder = os.path.join(user_folder, "analysis")
            safe_name = user_name.replace(' ', '-')
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{safe_name}_analysis_{timestamp}.pdf"
            print(f"[FILE_MANAGER] Using fallback structure: {analysis_folder}")
        
        # Ensure directory exists
        os.makedirs(analysis_folder, exist_ok=True)
        
        file_path = os.path.join(analysis_folder, filename)
        
        # Save PDF content
        with open(file_path, 'wb') as f:
            f.write(pdf_content)
        
        print(f"[FILE_MANAGER] Analysis PDF saved: {file_path}")
        return file_path
    
    def get_user_folder(self, uid: str) -> Optional[str]:
        """
        Get user folder path from Firebase UID
        
        Args:
            uid: Firebase user ID
            
        Returns:
            User folder name if found, None otherwise
        """
        try:
            index = self._read_index()
            
            # Search through kundlis to find one with matching uid
            for kundli_id, kundli_data in index.items():
                if kundli_data.get('uid') == uid:
                    # Extract folder name from file_path
                    file_path = kundli_data.get('file_path', '')
                    if file_path:
                        # file_path is like: users/20260411_224143_a6adaac1-Shreya_Rao/kundli/...
                        parts = file_path.split(os.sep)
                        if len(parts) >= 2 and parts[0] == 'users':
                            folder_name = parts[1]
                            print(f"[FILE_MANAGER] Found user folder by uid in index: {folder_name}")
                            return folder_name
            
            # If not found in index (old kundlis), search user folders directly
            print(f"[FILE_MANAGER] UID not found in index, searching user folders...")
            if os.path.exists(self.base_dir):
                # Sort folders to ensure consistent order
                folders = sorted(os.listdir(self.base_dir))
                for folder_name in folders:
                    folder_path = os.path.join(self.base_dir, folder_name)
                    if not os.path.isdir(folder_path):
                        continue
                    
                    # Check user_info.json in the folder
                    user_info_path = os.path.join(folder_path, 'user_info.json')
                    if os.path.exists(user_info_path):
                        try:
                            with open(user_info_path, 'r', encoding='utf-8') as f:
                                user_info = json.load(f)
                                folder_uid = user_info.get('uid')
                                if folder_uid == uid:
                                    print(f"[FILE_MANAGER] Found user folder by uid in user_info.json: {folder_name} (uid: {uid})")
                                    # Verify by checking if any kundlis in this folder match
                                    kundli_folder = os.path.join(folder_path, 'kundli')
                                    if os.path.exists(kundli_folder):
                                        print(f"[FILE_MANAGER] Verified: Found kundli folder in {folder_name}")
                                        return folder_name
                        except Exception as e:
                            print(f"[FILE_MANAGER] Error reading user_info.json in {folder_name}: {e}")
                            continue
            
            print(f"[FILE_MANAGER] WARNING: No user folder found for uid: {uid}")
            return None
        except Exception as e:
            print(f"[FILE_MANAGER] Error getting user folder for uid {uid}: {e}")
            return None
