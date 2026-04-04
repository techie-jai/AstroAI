---
description: How to use the LiveChat feature
---

# LiveChat Feature Guide

## Overview
The LiveChat feature allows users to instantly generate a kundli and chat with an AI astrology advisor without needing to save the kundli to their account.

## How to Access
1. Go to the Dashboard
2. Click the "Live Chat" button in the Quick Actions section
3. Or navigate directly to `/livechat`

## Step-by-Step Usage

### 1. Enter Your Birth Details
- **Full Name**: Enter your complete name
- **Date of Birth**: Select day, month, and year
- **Time of Birth**: Enter hour and minute (24-hour format)
- **Place of Birth**: Select from the dropdown list (includes major cities worldwide)
- **Timezone**: Automatically set based on selected place

### 2. Generate Kundli
- Click "Generate Kundli & Start Chat"
- The system will instantly generate your birth chart (kundli) with 1000+ astrological data points
- You'll see a welcome message from your AI astrology advisor

### 3. Chat with Your Kundli
Once the kundli is generated:
- Ask any questions about your astrological profile
- The AI will reference your actual kundli data in responses
- Responses are kept under 200 words for clarity
- View your birth details in the left panel
- Use quick question buttons for common queries

## Quick Questions
Pre-built questions available:
- "What are my key planetary positions?"
- "What does my chart say about my career?"
- "What are my strengths according to astrology?"
- "What challenges should I be aware of?"

## Key Features
- **Instant Kundli Generation**: No account storage required
- **AI-Powered Responses**: Uses Gemini API with kundli context
- **Accurate Calculations**: Based on PyJHora Vedic astrology engine
- **Responsive Design**: Works on desktop and mobile devices
- **Conversation History**: Maintains chat history during the session

## Technical Details
- Frontend: React with TypeScript
- Backend: FastAPI with Gemini integration
- Kundli Generation: PyJHora library
- No Firebase storage for livechat data (session-based only)

## Troubleshooting
- **Kundli generation fails**: Check your internet connection and ensure all birth details are valid
- **Chat not responding**: Verify Gemini API key is configured in backend
- **Timezone issues**: Select the correct place from the dropdown to auto-set timezone

## Notes
- LiveChat sessions are not saved to your account
- For permanent kundli storage and analysis, use the "Generate Kundli" feature
- All chat responses are generated in real-time using your kundli data
