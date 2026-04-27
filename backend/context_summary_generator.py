import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from gemini_service import GeminiService

logger = logging.getLogger(__name__)


class ContextSummaryGenerator:
    """
    Generates rolling context summaries for chat conversations.
    Uses incremental updates instead of full re-summarization to prevent context dilution.
    """
    
    SUMMARY_TRIGGER_INTERVAL = 10  # Trigger every 10 messages
    TOKEN_THRESHOLD = 2000  # Or when tokens exceed this
    
    def __init__(self, gemini_service: Optional[GeminiService] = None):
        """Initialize with Gemini service"""
        self.gemini_service = gemini_service or GeminiService()
        if not self.gemini_service.initialized:
            logger.warning("[CONTEXT_SUMMARY] Gemini service not initialized")
    
    def should_generate_summary(self, total_messages: int, previous_summary_at: int) -> bool:
        """
        Check if rolling summary should be generated.
        
        Args:
            total_messages: Total messages in conversation
            previous_summary_at: Message count when last summary was generated
            
        Returns:
            True if summary should be generated
        """
        messages_since_summary = total_messages - previous_summary_at
        return messages_since_summary >= self.SUMMARY_TRIGGER_INTERVAL
    
    def generate_rolling_summary(
        self,
        previous_summary: Optional[str],
        new_messages: List[Dict[str, Any]],
        kundli_facts: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate rolling summary by updating previous summary with new messages.
        This prevents context dilution from repeated full summarization.
        
        Args:
            previous_summary: Previous context summary text (if exists)
            new_messages: New messages to incorporate (oldest being dropped from context)
            kundli_facts: Kundli facts for context
            
        Returns:
            Dictionary with updated summary and metadata
        """
        if not self.gemini_service.initialized:
            logger.error("[CONTEXT_SUMMARY] Gemini service not initialized")
            return {
                "summary": previous_summary or "No summary available",
                "key_topics": [],
                "message_count_at_generation": 0,
                "next_summary_at_message": self.SUMMARY_TRIGGER_INTERVAL
            }
        
        try:
            # Format messages for prompt
            formatted_messages = "\n".join([
                f"{msg.get('role', 'unknown').upper()}: {msg.get('content', '')[:200]}..."
                for msg in new_messages[-5:]  # Last 5 messages for context
            ])
            
            # Build prompt for rolling summary
            if previous_summary:
                prompt = f"""You are a conversation analyst. Update this existing context summary with new information.

PREVIOUS SUMMARY:
{previous_summary}

NEW MESSAGES (oldest being dropped from context):
{formatted_messages}

KUNDLI CONTEXT:
{json.dumps(kundli_facts, indent=2, default=str) if kundli_facts else "No kundli facts available"}

INSTRUCTIONS:
1. Preserve important facts from previous summary
2. Add new context from new messages
3. Remove outdated or superseded information
4. Keep it concise (max 300 words)
5. Focus on user's concerns, questions, and AI insights
6. Maintain continuity with earlier discussions

Return ONLY the updated summary, no preamble or explanation."""
            else:
                prompt = f"""You are a conversation analyst. Create a concise summary of this conversation.

MESSAGES:
{formatted_messages}

KUNDLI CONTEXT:
{json.dumps(kundli_facts, indent=2, default=str) if kundli_facts else "No kundli facts available"}

INSTRUCTIONS:
1. Summarize the conversation trajectory and key topics
2. Focus on user's concerns and questions
3. Note any astrological insights discussed
4. Keep it concise (max 300 words)
5. Extract 3-5 key topics

Return ONLY the summary, no preamble."""
            
            logger.info("[CONTEXT_SUMMARY] Generating rolling summary...")
            response = self.gemini_service.model.generate_content(prompt)
            summary_text = response.text
            
            # Extract key topics
            key_topics = self._extract_key_topics(summary_text)
            
            result = {
                "summary": summary_text,
                "key_topics": key_topics,
                "generated_at": datetime.now().isoformat(),
                "message_count_at_generation": 0,  # Will be set by caller
                "next_summary_at_message": 0  # Will be set by caller
            }
            
            logger.info(f"[CONTEXT_SUMMARY] Generated summary with {len(key_topics)} key topics")
            return result
        
        except Exception as e:
            logger.error(f"[CONTEXT_SUMMARY] Error generating summary: {str(e)}")
            return {
                "summary": previous_summary or "Error generating summary",
                "key_topics": [],
                "message_count_at_generation": 0,
                "next_summary_at_message": self.SUMMARY_TRIGGER_INTERVAL
            }
    
    def _extract_key_topics(self, summary_text: str) -> List[str]:
        """
        Extract key topics from summary text.
        Simple extraction based on common astrological terms.
        """
        topics = []
        
        # Common astrological topics
        astrological_terms = [
            "career", "marriage", "relationships", "health", "wealth", "finance",
            "family", "children", "education", "spirituality", "timing", "dasha",
            "dosha", "compatibility", "remedies", "planets", "houses", "signs",
            "moon", "sun", "mars", "venus", "mercury", "jupiter", "saturn",
            "rahu", "ketu", "ascendant", "birth chart", "kundli"
        ]
        
        summary_lower = summary_text.lower()
        
        for term in astrological_terms:
            if term in summary_lower:
                topics.append(term)
        
        # Remove duplicates and limit to 5
        topics = list(set(topics))[:5]
        
        return topics
