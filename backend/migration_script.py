"""
Migration Script - User Folder Structure Redesign
Migrates existing kundlis from flat structure to new organized structure
"""

import os
import json
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

class MigrationScript:
    """Handles migration of user data to new folder structure"""
    
    def __init__(self, users_base_path: str = "users"):
        """Initialize migration script"""
        self.users_base_path = users_base_path
        self.backup_dir = f"{users_base_path}_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.migration_log = []
        self.errors = []
    
    def log(self, message: str, level: str = "INFO"):
        """Log migration progress"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level}] {message}"
        print(log_entry)
        self.migration_log.append(log_entry)
    
    def error(self, message: str):
        """Log error"""
        self.log(message, "ERROR")
        self.errors.append(message)
    
    def create_backup(self) -> bool:
        """Create backup of users directory before migration"""
        try:
            self.log(f"Creating backup of {self.users_base_path} to {self.backup_dir}")
            
            if os.path.exists(self.users_base_path):
                shutil.copytree(self.users_base_path, self.backup_dir)
                self.log(f"Backup created successfully: {self.backup_dir}")
                return True
            else:
                self.error(f"Users directory not found: {self.users_base_path}")
                return False
        except Exception as e:
            self.error(f"Failed to create backup: {str(e)}")
            return False
    
    def migrate_user_folder(self, user_folder_name: str) -> bool:
        """Migrate a single user folder to new structure"""
        try:
            user_folder_path = os.path.join(self.users_base_path, user_folder_name)
            
            if not os.path.isdir(user_folder_path):
                return True  # Skip non-directories
            
            # Skip if already migrated (has Astrology folder)
            if os.path.exists(os.path.join(user_folder_path, "Astrology")):
                self.log(f"Skipping {user_folder_name} - already migrated")
                return True
            
            self.log(f"Migrating user folder: {user_folder_name}")
            
            # Create new folder structure
            astrology_path = os.path.join(user_folder_path, "Astrology")
            palmistry_path = os.path.join(user_folder_path, "Palmistry")
            numerology_path = os.path.join(user_folder_path, "Numerology")
            chats_path = os.path.join(user_folder_path, "Chats")
            
            os.makedirs(astrology_path, exist_ok=True)
            os.makedirs(palmistry_path, exist_ok=True)
            os.makedirs(numerology_path, exist_ok=True)
            os.makedirs(chats_path, exist_ok=True)
            
            self.log(f"Created new folder structure for {user_folder_name}")
            
            # Migrate kundli files
            kundli_count = self._migrate_kundlis(user_folder_path, astrology_path)
            
            # Migrate analysis files
            analysis_count = self._migrate_analysis(user_folder_path, astrology_path)
            
            # Migrate chat files
            chat_count = self._migrate_chats(user_folder_path, chats_path)
            
            # Create per-user kundli index
            self._create_user_kundli_index(user_folder_path, astrology_path)
            
            self.log(f"Completed migration for {user_folder_name}: {kundli_count} kundlis, {analysis_count} analyses, {chat_count} chats")
            return True
            
        except Exception as e:
            self.error(f"Failed to migrate {user_folder_name}: {str(e)}")
            return False
    
    def _migrate_kundlis(self, user_folder_path: str, astrology_path: str) -> int:
        """Migrate kundli files to Astrology folder"""
        count = 0
        kundli_folder = os.path.join(user_folder_path, "kundli")
        
        if not os.path.exists(kundli_folder):
            return count
        
        try:
            for filename in os.listdir(kundli_folder):
                if filename.endswith(".json"):
                    src_path = os.path.join(kundli_folder, filename)
                    
                    # Extract kundli ID from filename or use filename without extension
                    kundli_id = filename.replace(".json", "").replace("_comprehensive_kundli", "")
                    kundli_subfolder = os.path.join(astrology_path, kundli_id)
                    os.makedirs(kundli_subfolder, exist_ok=True)
                    
                    dst_path = os.path.join(kundli_subfolder, filename)
                    shutil.copy2(src_path, dst_path)
                    count += 1
                    self.log(f"Migrated kundli: {filename} -> {kundli_id}/")
            
            # Remove old kundli folder after migration
            if count > 0:
                shutil.rmtree(kundli_folder)
                self.log(f"Removed old kundli folder")
        
        except Exception as e:
            self.error(f"Failed to migrate kundlis: {str(e)}")
        
        return count
    
    def _migrate_analysis(self, user_folder_path: str, astrology_path: str) -> int:
        """Migrate analysis files to respective kundli folders"""
        count = 0
        analysis_folder = os.path.join(user_folder_path, "analysis")
        
        if not os.path.exists(analysis_folder):
            return count
        
        try:
            for filename in os.listdir(analysis_folder):
                if filename.endswith((".txt", ".pdf")):
                    src_path = os.path.join(analysis_folder, filename)
                    
                    # Try to match analysis file to kundli folder
                    # Extract user name from filename (e.g., "Jai_analysis_20260502_205235.txt" -> "Jai")
                    base_name = filename.split("_analysis_")[0] if "_analysis_" in filename else filename.split("_AI_Analysis")[0]
                    
                    # Find matching kundli folder
                    matched = False
                    for kundli_folder in os.listdir(astrology_path):
                        kundli_path = os.path.join(astrology_path, kundli_folder)
                        if os.path.isdir(kundli_path):
                            # Check if this kundli folder contains files for this user
                            for file in os.listdir(kundli_path):
                                if base_name in file or file.startswith(base_name):
                                    # Found matching kundli folder
                                    # Rename analysis file to standard name
                                    ext = ".txt" if filename.endswith(".txt") else ".pdf"
                                    new_filename = f"analysis{ext}"
                                    dst_path = os.path.join(kundli_path, new_filename)
                                    shutil.copy2(src_path, dst_path)
                                    count += 1
                                    self.log(f"Migrated analysis: {filename} -> {kundli_folder}/analysis{ext}")
                                    matched = True
                                    break
                            if matched:
                                break
                    
                    if not matched:
                        # If no matching kundli found, put in first kundli folder
                        kundli_folders = [d for d in os.listdir(astrology_path) if os.path.isdir(os.path.join(astrology_path, d))]
                        if kundli_folders:
                            kundli_path = os.path.join(astrology_path, kundli_folders[0])
                            ext = ".txt" if filename.endswith(".txt") else ".pdf"
                            new_filename = f"analysis{ext}"
                            dst_path = os.path.join(kundli_path, new_filename)
                            shutil.copy2(src_path, dst_path)
                            count += 1
                            self.log(f"Migrated analysis (no match): {filename} -> {kundli_folders[0]}/analysis{ext}")
            
            # Remove old analysis folder after migration
            if count > 0:
                shutil.rmtree(analysis_folder)
                self.log(f"Removed old analysis folder")
        
        except Exception as e:
            self.error(f"Failed to migrate analysis files: {str(e)}")
        
        return count
    
    def _migrate_chats(self, user_folder_path: str, chats_path: str) -> int:
        """Migrate chat files to Chats folder"""
        count = 0
        old_chat_folder = os.path.join(user_folder_path, "chat")
        
        if not os.path.exists(old_chat_folder):
            return count
        
        try:
            chat_history_path = os.path.join(chats_path, "chat_history")
            os.makedirs(chat_history_path, exist_ok=True)
            
            for kundli_id in os.listdir(old_chat_folder):
                src_path = os.path.join(old_chat_folder, kundli_id)
                if os.path.isdir(src_path):
                    dst_path = os.path.join(chat_history_path, kundli_id)
                    shutil.copytree(src_path, dst_path, dirs_exist_ok=True)
                    count += 1
                    self.log(f"Migrated chat: {kundli_id}")
            
            # Remove old chat folder after migration
            if count > 0:
                shutil.rmtree(old_chat_folder)
                self.log(f"Removed old chat folder")
        
        except Exception as e:
            self.error(f"Failed to migrate chats: {str(e)}")
        
        return count
    
    def _create_user_kundli_index(self, user_folder_path: str, astrology_path: str) -> None:
        """Create per-user kundli index"""
        try:
            user_index = {}
            
            for kundli_folder in os.listdir(astrology_path):
                kundli_path = os.path.join(astrology_path, kundli_folder)
                if os.path.isdir(kundli_path):
                    # Find kundli JSON file
                    for filename in os.listdir(kundli_path):
                        if filename.endswith(".json"):
                            file_path = os.path.join(kundli_path, filename)
                            try:
                                with open(file_path, 'r', encoding='utf-8') as f:
                                    kundli_data = json.load(f)
                                    user_index[kundli_folder] = {
                                        'file_path': file_path,
                                        'generated_at': datetime.now().isoformat(),
                                        'migrated': True
                                    }
                            except Exception as e:
                                self.error(f"Failed to read {filename}: {str(e)}")
            
            # Write per-user index
            index_path = os.path.join(astrology_path, "kundli_index.json")
            with open(index_path, 'w', encoding='utf-8') as f:
                json.dump(user_index, f, indent=2, ensure_ascii=False)
            
            self.log(f"Created per-user kundli index with {len(user_index)} entries")
        
        except Exception as e:
            self.error(f"Failed to create user kundli index: {str(e)}")
    
    def run_migration(self, dry_run: bool = False) -> bool:
        """Run the complete migration"""
        self.log("=" * 80)
        self.log("Starting User Folder Structure Migration")
        self.log("=" * 80)
        
        if dry_run:
            self.log("DRY RUN MODE - No changes will be made")
        
        # Create backup
        if not self.create_backup():
            self.error("Backup creation failed - aborting migration")
            return False
        
        # Migrate each user folder
        if not os.path.exists(self.users_base_path):
            self.error(f"Users directory not found: {self.users_base_path}")
            return False
        
        user_folders = sorted([d for d in os.listdir(self.users_base_path) 
                              if os.path.isdir(os.path.join(self.users_base_path, d))])
        
        self.log(f"Found {len(user_folders)} user folders to migrate")
        
        success_count = 0
        for user_folder in user_folders:
            if user_folder == "kundli_index.json":  # Skip index file
                continue
            
            if not dry_run:
                if self.migrate_user_folder(user_folder):
                    success_count += 1
            else:
                self.log(f"[DRY RUN] Would migrate: {user_folder}")
                success_count += 1
        
        # Save migration log
        self._save_migration_log()
        
        # Print summary
        self.log("=" * 80)
        self.log(f"Migration Complete: {success_count}/{len(user_folders)} folders migrated")
        self.log(f"Backup location: {self.backup_dir}")
        self.log(f"Migration log: migration_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
        self.log(f"Errors: {len(self.errors)}")
        self.log("=" * 80)
        
        return len(self.errors) == 0
    
    def _save_migration_log(self) -> None:
        """Save migration log to file"""
        try:
            log_filename = f"migration_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            with open(log_filename, 'w', encoding='utf-8') as f:
                f.write("\n".join(self.migration_log))
            self.log(f"Migration log saved: {log_filename}")
        except Exception as e:
            self.error(f"Failed to save migration log: {str(e)}")
    
    def rollback(self) -> bool:
        """Rollback migration by restoring from backup"""
        try:
            self.log("Rolling back migration...")
            
            if not os.path.exists(self.backup_dir):
                self.error(f"Backup directory not found: {self.backup_dir}")
                return False
            
            # Remove current users directory
            if os.path.exists(self.users_base_path):
                shutil.rmtree(self.users_base_path)
            
            # Restore from backup
            shutil.copytree(self.backup_dir, self.users_base_path)
            self.log("Rollback completed successfully")
            return True
        
        except Exception as e:
            self.error(f"Rollback failed: {str(e)}")
            return False


if __name__ == "__main__":
    import sys
    
    # Parse command line arguments
    dry_run = "--dry-run" in sys.argv
    rollback = "--rollback" in sys.argv
    
    # Initialize migration script
    migration = MigrationScript(users_base_path="users")
    
    if rollback:
        print("WARNING: This will rollback the migration and restore from backup")
        confirm = input("Are you sure? (yes/no): ")
        if confirm.lower() == "yes":
            migration.rollback()
    else:
        # Run migration
        migration.run_migration(dry_run=dry_run)
