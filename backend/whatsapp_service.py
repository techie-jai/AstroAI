import requests
import json
import hmac
import hashlib
from typing import Dict, Any, Optional
from bot_service import BotService
from bot_utils import BotPlatform, BotMessage
import logging
import os

logger = logging.getLogger(__name__)

class WhatsAppService(BotService):
    """WhatsApp Bot Service using Meta's WhatsApp Business API"""
    
    def __init__(self):
        super().__init__(BotPlatform.WHATSAPP)
        self.phone_number_id = os.getenv('WHATSAPP_PHONE_NUMBER_ID', '')
        self.business_account_id = os.getenv('WHATSAPP_BUSINESS_ACCOUNT_ID', '')
        self.access_token = os.getenv('WHATSAPP_ACCESS_TOKEN', '')
        self.webhook_verify_token = os.getenv('WHATSAPP_WEBHOOK_VERIFY_TOKEN', '')
        self.api_url = f"https://graph.instagram.com/v18.0/{self.phone_number_id}/messages"
        
        if not all([self.phone_number_id, self.access_token]):
            logger.warning("WhatsApp credentials not fully configured")
    
    def verify_webhook(self, token: str) -> bool:
        """Verify webhook token from Meta"""
        return token == self.webhook_verify_token
    
    def verify_webhook_signature(self, body: str, signature: str) -> bool:
        """Verify webhook signature from Meta"""
        app_secret = os.getenv('WHATSAPP_APP_SECRET', '')
        if not app_secret:
            logger.warning("WHATSAPP_APP_SECRET not configured")
            return False
        
        expected_signature = hmac.new(
            app_secret.encode(),
            body.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
    
    def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle incoming webhook from WhatsApp"""
        try:
            logger.info(f"WhatsApp webhook received: {json.dumps(webhook_data)[:200]}...")
            
            entry = webhook_data.get('entry', [{}])[0]
            changes = entry.get('changes', [{}])[0]
            value = changes.get('value', {})
            messages = value.get('messages', [])
            
            if not messages:
                logger.info("No messages in webhook")
                return {'status': 'ok'}
            
            message = messages[0]
            from_number = message.get('from', '')
            message_id = message.get('id', '')
            timestamp = message.get('timestamp', '')
            
            message_text = ''
            if 'text' in message:
                message_text = message['text'].get('body', '')
            elif 'button' in message:
                message_text = message['button'].get('payload', '')
            
            if not message_text:
                logger.warning(f"No text content in message {message_id}")
                return {'status': 'ok'}
            
            logger.info(f"Message from {from_number}: {message_text[:50]}...")
            
            response_message = self.handle_message(from_number, from_number, message_text)
            
            self.send_message(from_number, response_message)
            
            self.mark_message_read(message_id)
            
            return {'status': 'ok'}
        
        except Exception as e:
            logger.error(f"Error handling WhatsApp webhook: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def send_message(self, phone_number: str, message: BotMessage) -> bool:
        """Send message via WhatsApp API"""
        try:
            phone_number = phone_number.replace('+', '')
            
            payload = {
                'messaging_product': 'whatsapp',
                'recipient_type': 'individual',
                'to': phone_number,
                'type': 'text',
                'text': {
                    'preview_url': False,
                    'body': message.text
                }
            }
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(self.api_url, json=payload, headers=headers)
            
            if response.status_code == 200:
                logger.info(f"Message sent to {phone_number}")
                return True
            else:
                logger.error(f"Failed to send message: {response.status_code} - {response.text}")
                return False
        
        except Exception as e:
            logger.error(f"Error sending WhatsApp message: {str(e)}")
            return False
    
    def send_template_message(self, phone_number: str, template_name: str, parameters: Dict[str, Any]) -> bool:
        """Send template message via WhatsApp API"""
        try:
            phone_number = phone_number.replace('+', '')
            
            payload = {
                'messaging_product': 'whatsapp',
                'to': phone_number,
                'type': 'template',
                'template': {
                    'name': template_name,
                    'language': {
                        'code': 'en_US'
                    },
                    'components': [
                        {
                            'type': 'body',
                            'parameters': [
                                {'type': 'text', 'text': str(v)} for v in parameters.values()
                            ]
                        }
                    ]
                }
            }
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(self.api_url, json=payload, headers=headers)
            
            if response.status_code == 200:
                logger.info(f"Template message sent to {phone_number}")
                return True
            else:
                logger.error(f"Failed to send template message: {response.status_code} - {response.text}")
                return False
        
        except Exception as e:
            logger.error(f"Error sending WhatsApp template message: {str(e)}")
            return False
    
    def mark_message_read(self, message_id: str) -> bool:
        """Mark message as read"""
        try:
            payload = {
                'messaging_product': 'whatsapp',
                'status': 'read',
                'message_id': message_id
            }
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(self.api_url, json=payload, headers=headers)
            
            if response.status_code == 200:
                logger.info(f"Message {message_id} marked as read")
                return True
            else:
                logger.error(f"Failed to mark message as read: {response.status_code}")
                return False
        
        except Exception as e:
            logger.error(f"Error marking message as read: {str(e)}")
            return False
    
    def send_kundli_result(self, phone_number: str, kundli_data: Dict[str, Any], birth_data: Dict[str, Any]) -> bool:
        """Send kundli generation result to user"""
        try:
            horoscope_info = kundli_data.get('horoscope_info', {})
            sun_sign = horoscope_info.get('sun_sign', 'Unknown')
            moon_sign = horoscope_info.get('moon_sign', 'Unknown')
            ascendant = horoscope_info.get('ascendant_sign', 'Unknown')
            
            message_text = (
                f"✨ Your Kundli has been generated!\n\n"
                f"👤 Name: {birth_data.get('name', 'N/A')}\n"
                f"📅 Birth Date: {birth_data.get('day')}/{birth_data.get('month')}/{birth_data.get('year')}\n"
                f"⏰ Birth Time: {birth_data.get('hour'):02d}:{birth_data.get('minute'):02d}\n"
                f"📍 Birth Place: {birth_data.get('place', 'N/A')}\n\n"
                f"☀️ Sun Sign: {sun_sign}\n"
                f"🌙 Moon Sign: {moon_sign}\n"
                f"⬆️ Ascendant: {ascendant}\n\n"
                f"💬 Reply with your questions about your astrological profile!"
            )
            
            message = BotMessage(BotPlatform.WHATSAPP, phone_number)
            message.set_text(message_text)
            
            return self.send_message(phone_number, message)
        
        except Exception as e:
            logger.error(f"Error sending kundli result: {str(e)}")
            return False
