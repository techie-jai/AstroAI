import os
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List
from pathlib import Path
from gemini_vision_service import GeminiVisionService
from file_manager import FileManager

logger = logging.getLogger(__name__)


class PalmistryService:
    """Service for managing palmistry readings and analysis"""

    def __init__(self):
        """Initialize palmistry service"""
        self.gemini_service = GeminiVisionService()
        self.file_manager = FileManager()

    def analyze_palm_images(self, left_hand_image: str, right_hand_image: str, handedness: str, user_id: str, name: str = None, user_folder_path: str = None) -> Dict[str, Any]:
        """
        Analyze palm images and generate palmistry reading
        
        Args:
            left_hand_image: Base64 encoded left hand image
            right_hand_image: Base64 encoded right hand image
            handedness: User's handedness ('left' or 'right')
            user_id: User's Firebase UID
            name: Optional name to identify the reading
            user_folder_path: Path to user's folder (optional, will be created if not provided)
            
        Returns:
            Complete palmistry analysis with metadata
        """
        try:
            # Get or create user folder if not provided
            if not user_folder_path:
                print(f"[PALMISTRY_SERVICE] User folder path not provided, creating new one...")
                user_folder_path, _ = self.file_manager.get_or_create_user_folder(name or "User", uid=user_id)
            else:
                print(f"[PALMISTRY_SERVICE] Using provided user folder path: {user_folder_path}")
            
            # Generate unique palmistry ID with optional name
            import uuid
            unique_id = str(uuid.uuid4())[:8]
            if name and name.strip():
                # Format: name_entered-unique_id
                palmistry_id = f"{name.strip().replace(' ', '_')}-{unique_id}"
            else:
                # Format: random_string-unique_id
                palmistry_id = f"palmistry-{unique_id}"
            
            print(f"[PALMISTRY_SERVICE] Starting analysis for user {user_id}, palmistry_id: {palmistry_id}")
            print(f"[PALMISTRY_SERVICE] User folder path: {user_folder_path}")
            
            # Analyze images with Gemini
            logger.info(f"Analyzing palm images for user {user_id}")
            print(f"[PALMISTRY_SERVICE] Calling gemini_service.analyze_palm_images...")
            analysis_data = self.gemini_service.analyze_palm_images(
                left_hand_image,
                right_hand_image,
                handedness
            )
            print(f"[PALMISTRY_SERVICE] Gemini analysis completed, got response")
            
            # Create metadata
            metadata = {
                "palmistry_id": palmistry_id,
                "user_id": user_id,
                "created_at": datetime.now().isoformat(),
                "handedness": handedness,
                **analysis_data
            }
            
            # Save palmistry reading
            print(f"[PALMISTRY_SERVICE] Saving palmistry reading...")
            self.save_palmistry_reading(user_folder_path, palmistry_id, left_hand_image, right_hand_image, metadata)
            print(f"[PALMISTRY_SERVICE] Palmistry reading saved successfully")
            
            # Return response
            response = {
                "palmistry_id": palmistry_id,
                "handedness": handedness,
                "hand_type": analysis_data.get("hand_type"),
                "elemental_type": analysis_data.get("elemental_type"),
                "palm_shape": analysis_data.get("palm_shape"),
                "finger_length": analysis_data.get("finger_length"),
                "major_lines": analysis_data.get("major_lines", {}),
                "mounts": analysis_data.get("mounts", {}),
                "overall_reading": analysis_data.get("overall_reading"),
                "life_areas": analysis_data.get("life_areas", {}),
                "created_at": datetime.now().isoformat(),
                "metadata": metadata
            }
            print(f"[PALMISTRY_SERVICE] Returning response with palmistry_id: {palmistry_id}")
            return response
            
        except Exception as e:
            logger.error(f"Error analyzing palm images: {str(e)}")
            raise

    def save_palmistry_reading(self, user_folder_path: str, palmistry_id: str, left_hand_image: str, right_hand_image: str, metadata: Dict[str, Any]) -> None:
        """
        Save palmistry reading to filesystem
        
        Args:
            user_folder_path: Path to user's folder
            palmistry_id: Unique palmistry reading ID
            left_hand_image: Base64 encoded left hand image
            right_hand_image: Base64 encoded right hand image
            metadata: Complete palmistry metadata
        """
        try:
            # Create palmistry directory inside user's Palmistry folder
            palmistry_dir = Path(user_folder_path) / "Palmistry" / palmistry_id
            print(f"[PALMISTRY_SERVICE] Creating palmistry directory: {palmistry_dir}")
            palmistry_dir.mkdir(parents=True, exist_ok=True)
            
            print(f"[PALMISTRY_SERVICE] Created palmistry directory: {palmistry_dir}")
            print(f"[PALMISTRY_SERVICE] Directory exists: {palmistry_dir.exists()}")
            
            # Save images
            try:
                left_hand_path = palmistry_dir / "left_hand.jpg"
                print(f"[PALMISTRY_SERVICE] Saving left hand image to: {left_hand_path}")
                self._save_base64_image(left_hand_image, left_hand_path)
                print(f"[PALMISTRY_SERVICE] Left hand image saved, file exists: {left_hand_path.exists()}")
            except Exception as e:
                print(f"[PALMISTRY_SERVICE] ERROR saving left hand image: {str(e)}")
                raise
            
            try:
                right_hand_path = palmistry_dir / "right_hand.jpg"
                print(f"[PALMISTRY_SERVICE] Saving right hand image to: {right_hand_path}")
                self._save_base64_image(right_hand_image, right_hand_path)
                print(f"[PALMISTRY_SERVICE] Right hand image saved, file exists: {right_hand_path.exists()}")
            except Exception as e:
                print(f"[PALMISTRY_SERVICE] ERROR saving right hand image: {str(e)}")
                raise
            
            print(f"[PALMISTRY_SERVICE] Saved hand images")
            
            # Save metadata
            try:
                metadata_file = palmistry_dir / "metadata.json"
                print(f"[PALMISTRY_SERVICE] Saving metadata.json to: {metadata_file}")
                with open(metadata_file, 'w') as f:
                    json.dump(metadata, f, indent=2, default=str)
                print(f"[PALMISTRY_SERVICE] Saved metadata.json, file exists: {metadata_file.exists()}")
            except Exception as e:
                print(f"[PALMISTRY_SERVICE] ERROR saving metadata.json: {str(e)}")
                raise
            
            # Save results summary
            try:
                results_file = palmistry_dir / "results.json"
                results_summary = {
                    "palmistry_id": palmistry_id,
                    "created_at": metadata.get("created_at"),
                    "handedness": metadata.get("handedness"),
                    "hand_type": metadata.get("hand_type"),
                    "elemental_type": metadata.get("elemental_type"),
                    "life_areas": metadata.get("life_areas"),
                    "overall_reading": metadata.get("overall_reading")
                }
                print(f"[PALMISTRY_SERVICE] Saving results.json to: {results_file}")
                with open(results_file, 'w') as f:
                    json.dump(results_summary, f, indent=2, default=str)
                print(f"[PALMISTRY_SERVICE] Saved results.json, file exists: {results_file.exists()}")
            except Exception as e:
                print(f"[PALMISTRY_SERVICE] ERROR saving results.json: {str(e)}")
                raise
            
            # Update palmistry index
            user_id = metadata.get("user_id")
            self._update_palmistry_index(user_id, palmistry_id, metadata)
            
            logger.info(f"Saved palmistry reading {palmistry_id} to {palmistry_dir}")
            
        except Exception as e:
            print(f"[PALMISTRY_SERVICE] CRITICAL ERROR in save_palmistry_reading: {str(e)}")
            import traceback
            print(f"[PALMISTRY_SERVICE] Traceback: {traceback.format_exc()}")
            logger.error(f"Error saving palmistry reading: {str(e)}")
            raise

    def load_palmistry_reading(self, user_id: str, palmistry_id: str) -> Dict[str, Any]:
        """
        Load palmistry reading from filesystem
        
        Args:
            user_id: User's Firebase UID
            palmistry_id: Unique palmistry reading ID
            
        Returns:
            Complete palmistry metadata
        """
        try:
            # Find user folder by searching for one with matching uid
            user_folder_path = None
            base_dir = Path("users")
            
            if base_dir.exists():
                for folder in base_dir.iterdir():
                    if folder.is_dir():
                        user_info_file = folder / "user_info.json"
                        if user_info_file.exists():
                            try:
                                with open(user_info_file, 'r') as f:
                                    user_info = json.load(f)
                                    if user_info.get("uid") == user_id or user_info.get("user_id") == user_id:
                                        user_folder_path = folder
                                        break
                            except:
                                pass
            
            if not user_folder_path:
                raise FileNotFoundError(f"User folder not found for user_id {user_id}")
            
            metadata_file = user_folder_path / "Palmistry" / palmistry_id / "metadata.json"
            
            if not metadata_file.exists():
                raise FileNotFoundError(f"Palmistry reading {palmistry_id} not found")
            
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)
            
            return metadata
            
        except Exception as e:
            logger.error(f"Error loading palmistry reading: {str(e)}")
            raise

    def get_user_palmistry_list(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get list of all palmistry readings for a user
        
        Args:
            user_id: User's Firebase UID
            
        Returns:
            List of palmistry readings
        """
        try:
            # Find user folder by searching for one with matching uid
            user_folder_path = None
            base_dir = Path("users")
            
            if base_dir.exists():
                for folder in base_dir.iterdir():
                    if folder.is_dir():
                        user_info_file = folder / "user_info.json"
                        if user_info_file.exists():
                            try:
                                with open(user_info_file, 'r') as f:
                                    user_info = json.load(f)
                                    if user_info.get("uid") == user_id or user_info.get("user_id") == user_id:
                                        user_folder_path = folder
                                        break
                            except:
                                pass
            
            if not user_folder_path:
                return []
            
            palmistry_base_dir = user_folder_path / "Palmistry"
            
            if not palmistry_base_dir.exists():
                return []
            
            readings = []
            for reading_dir in sorted(palmistry_base_dir.iterdir(), reverse=True):
                if reading_dir.is_dir():
                    results_file = reading_dir / "results.json"
                    if results_file.exists():
                        with open(results_file, 'r') as f:
                            reading_data = json.load(f)
                            readings.append(reading_data)
            
            return readings
            
        except Exception as e:
            logger.error(f"Error getting palmistry list: {str(e)}")
            return []

    def delete_palmistry_reading(self, user_id: str, palmistry_id: str) -> bool:
        """
        Delete a palmistry reading
        
        Args:
            user_id: User's Firebase UID
            palmistry_id: Unique palmistry reading ID
            
        Returns:
            True if deleted successfully
        """
        try:
            # Find user folder by searching for one with matching uid
            user_folder_path = None
            base_dir = Path("users")
            
            if base_dir.exists():
                for folder in base_dir.iterdir():
                    if folder.is_dir():
                        user_info_file = folder / "user_info.json"
                        if user_info_file.exists():
                            try:
                                with open(user_info_file, 'r') as f:
                                    user_info = json.load(f)
                                    if user_info.get("uid") == user_id or user_info.get("user_id") == user_id:
                                        user_folder_path = folder
                                        break
                            except:
                                pass
            
            if not user_folder_path:
                logger.warning(f"Could not find user folder for user_id {user_id}")
                return False
            
            palmistry_dir = user_folder_path / "Palmistry" / palmistry_id
            
            if palmistry_dir.exists():
                import shutil
                shutil.rmtree(palmistry_dir)
                
                # Update index
                self._remove_from_palmistry_index(user_id, palmistry_id)
                
                logger.info(f"Deleted palmistry reading {palmistry_id} for user {user_id}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error deleting palmistry reading: {str(e)}")
            return False

    def _save_base64_image(self, base64_data: str, filepath: Path) -> None:
        """
        Save base64 encoded image to file
        
        Args:
            base64_data: Base64 encoded image data
            filepath: Path to save image
        """
        import base64
        
        # Remove data URI prefix if present
        if ',' in base64_data:
            base64_data = base64_data.split(',')[1]
        
        # Decode and save
        image_data = base64.b64decode(base64_data)
        with open(filepath, 'wb') as f:
            f.write(image_data)

    def _update_palmistry_index(self, user_id: str, palmistry_id: str, metadata: Dict[str, Any]) -> None:
        """
        Update palmistry index file
        
        Args:
            user_id: User's Firebase UID
            palmistry_id: Unique palmistry reading ID
            metadata: Palmistry metadata
        """
        try:
            # Find user folder by searching for one with matching uid
            user_folder_path = None
            base_dir = Path("users")
            
            if base_dir.exists():
                for folder in base_dir.iterdir():
                    if folder.is_dir():
                        # Check if this folder contains a user_info.json or matches the uid pattern
                        user_info_file = folder / "user_info.json"
                        if user_info_file.exists():
                            try:
                                with open(user_info_file, 'r') as f:
                                    user_info = json.load(f)
                                    if user_info.get("uid") == user_id or user_info.get("user_id") == user_id:
                                        user_folder_path = folder
                                        break
                            except:
                                pass
            
            if not user_folder_path:
                logger.warning(f"Could not find user folder for user_id {user_id}, skipping index update")
                return
            
            # Create palmistry_index.json in user folder
            index_file = user_folder_path / "palmistry_index.json"
            
            # Load existing index
            index_data = {}
            if index_file.exists():
                with open(index_file, 'r') as f:
                    index_data = json.load(f)
            
            # Add new entry
            index_data[palmistry_id] = {
                "created_at": metadata.get("created_at"),
                "handedness": metadata.get("handedness"),
                "hand_type": metadata.get("hand_type"),
                "elemental_type": metadata.get("elemental_type")
            }
            
            # Save updated index
            with open(index_file, 'w') as f:
                json.dump(index_data, f, indent=2, default=str)
            
            print(f"[PALMISTRY_SERVICE] Updated palmistry index at {index_file}")
            
        except Exception as e:
            logger.error(f"Error updating palmistry index: {str(e)}")

    def _remove_from_palmistry_index(self, user_id: str, palmistry_id: str) -> None:
        """
        Remove entry from palmistry index
        
        Args:
            user_id: User's Firebase UID
            palmistry_id: Unique palmistry reading ID
        """
        try:
            # Find user folder by searching for one with matching uid
            user_folder_path = None
            base_dir = Path("users")
            
            if base_dir.exists():
                for folder in base_dir.iterdir():
                    if folder.is_dir():
                        user_info_file = folder / "user_info.json"
                        if user_info_file.exists():
                            try:
                                with open(user_info_file, 'r') as f:
                                    user_info = json.load(f)
                                    if user_info.get("uid") == user_id or user_info.get("user_id") == user_id:
                                        user_folder_path = folder
                                        break
                            except:
                                pass
            
            if not user_folder_path:
                logger.warning(f"Could not find user folder for user_id {user_id}")
                return
            
            index_file = user_folder_path / "palmistry_index.json"
            
            if index_file.exists():
                with open(index_file, 'r') as f:
                    index_data = json.load(f)
                
                if palmistry_id in index_data:
                    del index_data[palmistry_id]
                
                with open(index_file, 'w') as f:
                    json.dump(index_data, f, indent=2, default=str)
            
        except Exception as e:
            logger.error(f"Error removing from palmistry index: {str(e)}")
