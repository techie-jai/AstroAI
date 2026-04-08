import requests
import json
from typing import Dict, Any, Optional
from bot_service import BotService
from bot_utils import BotPlatform, BotMessage
import logging
import os

logger = logging.getLogger(__name__)

class TelegramService(BotService):
    """Telegram Bot Service using Telegram Bot API"""
    
    def __init__(self):
        super().__init__(BotPlatform.TELEGRAM)
        self.bot_token = os.getenv('TELEGRAM_BOT_TOKEN', '')
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}"
        
        if not self.bot_token:
            logger.warning("Telegram bot token not configured")
    
    def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle incoming webhook from Telegram"""
        try:
            logger.info(f"Telegram webhook received: {json.dumps(webhook_data)[:200]}...")
            
            message = webhook_data.get('message', {})
            if not message:
                logger.info("No message in webhook")
                return {'status': 'ok'}
            
            chat_id = message.get('chat', {}).get('id', '')
            message_id = message.get('message_id', '')
            text = message.get('text', '')
            user_id = str(message.get('from', {}).get('id', ''))
            
            if not text or not chat_id:
                logger.warning("Missing text or chat_id in message")
                return {'status': 'ok'}
            
            logger.info(f"Message from {user_id}: {text[:50]}...")
            
            response_message = self.handle_message(user_id, str(chat_id), text)
            
            self.send_message(chat_id, response_message)
            
            return {'status': 'ok'}
        
        except Exception as e:
            logger.error(f"Error handling Telegram webhook: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def send_message(self, chat_id: str, message: BotMessage) -> bool:
        """Send message via Telegram API"""
        try:
            payload = {
                'chat_id': chat_id,
                'text': message.text,
                'parse_mode': 'HTML'
            }
            
            if message.buttons:
                reply_markup = self._build_inline_keyboard(message.buttons)
                payload['reply_markup'] = reply_markup
            
            url = f"{self.api_url}/sendMessage"
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                logger.info(f"Message sent to {chat_id}")
                return True
            else:
                logger.error(f"Failed to send message: {response.status_code} - {response.text}")
                return False
        
        except Exception as e:
            logger.error(f"Error sending Telegram message: {str(e)}")
            return False
    
    def send_photo(self, chat_id: str, photo_url: str, caption: str = '') -> bool:
        """Send photo via Telegram API"""
        try:
            payload = {
                'chat_id': chat_id,
                'photo': photo_url,
            }
            
            if caption:
                payload['caption'] = caption
                payload['parse_mode'] = 'HTML'
            
            url = f"{self.api_url}/sendPhoto"
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                logger.info(f"Photo sent to {chat_id}")
                return True
            else:
                logger.error(f"Failed to send photo: {response.status_code} - {response.text}")
                return False
        
        except Exception as e:
            logger.error(f"Error sending Telegram photo: {str(e)}")
            return False
    
    def send_document(self, chat_id: str, document_url: str, caption: str = '') -> bool:
        """Send document via Telegram API"""
        try:
            payload = {
                'chat_id': chat_id,
                'document': document_url,
            }
            
            if caption:
                payload['caption'] = caption
                payload['parse_mode'] = 'HTML'
            
            url = f"{self.api_url}/sendDocument"
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                logger.info(f"Document sent to {chat_id}")
                return True
            else:
                logger.error(f"Failed to send document: {response.status_code} - {response.text}")
                return False
        
        except Exception as e:
            logger.error(f"Error sending Telegram document: {str(e)}")
            return False
    
    def _build_inline_keyboard(self, buttons: list) -> Dict[str, Any]:
        """Build inline keyboard markup from buttons"""
        keyboard = []
        for button in buttons:
            keyboard.append([{
                'text': button['label'],
                'callback_data': button['value']
            }])
        
        return {'inline_keyboard': keyboard}
    
    def send_kundli_result(self, chat_id: str, kundli_data: Dict[str, Any], birth_data: Dict[str, Any]) -> bool:
        """Send kundli generation result to user"""
        try:
            horoscope_info = kundli_data.get('horoscope_info', {})
            sun_sign = horoscope_info.get('sun_sign', 'Unknown')
            moon_sign = horoscope_info.get('moon_sign', 'Unknown')
            ascendant = horoscope_info.get('ascendant_sign', 'Unknown')
            
            message_text = (
                f"✨ <b>Your Kundli has been generated!</b>\n\n"
                f"👤 <b>Name:</b> {birth_data.get('name', 'N/A')}\n"
                f"📅 <b>Birth Date:</b> {birth_data.get('day')}/{birth_data.get('month')}/{birth_data.get('year')}\n"
                f"⏰ <b>Birth Time:</b> {birth_data.get('hour'):02d}:{birth_data.get('minute'):02d}\n"
                f"📍 <b>Birth Place:</b> {birth_data.get('place', 'N/A')}\n\n"
                f"☀️ <b>Sun Sign:</b> {sun_sign}\n"
                f"🌙 <b>Moon Sign:</b> {moon_sign}\n"
                f"⬆️ <b>Ascendant:</b> {ascendant}\n\n"
                f"💬 Reply with your questions about your astrological profile!"
            )
            
            message = BotMessage(BotPlatform.TELEGRAM, chat_id)
            message.set_text(message_text)
            
            return self.send_message(chat_id, message)
        
        except Exception as e:
            logger.error(f"Error sending kundli result: {str(e)}")
            return False
    
    def set_webhook(self, webhook_url: str) -> bool:
        """Set webhook URL for Telegram bot"""
        try:
            url = f"{self.api_url}/setWebhook"
            payload = {'url': webhook_url}
            
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                logger.info(f"Webhook set to {webhook_url}")
                return True
            else:
                logger.error(f"Failed to set webhook: {response.status_code} - {response.text}")
                return False
        
        except Exception as e:
            logger.error(f"Error setting webhook: {str(e)}")
            return False
    
    def get_me(self) -> Optional[Dict[str, Any]]:
        """Get bot information"""
        try:
            url = f"{self.api_url}/getMe"
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('ok'):
                    return data.get('result')
            
            logger.error(f"Failed to get bot info: {response.status_code}")
            return None
        
        except Exception as e:
            logger.error(f"Error getting bot info: {str(e)}")
            return None
