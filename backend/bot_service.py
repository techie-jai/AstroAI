import json
from typing import Dict, Any, Optional, List
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from bot_utils import UserSession, BotMessage, BotPlatform, BotState, parse_date_input, parse_time_input
from firebase_config import FirebaseService
from bot_firebase import BotFirebaseService
from astrology_service import AstrologyService
from gemini_service import GeminiService
import logging

logger = logging.getLogger(__name__)

class BotService(ABC):
    """Abstract base class for bot services (WhatsApp, Telegram)"""
    
    def __init__(self, platform: BotPlatform):
        self.platform = platform
        self.sessions: Dict[str, UserSession] = {}
        self.gemini_service = GeminiService()
        self.session_timeout = timedelta(hours=24)
    
    def get_or_create_session(self, user_id: str, phone_number: str) -> UserSession:
        """Get existing session or create new one"""
        if user_id in self.sessions:
            session = self.sessions[user_id]
            session.last_activity = datetime.utcnow()
            return session
        
        session = UserSession(user_id, phone_number, self.platform)
        self.sessions[user_id] = session
        return session
    
    def save_session_to_firebase(self, session: UserSession) -> str:
        """Save session to Firebase"""
        try:
            session_data = session.to_dict()
            BotFirebaseService.save_bot_session(session.user_id, session_data)
            BotFirebaseService.save_bot_user(session.phone_number, self.platform.value, {'name': session.birth_data.get('name', '')})
            logger.info(f"Session saved for user {session.user_id}")
            return session.user_id
        except Exception as e:
            logger.error(f"Failed to save session: {str(e)}")
            raise
    
    def load_session_from_firebase(self, user_id: str) -> Optional[UserSession]:
        """Load session from Firebase"""
        try:
            session_data = BotFirebaseService.get_bot_session(user_id)
            if session_data:
                return UserSession.from_dict(session_data)
            return None
        except Exception as e:
            logger.error(f"Failed to load session: {str(e)}")
            return None
    
    def handle_message(self, user_id: str, phone_number: str, message_text: str) -> BotMessage:
        """Main message handler - routes to appropriate handler based on state"""
        session = self.get_or_create_session(user_id, phone_number)
        
        logger.info(f"[{self.platform.value}] Message from {user_id}: {message_text[:50]}... (state: {session.state.value})")
        
        if session.state == BotState.IDLE:
            return self._handle_idle_state(session, message_text)
        elif session.state == BotState.COLLECTING_NAME:
            return self._handle_name_collection(session, message_text)
        elif session.state == BotState.COLLECTING_DOB:
            return self._handle_dob_collection(session, message_text)
        elif session.state == BotState.COLLECTING_TIME:
            return self._handle_time_collection(session, message_text)
        elif session.state == BotState.COLLECTING_PLACE:
            return self._handle_place_collection(session, message_text)
        elif session.state == BotState.GENERATING_KUNDLI:
            return self._handle_generating_kundli(session, message_text)
        elif session.state == BotState.CHATTING:
            return self._handle_chat(session, message_text)
        
        return self._create_response(session, "I'm not sure what to do. Please try again.")
    
    def _handle_idle_state(self, session: UserSession, message_text: str) -> BotMessage:
        """Handle initial greeting and menu"""
        response = BotMessage(self.platform, session.user_id)
        
        greeting = f"""🙏 Namaste! Welcome to AstroAI - Your Personal Vedic Astrology Guide

I can help you:
1️⃣ Generate your kundli (birth chart)
2️⃣ Chat about your astrological profile
3️⃣ Get personalized insights

To get started, please share your name."""
        
        response.set_text(greeting)
        session.state = BotState.COLLECTING_NAME
        self.save_session_to_firebase(session)
        
        return response
    
    def _handle_name_collection(self, session: UserSession, message_text: str) -> BotMessage:
        """Collect user's name"""
        name = message_text.strip()
        
        if not name or len(name) < 2:
            response = BotMessage(self.platform, session.user_id)
            response.set_text("Please enter a valid name (at least 2 characters).")
            return response
        
        session.birth_data['name'] = name
        session.state = BotState.COLLECTING_DOB
        self.save_session_to_firebase(session)
        
        response = BotMessage(self.platform, session.user_id)
        response.set_text(f"Nice to meet you, {name}! 👋\n\nNow, please share your date of birth in DD/MM/YYYY format.\nExample: 15/03/1990")
        
        return response
    
    def _handle_dob_collection(self, session: UserSession, message_text: str) -> BotMessage:
        """Collect date of birth"""
        date_data = parse_date_input(message_text)
        
        if not date_data:
            response = BotMessage(self.platform, session.user_id)
            response.set_text("Invalid date format. Please use DD/MM/YYYY format.\nExample: 15/03/1990")
            return response
        
        session.birth_data.update(date_data)
        session.state = BotState.COLLECTING_TIME
        self.save_session_to_firebase(session)
        
        response = BotMessage(self.platform, session.user_id)
        response.set_text(f"Great! Your birth date is {date_data['day']}/{date_data['month']}/{date_data['year']}.\n\nNow, please share your birth time in HH:MM format (24-hour).\nExample: 14:30")
        
        return response
    
    def _handle_time_collection(self, session: UserSession, message_text: str) -> BotMessage:
        """Collect birth time"""
        time_data = parse_time_input(message_text)
        
        if not time_data:
            response = BotMessage(self.platform, session.user_id)
            response.set_text("Invalid time format. Please use HH:MM format (24-hour).\nExample: 14:30")
            return response
        
        session.birth_data.update(time_data)
        session.state = BotState.COLLECTING_PLACE
        self.save_session_to_firebase(session)
        
        response = BotMessage(self.platform, session.user_id)
        response.set_text(f"Perfect! Birth time: {time_data['hour']:02d}:{time_data['minute']:02d}.\n\nNow, please share your birth place/city.\nExample: New Delhi")
        
        return response
    
    def _handle_place_collection(self, session: UserSession, message_text: str) -> BotMessage:
        """Collect birth place"""
        place = message_text.strip()
        
        if not place or len(place) < 2:
            response = BotMessage(self.platform, session.user_id)
            response.set_text("Please enter a valid city/place name.")
            return response
        
        session.birth_data['place'] = place
        session.state = BotState.GENERATING_KUNDLI
        self.save_session_to_firebase(session)
        
        response = BotMessage(self.platform, session.user_id)
        response.set_text(f"Excellent! Birth place: {place}.\n\n⏳ Generating your kundli... This may take a moment.")
        
        return response
    
    def _handle_generating_kundli(self, session: UserSession, message_text: str) -> BotMessage:
        """Generate kundli from collected birth data"""
        try:
            logger.info(f"Generating kundli for {session.birth_data['name']}")
            
            result = astrology_service.generate_kundli(session.birth_data)
            
            if not result.get('success'):
                response = BotMessage(self.platform, session.user_id)
                response.set_text(f"❌ Failed to generate kundli: {result.get('error', 'Unknown error')}")
                session.state = BotState.IDLE
                self.save_session_to_firebase(session)
                return response
            
            session.kundli_data = result['data']
            session.state = BotState.CHATTING
            self.save_session_to_firebase(session)
            
            horoscope_info = result['data'].get('horoscope_info', {})
            sun_sign = horoscope_info.get('sun_sign', 'Unknown')
            moon_sign = horoscope_info.get('moon_sign', 'Unknown')
            
            response = BotMessage(self.platform, session.user_id)
            response.set_text(
                f"✨ Your kundli has been generated!\n\n"
                f"☀️ Sun Sign: {sun_sign}\n"
                f"🌙 Moon Sign: {moon_sign}\n\n"
                f"Now you can ask me anything about your astrological profile, career, relationships, or life path! 🔮"
            )
            
            return response
        
        except Exception as e:
            logger.error(f"Error generating kundli: {str(e)}")
            response = BotMessage(self.platform, session.user_id)
            response.set_text(f"❌ Error generating kundli: {str(e)}")
            session.state = BotState.IDLE
            self.save_session_to_firebase(session)
            return response
    
    def _handle_chat(self, session: UserSession, message_text: str) -> BotMessage:
        """Handle chat messages about kundli"""
        try:
            if not session.kundli_data:
                response = BotMessage(self.platform, session.user_id)
                response.set_text("❌ No kundli data found. Please generate a kundli first.")
                return response
            
            logger.info(f"Processing chat message from {session.user_id}")
            
            horoscope_info = session.kundli_data.get('horoscope_info', {})
            birth_data = session.kundli_data.get('birth_data', {})
            
            horoscope_json = json.dumps(horoscope_info, indent=2)
            
            chat_context = ""
            if session.chat_history:
                chat_context = "\nPrevious conversation:\n"
                for msg in session.chat_history[-5:]:
                    role = msg.get('role', 'user')
                    content = msg.get('content', '')
                    chat_context += f"{role}: {content}\n"
            
            prompt = f"""You are an expert Vedic astrology guide. Analyze the user's birth chart data and answer their question concisely (keep responses under 300 words for messaging platforms).

KUNDLI DATA (JSON):
{horoscope_json}

USER INFO:
Name: {birth_data.get('name', 'Unknown')}
Date: {birth_data.get('year', 'Unknown')}-{birth_data.get('month', 'Unknown')}-{birth_data.get('day', 'Unknown')}
Time: {birth_data.get('hour', 'Unknown')}:{birth_data.get('minute', 'Unknown')}
Place: {birth_data.get('place', 'Unknown')}

{chat_context}

User's question: {message_text}

Provide a personalized astrological response based on the kundli data. Be concise and practical."""
            
            ai_response = self.gemini_service.model.generate_content(prompt).text
            
            session.chat_history.append({'role': 'user', 'content': message_text})
            session.chat_history.append({'role': 'assistant', 'content': ai_response})
            session.last_activity = datetime.utcnow()
            self.save_session_to_firebase(session)
            
            BotFirebaseService.save_bot_message_log(session.user_id, self.platform.value, {'role': 'user', 'content': message_text})
            BotFirebaseService.save_bot_message_log(session.user_id, self.platform.value, {'role': 'assistant', 'content': ai_response})
            
            response = BotMessage(self.platform, session.user_id)
            response.set_text(ai_response)
            
            return response
        
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            response = BotMessage(self.platform, session.user_id)
            response.set_text(f"❌ Error processing your message: {str(e)}")
            return response
    
    def _create_response(self, session: UserSession, text: str) -> BotMessage:
        """Create a response message"""
        response = BotMessage(self.platform, session.user_id)
        response.set_text(text)
        return response
    
    @abstractmethod
    def send_message(self, user_id: str, message: BotMessage) -> bool:
        """Send message to user (platform-specific)"""
        pass
