import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from chat_history_manager import ChatHistoryManager
from context_summary_generator import ContextSummaryGenerator
from kundli_facts_extractor import KundliFactsExtractor

logger = logging.getLogger(__name__)


class ChatService:
    """
    High-level chat service that orchestrates message saving, context generation,
    and facts extraction.
    """
    
    def __init__(
        self,
        chat_manager: ChatHistoryManager,
        summary_generator: ContextSummaryGenerator,
        facts_extractor: KundliFactsExtractor
    ):
        """Initialize ChatService with dependencies"""
        self.chat_manager = chat_manager
        self.summary_generator = summary_generator
        self.facts_extractor = facts_extractor
    
    async def save_user_message(
        self,
        user_folder: str,
        kundli_id: str,
        message_content: str,
        tokens_used: int = 0
    ) -> Dict[str, Any]:
        """
        Save user message immediately (blocking operation).
        
        Args:
            user_folder: User's folder name
            kundli_id: Kundli ID
            message_content: Message text
            tokens_used: Tokens used for this message
            
        Returns:
            Saved message dictionary
        """
        try:
            # Initialize conversation if needed
            if not self.chat_manager.conversation_exists(user_folder, kundli_id):
                logger.info(f"[CHAT_SERVICE] Initializing new conversation for {kundli_id}")
                # Extract user_id from folder (format: timestamp_uuid-name)
                user_id = user_folder.split('-')[-1] if '-' in user_folder else "unknown"
                self.chat_manager.initialize_conversation(user_folder, kundli_id, user_id)
            
            message = {
                "role": "user",
                "content": message_content,
                "timestamp": datetime.now().isoformat(),
                "tokens_used": tokens_used
            }
            
            self.chat_manager.add_message(user_folder, kundli_id, message)
            
            logger.info(f"[CHAT_SERVICE] Saved user message for {kundli_id}")
            return message
        
        except Exception as e:
            logger.error(f"[CHAT_SERVICE] Error saving user message: {str(e)}")
            raise
    
    async def save_assistant_message(
        self,
        user_folder: str,
        kundli_id: str,
        message_content: str,
        tokens_used: int = 0
    ) -> Dict[str, Any]:
        """
        Save assistant message (blocking operation).
        
        Args:
            user_folder: User's folder name
            kundli_id: Kundli ID
            message_content: Message text
            tokens_used: Tokens used for this message
            
        Returns:
            Saved message dictionary
        """
        try:
            message = {
                "role": "assistant",
                "content": message_content,
                "timestamp": datetime.now().isoformat(),
                "tokens_used": tokens_used
            }
            
            self.chat_manager.add_message(user_folder, kundli_id, message)
            
            logger.info(f"[CHAT_SERVICE] Saved assistant message for {kundli_id}")
            return message
        
        except Exception as e:
            logger.error(f"[CHAT_SERVICE] Error saving assistant message: {str(e)}")
            raise
    
    async def trigger_rolling_summary(
        self,
        user_folder: str,
        kundli_id: str,
        kundli_data: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Async background task - trigger rolling summary if needed.
        Does NOT block user's next message.
        
        Args:
            user_folder: User's folder name
            kundli_id: Kundli ID
            kundli_data: Optional kundli data for facts extraction
        """
        try:
            metadata = self.chat_manager.get_conversation_metadata(user_folder, kundli_id)
            if not metadata:
                return
            
            total_messages = metadata.get("total_messages", 0)
            
            # Check if summary should be generated
            if not self.summary_generator.should_generate_summary(
                total_messages,
                metadata.get("summary_version", 0) * self.summary_generator.SUMMARY_TRIGGER_INTERVAL
            ):
                return
            
            logger.info(f"[CHAT_SERVICE] Triggering rolling summary for {kundli_id} (messages: {total_messages})")
            
            # Get previous summary and recent messages
            previous_summary_data = self.chat_manager.get_context_summary(user_folder, kundli_id)
            previous_summary = previous_summary_data.get("summary") if previous_summary_data else None
            
            messages = self.chat_manager.get_messages(user_folder, kundli_id, limit=20)
            
            # Get kundli facts
            kundli_facts = self.chat_manager.get_kundli_facts(user_folder, kundli_id)
            
            # Generate rolling summary
            summary_result = self.summary_generator.generate_rolling_summary(
                previous_summary,
                messages,
                kundli_facts
            )
            
            # Set message counts
            summary_result["message_count_at_generation"] = total_messages
            summary_result["next_summary_at_message"] = total_messages + self.summary_generator.SUMMARY_TRIGGER_INTERVAL
            
            # Update context summary
            self.chat_manager.update_context_summary(user_folder, kundli_id, summary_result)
            
            logger.info(f"[CHAT_SERVICE] Rolling summary generated for {kundli_id}")
        
        except Exception as e:
            logger.error(f"[CHAT_SERVICE] Error in rolling summary task: {str(e)}")
    
    async def trigger_facts_extraction(
        self,
        user_folder: str,
        kundli_id: str,
        ai_response: str,
        kundli_data: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Async background task - extract facts from AI response.
        Does NOT block user interaction.
        
        Args:
            user_folder: User's folder name
            kundli_id: Kundli ID
            ai_response: AI response text
            kundli_data: Optional kundli data for initial facts
        """
        try:
            logger.info(f"[CHAT_SERVICE] Triggering facts extraction for {kundli_id}")
            
            # Get existing facts
            existing_facts = self.chat_manager.get_kundli_facts(user_folder, kundli_id)
            
            # Extract facts from response
            new_facts = self.facts_extractor.extract_facts_from_response(
                ai_response,
                existing_facts
            )
            
            # If we have kundli data and no facts yet, extract from kundli
            if kundli_data and not existing_facts:
                kundli_facts = self.facts_extractor.extract_facts_from_kundli(kundli_data)
                new_facts = self.facts_extractor.merge_facts(kundli_facts, new_facts)
            
            # Update metadata
            metadata = self.chat_manager.get_conversation_metadata(user_folder, kundli_id)
            if metadata:
                new_facts["extracted_from_messages"] = metadata.get("total_messages", 0)
            
            # Update kundli facts
            self.chat_manager.update_kundli_facts(user_folder, kundli_id, new_facts)
            
            logger.info(f"[CHAT_SERVICE] Facts extraction completed for {kundli_id}")
        
        except Exception as e:
            logger.error(f"[CHAT_SERVICE] Error in facts extraction task: {str(e)}")
    
    def get_chat_context(
        self,
        user_folder: str,
        kundli_id: str,
        sliding_window: int = 10
    ) -> Dict[str, Any]:
        """
        Get complete chat context for next API call.
        Returns: facts + summary + recent messages
        
        Args:
            user_folder: User's folder name
            kundli_id: Kundli ID
            sliding_window: Number of recent messages to include
            
        Returns:
            Dictionary with facts, summary, and recent messages
        """
        try:
            facts = self.chat_manager.get_kundli_facts(user_folder, kundli_id)
            summary_data = self.chat_manager.get_context_summary(user_folder, kundli_id)
            messages = self.chat_manager.get_messages(user_folder, kundli_id, limit=sliding_window)
            
            context = {
                "facts": facts or {},
                "summary": summary_data.get("summary") if summary_data else None,
                "key_topics": summary_data.get("key_topics", []) if summary_data else [],
                "recent_messages": messages or []
            }
            
            logger.debug(f"[CHAT_SERVICE] Built chat context for {kundli_id}: {len(messages)} messages")
            return context
        
        except Exception as e:
            logger.error(f"[CHAT_SERVICE] Error building chat context: {str(e)}")
            return {
                "facts": {},
                "summary": None,
                "key_topics": [],
                "recent_messages": []
            }
    
    def get_chat_history(
        self,
        user_folder: str,
        kundli_id: str,
        limit: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Get full chat history for a conversation.
        
        Args:
            user_folder: User's folder name
            kundli_id: Kundli ID
            limit: Optional limit on number of messages
            
        Returns:
            List of messages
        """
        try:
            messages = self.chat_manager.get_messages(user_folder, kundli_id, limit=limit)
            logger.debug(f"[CHAT_SERVICE] Retrieved {len(messages)} messages for {kundli_id}")
            return messages
        
        except Exception as e:
            logger.error(f"[CHAT_SERVICE] Error retrieving chat history: {str(e)}")
            return []
    
    def get_conversation_metadata(
        self,
        user_folder: str,
        kundli_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get conversation metadata.
        
        Args:
            user_folder: User's folder name
            kundli_id: Kundli ID
            
        Returns:
            Metadata dictionary or None
        """
        try:
            return self.chat_manager.get_conversation_metadata(user_folder, kundli_id)
        
        except Exception as e:
            logger.error(f"[CHAT_SERVICE] Error retrieving metadata: {str(e)}")
            return None
    
    async def clear_conversation(
        self,
        user_folder: str,
        kundli_id: str
    ) -> None:
        """
        Clear conversation (archive and reinitialize).
        
        Args:
            user_folder: User's folder name
            kundli_id: Kundli ID
        """
        try:
            self.chat_manager.clear_conversation(user_folder, kundli_id)
            logger.info(f"[CHAT_SERVICE] Cleared conversation for {kundli_id}")
        
        except Exception as e:
            logger.error(f"[CHAT_SERVICE] Error clearing conversation: {str(e)}")
            raise
