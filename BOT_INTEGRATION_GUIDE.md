# Bot Integration Guide - WhatsApp & Telegram

## Quick Start

### For Users
Users can now chat about their kundli using WhatsApp or Telegram instead of the web app:

1. **WhatsApp**: Message the AstroAI WhatsApp Bot
2. **Telegram**: Search for @astroai_bot and start chatting

### For Developers

#### Environment Setup
```bash
# Copy .env.example to .env
cp .env.example .env

# Add your bot credentials
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-verify-token
TELEGRAM_BOT_TOKEN=your-bot-token
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Run Backend
```bash
python -m uvicorn main:app --reload
```

## Architecture

### Components

1. **bot_utils.py** - Shared utilities
   - `BotPlatform` enum (WHATSAPP, TELEGRAM)
   - `BotState` enum (conversation states)
   - `UserSession` class (session management)
   - Helper functions for parsing input

2. **bot_service.py** - Base bot service
   - Abstract `BotService` class
   - Message handling logic
   - State machine for conversation flow
   - Firebase session persistence

3. **whatsapp_service.py** - WhatsApp implementation
   - Extends `BotService`
   - Handles Meta WhatsApp API
   - Webhook verification
   - Message sending

4. **telegram_service.py** - Telegram implementation
   - Extends `BotService`
   - Handles Telegram Bot API
   - Webhook handling
   - Rich message formatting

### Conversation Flow

```
User Message
    ↓
Bot Service (handle_message)
    ↓
State Machine
    ├─ IDLE → Ask for name
    ├─ COLLECTING_NAME → Ask for DOB
    ├─ COLLECTING_DOB → Ask for time
    ├─ COLLECTING_TIME → Ask for place
    ├─ COLLECTING_PLACE → Generate kundli
    ├─ GENERATING_KUNDLI → Start chatting
    └─ CHATTING → Answer questions using Gemini + kundli data
    ↓
Response Message
    ↓
Platform-Specific Send
```

## API Endpoints

### WhatsApp Webhooks

#### Verification (GET)
```
GET /api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=CHALLENGE&hub.verify_token=TOKEN
```

#### Incoming Messages (POST)
```
POST /api/webhooks/whatsapp
Content-Type: application/json

{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "919876543210",
          "id": "msg_id",
          "timestamp": "1234567890",
          "text": {"body": "user message"}
        }]
      }
    }]
  }]
}
```

### Telegram Webhooks

#### Incoming Messages (POST)
```
POST /api/webhooks/telegram
Content-Type: application/json

{
  "message": {
    "message_id": 123,
    "from": {"id": 456, "is_bot": false},
    "chat": {"id": 789},
    "text": "user message"
  }
}
```

### Send Kundli Result

#### WhatsApp
```
POST /api/bot/send-kundli-whatsapp
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "phone_number": "+919876543210",
  "kundli_data": {...},
  "birth_data": {...}
}
```

#### Telegram
```
POST /api/bot/send-kundli-telegram
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "chat_id": "123456789",
  "kundli_data": {...},
  "birth_data": {...}
}
```

## Session Management

### Storage
- Sessions stored in Firebase Firestore collection: `bot_sessions`
- Document ID: User phone number or Telegram user ID
- Auto-saved after each message

### Session Data
```python
{
  "user_id": "919876543210",
  "phone_number": "919876543210",
  "platform": "whatsapp",
  "state": "chatting",
  "birth_data": {
    "name": "John Doe",
    "day": 15,
    "month": 3,
    "year": 1990,
    "hour": 14,
    "minute": 30,
    "place": "New Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezone_offset": 5.5
  },
  "kundli_data": {...},
  "chat_history": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ],
  "created_at": "2024-01-15T10:30:00",
  "last_activity": "2024-01-15T10:35:00"
}
```

### Session Timeout
- Default: 24 hours of inactivity
- Can be configured in `bot_service.py`

## Input Parsing

### Date Format
Accepts: DD/MM/YYYY, DD-MM-YYYY
Examples: "15/03/1990", "15-03-1990"

### Time Format
Accepts: HH:MM (24-hour format)
Examples: "14:30", "09:15"

### Place
Any city name (e.g., "New Delhi", "Mumbai", "London")

## Error Handling

### User Errors
- Invalid date format → Ask for correct format
- Invalid time format → Ask for correct format
- Empty name → Ask for valid name

### System Errors
- Kundli generation fails → Inform user and reset state
- Gemini API error → Inform user and suggest retry
- Firebase error → Log error and inform user

## Logging

All bot interactions are logged with prefixes:
- `[WHATSAPP]` - WhatsApp service logs
- `[TELEGRAM]` - Telegram service logs
- `[BOT]` - General bot logs

Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Testing

### Manual Testing

#### WhatsApp
1. Set up WhatsApp Business Account (see WHATSAPP_SETUP.md)
2. Send test message to your bot number
3. Check server logs for processing

#### Telegram
1. Search for your bot on Telegram
2. Send `/start` command
3. Follow the bot prompts
4. Check server logs for processing

### Automated Testing
```bash
# Test WhatsApp webhook verification
curl -X GET "http://localhost:8000/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=your-token"

# Test Telegram webhook
curl -X POST "http://localhost:8000/api/webhooks/telegram" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "message_id": 1,
      "from": {"id": 123},
      "chat": {"id": 456},
      "text": "Hello"
    }
  }'
```

## Limitations & Future Enhancements

### Current Limitations
- Text messages only (no media)
- Simple conversation flow (no branching)
- No user authentication (phone number based)
- No payment integration

### Future Enhancements
- [ ] Send kundli charts as images
- [ ] Send detailed PDF reports
- [ ] Support for media uploads
- [ ] User authentication with Firebase
- [ ] Payment integration for premium features
- [ ] Multi-language support
- [ ] Advanced conversation branching
- [ ] Integration with CRM systems

## Troubleshooting

### Common Issues

#### Webhook Not Verifying
- Check verify token matches in platform dashboard
- Ensure HTTPS endpoint
- Check firewall allows incoming requests

#### Messages Not Sending
- Verify API credentials
- Check rate limits
- Verify recipient phone/chat ID format
- Check Firebase permissions

#### Session Not Persisting
- Check Firebase Firestore is accessible
- Verify database rules allow read/write
- Check user_id is consistent

#### Kundli Generation Fails
- Check Jyotishganit API is accessible
- Verify birth data is valid
- Check server logs for detailed error

## Support

For issues or questions:
1. Check server logs for error messages
2. Review relevant setup guide (WHATSAPP_SETUP.md or TELEGRAM_SETUP.md)
3. Verify all environment variables are set
4. Check Firebase Firestore is properly configured
