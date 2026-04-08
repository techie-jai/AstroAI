import json
from typing import Dict, Any, Optional
from datetime import datetime
from enum import Enum

class BotPlatform(Enum):
    WHATSAPP = "whatsapp"
    TELEGRAM = "telegram"

class BotState(Enum):
    IDLE = "idle"
    COLLECTING_NAME = "collecting_name"
    COLLECTING_DOB = "collecting_dob"
    COLLECTING_TIME = "collecting_time"
    COLLECTING_PLACE = "collecting_place"
    GENERATING_KUNDLI = "generating_kundli"
    CHATTING = "chatting"

class UserSession:
    def __init__(self, user_id: str, phone_number: str, platform: BotPlatform):
        self.user_id = user_id
        self.phone_number = phone_number
        self.platform = platform
        self.state = BotState.IDLE
        self.birth_data = {
            'name': None,
            'day': None,
            'month': None,
            'year': None,
            'hour': None,
            'minute': None,
            'place': None,
            'latitude': None,
            'longitude': None,
            'timezone_offset': None,
        }
        self.kundli_data = None
        self.chat_history = []
        self.created_at = datetime.utcnow()
        self.last_activity = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            'user_id': self.user_id,
            'phone_number': self.phone_number,
            'platform': self.platform.value,
            'state': self.state.value,
            'birth_data': self.birth_data,
            'kundli_data': self.kundli_data,
            'chat_history': self.chat_history,
            'created_at': self.created_at.isoformat(),
            'last_activity': self.last_activity.isoformat(),
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'UserSession':
        session = UserSession(
            data['user_id'],
            data['phone_number'],
            BotPlatform(data['platform'])
        )
        session.state = BotState(data['state'])
        session.birth_data = data['birth_data']
        session.kundli_data = data['kundli_data']
        session.chat_history = data['chat_history']
        session.created_at = datetime.fromisoformat(data['created_at'])
        session.last_activity = datetime.fromisoformat(data['last_activity'])
        return session


class BotMessage:
    def __init__(self, platform: BotPlatform, user_id: str, message_type: str = 'text'):
        self.platform = platform
        self.user_id = user_id
        self.message_type = message_type
        self.text = None
        self.buttons = []
        self.media_url = None

    def set_text(self, text: str) -> 'BotMessage':
        self.text = text
        return self

    def add_button(self, label: str, value: str) -> 'BotMessage':
        self.buttons.append({'label': label, 'value': value})
        return self

    def set_media(self, media_url: str) -> 'BotMessage':
        self.media_url = media_url
        return self

    def to_dict(self) -> Dict[str, Any]:
        return {
            'platform': self.platform.value,
            'user_id': self.user_id,
            'message_type': self.message_type,
            'text': self.text,
            'buttons': self.buttons,
            'media_url': self.media_url,
        }


def validate_phone_number(phone: str, platform: BotPlatform) -> bool:
    """Validate phone number format for the platform"""
    phone = phone.replace('+', '').replace(' ', '').replace('-', '')
    
    if platform == BotPlatform.WHATSAPP:
        return len(phone) >= 10 and len(phone) <= 15 and phone.isdigit()
    elif platform == BotPlatform.TELEGRAM:
        return phone.isdigit() and len(phone) >= 5
    
    return False


def parse_date_input(date_str: str) -> Optional[Dict[str, int]]:
    """Parse various date formats (DD/MM/YYYY, DD-MM-YYYY, etc.)"""
    import re
    
    date_str = date_str.strip()
    
    patterns = [
        (r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})', lambda m: {
            'day': int(m.group(1)),
            'month': int(m.group(2)),
            'year': int(m.group(3))
        }),
        (r'(\d{4})[/-](\d{1,2})[/-](\d{1,2})', lambda m: {
            'year': int(m.group(1)),
            'month': int(m.group(2)),
            'day': int(m.group(3))
        }),
    ]
    
    for pattern, parser in patterns:
        match = re.match(pattern, date_str)
        if match:
            try:
                result = parser(match)
                if 1 <= result['day'] <= 31 and 1 <= result['month'] <= 12 and 1900 <= result['year'] <= 2100:
                    return result
            except (ValueError, KeyError):
                continue
    
    return None


def parse_time_input(time_str: str) -> Optional[Dict[str, int]]:
    """Parse time input (HH:MM, HH-MM, etc.)"""
    import re
    
    time_str = time_str.strip()
    match = re.match(r'(\d{1,2})[:-](\d{1,2})', time_str)
    
    if match:
        try:
            hour = int(match.group(1))
            minute = int(match.group(2))
            if 0 <= hour <= 23 and 0 <= minute <= 59:
                return {'hour': hour, 'minute': minute}
        except ValueError:
            pass
    
    return None
