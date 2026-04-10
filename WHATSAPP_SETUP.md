# WhatsApp Integration Setup Guide

## Overview
This guide explains how to set up WhatsApp Bot integration for AstroAI using Meta's WhatsApp Business API.

## Prerequisites
1. Meta Business Account (https://business.facebook.com)
2. WhatsApp Business Account
3. A phone number to use for the bot
4. HTTPS endpoint for webhook (required by Meta)

## Step-by-Step Setup

### 1. Create a Meta Business Account
- Go to https://business.facebook.com
- Sign up or log in with your Facebook account
- Complete the business verification process

### 2. Create WhatsApp Business App
- In Business Manager, go to Apps & Assets > Apps
- Click "Create App"
- Choose "Business" as the app type
- Fill in app details:
  - App Name: "AstroAI WhatsApp Bot"
  - App Purpose: "WhatsApp Integration"
- Click "Create App"

### 3. Add WhatsApp Product
- In your app dashboard, find "WhatsApp" product
- Click "Set Up" or "Add Product"
- Accept the terms and conditions
- You'll be assigned a Phone Number ID and Business Account ID

### 4. Get Your Credentials
From the WhatsApp product settings, collect:
- **Phone Number ID**: Found in "Phone numbers" section
- **Business Account ID**: Found in "Account info"
- **Access Token**: Generate in "API Access Tokens" section
  - Click "Generate Token"
  - Select your app
  - Choose "whatsapp_business_messaging" permission
  - Copy the token

### 5. Set Up Webhook
Your webhook URL will be: `https://your-domain.com/api/webhooks/whatsapp`

#### In Meta Dashboard:
1. Go to WhatsApp > Configuration
2. Under "Webhooks", click "Edit"
3. Enter your webhook URL
4. Generate and set a **Webhook Verify Token** (any random string)
5. Select webhook fields to subscribe to:
   - `messages`
   - `message_status`
   - `message_template_status_update`

#### In Your Application:
1. Set environment variables:
```bash
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_BUSINESS_ACCOUNT_ID=your-business-account-id
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-webhook-verify-token
WHATSAPP_APP_SECRET=your-app-secret
```

2. Your backend will automatically verify the webhook when Meta sends a GET request to your endpoint

### 6. Test the Integration
```bash
# Test webhook verification
curl -X GET "https://your-domain.com/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=your-webhook-verify-token"

# Should return: 123 (the challenge value)
```

### 7. Send Test Message
```bash
curl -X POST "https://your-domain.com/api/bot/send-kundli-whatsapp" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+919876543210",
    "kundli_data": {...},
    "birth_data": {...}
  }'
```

## Features

### Bot Conversation Flow
1. User messages the bot
2. Bot greets and asks for name
3. Bot collects date of birth
4. Bot collects birth time
5. Bot collects birth place
6. Bot generates kundli
7. User can ask questions about their kundli

### Message Types Supported
- Text messages
- Template messages (for formatted responses)
- Media messages (future enhancement)

## Limitations & Notes

### Rate Limiting
- WhatsApp API has rate limits (typically 1000 messages/day for new accounts)
- Increase limits by requesting higher tier access in Meta Business Manager

### Message Templates
- For production, you should create message templates in Meta Business Manager
- Templates allow better formatting and higher throughput
- Current implementation uses simple text messages

### Phone Number Format
- Always include country code (e.g., +91 for India)
- Remove any spaces or special characters except +

## Troubleshooting

### Webhook Not Verifying
- Check that WHATSAPP_WEBHOOK_VERIFY_TOKEN matches in Meta Dashboard
- Ensure your endpoint is HTTPS
- Check server logs for errors

### Messages Not Sending
- Verify Access Token is valid and not expired
- Check Phone Number ID is correct
- Ensure recipient phone number is in correct format
- Check WhatsApp Business Account is in good standing

### Session Not Persisting
- Sessions are stored in Firebase Firestore
- Check Firebase credentials are configured
- Verify Firestore database has proper permissions

## Production Checklist
- [ ] HTTPS endpoint configured
- [ ] All environment variables set
- [ ] Webhook verified in Meta Dashboard
- [ ] Test message sent successfully
- [ ] Error logging configured
- [ ] Rate limiting considered
- [ ] Phone number format validation in place
- [ ] User consent obtained for messaging
