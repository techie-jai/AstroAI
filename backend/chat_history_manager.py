import os
import json
import shutil
import time
from datetime import datetime
from typing import Optional, List, Dict, Any
from pathlib import Path
import logging
from filelock import FileLock, Timeout

logger = logging.getLogger(__name__)


class ChatHistoryManager:
    """
    Manages chat history with atomic file writes and file locking.
    Prevents race conditions and data corruption.
    """
    
    LOCK_TIMEOUT = 5  # seconds
    LOCK_RETRY_DELAY = 0.1  # seconds
    MAX_RETRIES = 3
    
    def __init__(self, users_path: str = "users"):
        """Initialize ChatHistoryManager with users directory path"""
        self.users_path = users_path
        self._ensure_path_exists(users_path)
    
    def _ensure_path_exists(self, path: str) -> None:
        """Ensure directory path exists"""
        Path(path).mkdir(parents=True, exist_ok=True)
    
    def _get_chat_dir(self, user_folder: str, kundli_id: str) -> str:
        """Get chat directory for a kundli"""
        return os.path.join(self.users_path, user_folder, "chat", kundli_id)
    
    def _get_lock_path(self, file_path: str) -> str:
        """Get lock file path for a given file"""
        return f"{file_path}.lock"
    
    def _write_atomic(self, file_path: str, data: Dict[str, Any]) -> None:
        """
        Write data atomically using temporary file + rename pattern.
        Guarantees file is never left in corrupted state.
        """
        # Ensure directory exists
        self._ensure_path_exists(os.path.dirname(file_path))
        
        tmp_path = f"{file_path}.tmp"
        lock_path = self._get_lock_path(file_path)
        
        retry_count = 0
        while retry_count < self.MAX_RETRIES:
            try:
                # Acquire lock
                lock = FileLock(lock_path, timeout=self.LOCK_TIMEOUT)
                with lock:
                    # Write to temporary file
                    with open(tmp_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, default=str)
                    
                    # Atomic rename (OS-level guarantee)
                    if os.path.exists(file_path):
                        os.remove(file_path)
                    os.rename(tmp_path, file_path)
                    
                    logger.debug(f"[CHAT_HISTORY] Atomically wrote: {file_path}")
                    return
            
            except Timeout:
                retry_count += 1
                if retry_count < self.MAX_RETRIES:
                    logger.warning(f"[CHAT_HISTORY] Lock timeout for {file_path}, retrying... ({retry_count}/{self.MAX_RETRIES})")
                    time.sleep(self.LOCK_RETRY_DELAY)
                else:
                    logger.error(f"[CHAT_HISTORY] Failed to acquire lock after {self.MAX_RETRIES} retries: {file_path}")
                    raise
            
            except Exception as e:
                logger.error(f"[CHAT_HISTORY] Error during atomic write: {str(e)}")
                # Clean up temporary file
                if os.path.exists(tmp_path):
                    try:
                        os.remove(tmp_path)
                    except:
                        pass
                raise
        
        # Clean up stale temporary files
        self._cleanup_stale_tmp_files(file_path)
    
    def _read_with_lock(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Read file with lock to prevent reading during write.
        """
        if not os.path.exists(file_path):
            return None
        
        lock_path = self._get_lock_path(file_path)
        
        try:
            lock = FileLock(lock_path, timeout=self.LOCK_TIMEOUT)
            with lock:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    logger.debug(f"[CHAT_HISTORY] Read with lock: {file_path}")
                    return data
        
        except Timeout:
            logger.warning(f"[CHAT_HISTORY] Lock timeout reading {file_path}, returning None")
            return None
        
        except json.JSONDecodeError as e:
            logger.error(f"[CHAT_HISTORY] JSON decode error in {file_path}: {str(e)}")
            return None
        
        except Exception as e:
            logger.error(f"[CHAT_HISTORY] Error reading file: {str(e)}")
            return None
    
    def _cleanup_stale_tmp_files(self, file_path: str) -> None:
        """Clean up stale temporary files"""
        tmp_path = f"{file_path}.tmp"
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
                logger.debug(f"[CHAT_HISTORY] Cleaned up stale tmp file: {tmp_path}")
            except Exception as e:
                logger.warning(f"[CHAT_HISTORY] Failed to clean up tmp file: {str(e)}")
    
    def initialize_conversation(self, user_folder: str, kundli_id: str, user_id: str) -> None:
        """Initialize a new conversation"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        self._ensure_path_exists(chat_dir)
        
        # Initialize metadata
        metadata = {
            "kundli_id": kundli_id,
            "user_id": user_id,
            "created_at": datetime.now().isoformat(),
            "last_activity": datetime.now().isoformat(),
            "total_messages": 0,
            "total_tokens_used": 0,
            "status": "active",
            "summary_version": 0
        }
        
        metadata_path = os.path.join(chat_dir, "metadata.json")
        self._write_atomic(metadata_path, metadata)
        
        # Initialize empty messages file
        messages_path = os.path.join(chat_dir, "messages.json")
        self._write_atomic(messages_path, [])
        
        logger.info(f"[CHAT_HISTORY] Initialized conversation: {kundli_id}")
    
    def add_message(self, user_folder: str, kundli_id: str, message: Dict[str, Any]) -> None:
        """Add a message to conversation (atomic append)"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        messages_path = os.path.join(chat_dir, "messages.json")
        metadata_path = os.path.join(chat_dir, "metadata.json")
        
        # Read existing messages
        messages = self._read_with_lock(messages_path) or []
        
        # Append new message
        messages.append(message)
        
        # Write atomically
        self._write_atomic(messages_path, messages)
        
        # Update metadata
        metadata = self._read_with_lock(metadata_path) or {}
        metadata["last_activity"] = datetime.now().isoformat()
        metadata["total_messages"] = len(messages)
        metadata["total_tokens_used"] = metadata.get("total_tokens_used", 0) + message.get("tokens_used", 0)
        self._write_atomic(metadata_path, metadata)
        
        logger.debug(f"[CHAT_HISTORY] Added message to {kundli_id}, total: {len(messages)}")
    
    def get_messages(self, user_folder: str, kundli_id: str, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get messages from conversation"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        messages_path = os.path.join(chat_dir, "messages.json")
        
        messages = self._read_with_lock(messages_path) or []
        
        if limit:
            messages = messages[-limit:]
        
        return messages
    
    def get_context_summary(self, user_folder: str, kundli_id: str) -> Optional[Dict[str, Any]]:
        """Get context summary for conversation"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        summary_path = os.path.join(chat_dir, "context_summary.json")
        
        return self._read_with_lock(summary_path)
    
    def update_context_summary(self, user_folder: str, kundli_id: str, summary: Dict[str, Any]) -> None:
        """Update context summary (atomic)"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        summary_path = os.path.join(chat_dir, "context_summary.json")
        
        # Add timestamp
        summary["generated_at"] = datetime.now().isoformat()
        
        self._write_atomic(summary_path, summary)
        
        # Update metadata version
        metadata_path = os.path.join(chat_dir, "metadata.json")
        metadata = self._read_with_lock(metadata_path) or {}
        metadata["summary_version"] = metadata.get("summary_version", 0) + 1
        self._write_atomic(metadata_path, metadata)
        
        logger.debug(f"[CHAT_HISTORY] Updated context summary for {kundli_id}")
    
    def get_kundli_facts(self, user_folder: str, kundli_id: str) -> Optional[Dict[str, Any]]:
        """Get kundli facts for conversation"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        facts_path = os.path.join(chat_dir, "kundli_facts.json")
        
        return self._read_with_lock(facts_path)
    
    def update_kundli_facts(self, user_folder: str, kundli_id: str, facts: Dict[str, Any]) -> None:
        """Update kundli facts (atomic)"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        facts_path = os.path.join(chat_dir, "kundli_facts.json")
        
        # Add timestamp
        facts["extracted_at"] = datetime.now().isoformat()
        
        self._write_atomic(facts_path, facts)
        
        logger.debug(f"[CHAT_HISTORY] Updated kundli facts for {kundli_id}")
    
    def get_conversation_metadata(self, user_folder: str, kundli_id: str) -> Optional[Dict[str, Any]]:
        """Get conversation metadata"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        metadata_path = os.path.join(chat_dir, "metadata.json")
        
        return self._read_with_lock(metadata_path)
    
    def clear_conversation(self, user_folder: str, kundli_id: str) -> None:
        """Clear conversation (archive by renaming)"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        
        if os.path.exists(chat_dir):
            # Archive with timestamp
            archive_dir = f"{chat_dir}_archived_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            shutil.move(chat_dir, archive_dir)
            logger.info(f"[CHAT_HISTORY] Archived conversation: {archive_dir}")
            
            # Reinitialize empty conversation
            user_id = self.get_conversation_metadata(user_folder, kundli_id).get("user_id", "unknown")
            self.initialize_conversation(user_folder, kundli_id, user_id)
    
    def conversation_exists(self, user_folder: str, kundli_id: str) -> bool:
        """Check if conversation exists"""
        chat_dir = self._get_chat_dir(user_folder, kundli_id)
        return os.path.exists(chat_dir) and os.path.exists(os.path.join(chat_dir, "metadata.json"))
