# Telegram Integration Setup Guide

## Overview
This guide explains how to set up Telegram Bot integration for AstroAI using Telegram Bot API.

## Prerequisites
1. Telegram account (https://telegram.org)
2. BotFather bot access (built-in to Telegram)
3. HTTPS endpoint for webhook (optional - polling also supported)

## Step-by-Step Setup

### 1. Create a Telegram Bot via BotFather

1. Open Telegram and search for **@BotFather**
2. Start the conversation with `/start`
3. Send `/newbot` command
4. Follow the prompts:
   - Enter bot name: "AstroAI Bot" (or your preferred name)
   - Enter bot username: "astroai_bot" (must be unique and end with "bot")
5. BotFather will provide your **Bot Token**

Example token format: `123456789:ABCdefGHIjklmnoPQRstuvWXYZ`

### 2. Configure Bot Settings

In BotFather, you can customize:
- `/setdescription` - Set bot description
- `/setshortdescription` - Set short description
- `/setcommands` - Set available commands
- `/setdefaultadminrights` - Configure admin permissions

### 3. Set Up Webhook (Recommended for Production)

Your webhook URL will be: `https://your-domain.com/api/webhooks/telegram`

#### Option A: Webhook (Recommended)
```bash
# Set webhook
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/webhooks/telegram"
  }'

# Verify webhook is set
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

#### Option B: Polling (Simpler, Less Efficient)
- No webhook configuration needed
- Bot polls Telegram servers for updates
- Slower response times
- Better for development/testing

### 4. Set Environment Variables

```bash
TELEGRAM_BOT_TOKEN=your-bot-token-here
```

Example:
```bash
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklmnoPQRstuvWXYZ
```

### 5. Test the Integration

```bash
# Get bot info
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"

# Should return:
# {
#   "ok": true,
#   "result": {
#     "id": 123456789,
#     "is_bot": true,
#     "first_name": "AstroAI Bot",
#     "username": "astroai_bot",
#     ...
#   }
# }
```

### 6. Start Chatting with Your Bot

1. Search for your bot username in Telegram (e.g., @astroai_bot)
2. Click "Start" or send `/start`
3. Follow the bot's prompts to generate your kundli
4. Ask questions about your astrological profile

## Features

### Bot Conversation Flow
1. User starts the bot with `/start`
2. Bot greets and asks for name
3. Bot collects date of birth (DD/MM/YYYY format)
4. Bot collects birth time (HH:MM format)
5. Bot collects birth place (city name)
6. Bot generates kundli
7. User can ask questions about their kundli in natural language

### Message Types Supported
- Text messages
- Inline keyboards (buttons for quick responses)
- Formatted text (HTML/Markdown)
- Photos (for charts - future enhancement)
- Documents (for detailed reports - future enhancement)

### Inline Keyboard Example
```python
# Buttons appear below messages for quick selection
# Example: "Is this correct? [Yes] [No]"
```

## Advantages of Telegram

1. **Easy Setup**: No business account or verification needed
2. **Rich Formatting**: Supports HTML, Markdown, inline buttons
3. **Free**: No message costs
4. **User-Friendly**: Most users already have Telegram
5. **Media Support**: Easy to send charts, PDFs, images
6. **Inline Keyboards**: Better UX with button-based navigation

## Webhook vs Polling

### Webhook (Recommended for Production)
- **Pros**: Real-time, efficient, scalable
- **Cons**: Requires HTTPS, more complex setup
- **Use when**: Running production service with HTTPS

### Polling (Good for Development)
- **Pros**: Simple, no HTTPS needed
- **Cons**: Slower, less efficient, higher latency
- **Use when**: Testing locally or in development

## Telegram Bot Commands

You can set up commands that appear in the bot menu:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Start the bot and generate kundli"},
      {"command": "help", "description": "Get help about the bot"},
      {"command": "reset", "description": "Reset your session"}
    ]
  }'
```

## Limitations & Notes

### Rate Limiting
- Telegram has generous rate limits (no strict limit for bots)
- Avoid sending more than 30 messages per second

### Message Formatting
- Use HTML or Markdown for rich formatting
- Keep messages concise for better mobile experience
- Emoji support is excellent

### Session Management
- Sessions stored in Firebase Firestore
- 24-hour timeout for inactive sessions
- User can reset session with `/reset` command

## Troubleshooting

### Bot Not Responding
- Check TELEGRAM_BOT_TOKEN is correct
- Verify webhook is set (if using webhook mode)
- Check server logs for errors
- Try `/start` command again

### Webhook Not Receiving Updates
- Verify webhook URL is HTTPS
- Check firewall/network allows incoming requests from Telegram
- Verify webhook is set with `getWebhookInfo`
- Check server logs for incoming requests

### Session Not Persisting
- Sessions stored in Firebase Firestore
- Check Firebase credentials are configured
- Verify Firestore database has proper permissions

### Message Formatting Issues
- Use `parse_mode: 'HTML'` for HTML formatting
- Escape special characters: `<`, `>`, `&`
- Test formatting in Telegram before production

## Production Checklist
- [ ] Bot token configured in environment
- [ ] Webhook URL set to HTTPS endpoint
- [ ] Webhook verified with `getWebhookInfo`
- [ ] Test message sent successfully
- [ ] Error logging configured
- [ ] Firebase session storage working
- [ ] Commands set up in BotFather
- [ ] Bot description and short description set
- [ ] Rate limiting considered
- [ ] User consent obtained for messaging

## Example Commands in BotFather

```
/setdescription
AstroAI - Your Personal Vedic Astrology Guide
Generate your kundli and get personalized astrological insights!

/setshortdescription
Vedic Astrology Guide

/setcommands
start - Start the bot and generate kundli
help - Get help about the bot
reset - Reset your session
```

## Useful Resources
- Telegram Bot API: https://core.telegram.org/bots/api
- BotFather: @BotFather on Telegram
- Telegram Bot Examples: https://core.telegram.org/bots/samples
