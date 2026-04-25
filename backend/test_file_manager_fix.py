#!/usr/bin/env python3
"""
Quick test to verify FileManager.get_user_folder() works correctly
"""

import os
import json
import tempfile
from file_manager import FileManager


def test_get_user_folder():
    """Test that get_user_folder method works"""
    print("\n" + "="*60)
    print("Testing FileManager.get_user_folder()")
    print("="*60)
    
    with tempfile.TemporaryDirectory() as tmpdir:
        fm = FileManager(base_dir=tmpdir)
        
        # Create a user folder
        print("\n[TEST 1] Create user folder...")
        folder_path, unique_id = fm.create_user_folder("Test User")
        print(f"✅ Created folder: {folder_path}")
        
        # Save some kundli data with uid
        print("\n[TEST 2] Save kundli with uid...")
        birth_data = {
            "name": "Test User",
            "day": 15,
            "month": 6,
            "year": 1990
        }
        
        test_uid = "test_firebase_uid_12345"
        fm.add_to_index(
            kundli_id="test-kundli-1",
            file_path=os.path.join(folder_path, "kundli", "test.json"),
            birth_data=birth_data,
            generated_at="2026-04-26T00:00:00",
            hash_value="abc123",
            counter=1,
            uid=test_uid
        )
        print(f"✅ Added kundli to index with uid: {test_uid}")
        
        # Test get_user_folder
        print("\n[TEST 3] Get user folder by uid...")
        retrieved_folder = fm.get_user_folder(test_uid)
        
        if retrieved_folder:
            print(f"✅ Retrieved folder: {retrieved_folder}")
            
            # Verify it matches
            expected_folder = os.path.basename(folder_path)
            if retrieved_folder == expected_folder:
                print(f"✅ Folder name matches: {retrieved_folder}")
                return True
            else:
                print(f"❌ Folder mismatch. Expected: {expected_folder}, Got: {retrieved_folder}")
                return False
        else:
            print(f"❌ Failed to retrieve folder for uid: {test_uid}")
            return False


if __name__ == "__main__":
    success = test_get_user_folder()
    
    print("\n" + "="*60)
    if success:
        print("✅ TEST PASSED: FileManager.get_user_folder() works correctly")
        print("Chat history integration should now work!")
    else:
        print("❌ TEST FAILED: FileManager.get_user_folder() has issues")
    print("="*60)
    
    exit(0 if success else 1)
