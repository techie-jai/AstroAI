# Quick Start: Google Maps Places API Integration

Get up and running with Google Maps Places Autocomplete in 5 minutes.

## 🚀 Quick Setup

### Step 1: Get Your API Key (2 minutes)

1. Go to: https://console.cloud.google.com/
2. Create a new project (or use existing)
3. Enable these APIs:
   - **Places API**
   - **Maps JavaScript API**
4. Create API Key:
   - Credentials → Create Credentials → API Key
   - Copy the key

### Step 2: Add API Key to Project (1 minute)

Create file: `frontend/.env.local`

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual key from Step 1.

### Step 3: Install Dependencies (1 minute)

```bash
cd frontend
npm install
```

### Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

### Step 5: Test It (1 minute)

1. Open: http://localhost:3000/generator
2. Click "Place of Birth" field
3. Type: "Mumbai" or "Apollo Hospital"
4. Select from suggestions
5. Coordinates should auto-populate
6. Generate kundli!

## ✅ That's It!

Your app now has high-precision location search powered by Google Maps.

## 🔧 What Changed?

**Old Way (CSV)**:
- Static list of ~40,000 cities
- Limited to exact city names
- Lower precision coordinates

**New Way (Google Maps)**:
- Search for anything: cities, hospitals, landmarks, addresses
- Real-time autocomplete suggestions
- 6+ decimal places precision (~0.1 meters)
- Falls back to CSV if API unavailable

## 📍 Try These Searches

- "Mumbai" → City
- "Apollo Hospital Delhi" → Hospital
- "Gateway of India" → Landmark
- "Taj Mahal, Agra" → Specific location
- "New York, USA" → International

## ⚙️ Configuration

### Domain Restrictions (Recommended)

For security, restrict your API key in Google Cloud Console:

1. Go to: https://console.cloud.google.com/
2. Select your API key
3. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `localhost:3000`
   - Add: `kendraa.ai` (production)

### API Restrictions

1. Under "API restrictions":
   - Select "Restrict key"
   - Choose: Places API, Maps JavaScript API

## 💰 Cost

- **Free tier**: 200 requests/month
- **Typical usage**: ~$0.017 per request after free tier
- **Estimated cost** (1000 kundlis/month): ~$17

## 🐛 Troubleshooting

### "Google Maps not available" message?

1. Check `.env.local` exists in `frontend/` directory
2. Verify API key is correct
3. Ensure APIs are enabled in Google Cloud Console
4. Restart dev server: `npm run dev`

### No suggestions appearing?

1. Open browser DevTools (F12)
2. Check Console for error messages
3. Verify domain is in API key restrictions
4. Try a different search term

### Wrong timezone?

1. Manually edit the `timezone_offset` field
2. Or use online timezone finder for your location

## 📚 Full Documentation

For detailed information, see:
- `GOOGLE_MAPS_SETUP.md` - Complete setup guide
- `GOOGLE_MAPS_IMPLEMENTATION_SUMMARY.md` - Technical details

## 🎯 Key Features

✅ Real-time autocomplete
✅ High-precision coordinates (6+ decimals)
✅ Search cities, hospitals, landmarks
✅ Manual coordinate override
✅ CSV fallback if API unavailable
✅ Mobile-friendly
✅ Error handling

## 📋 Checklist

- [ ] Created `.env.local` with API key
- [ ] Ran `npm install`
- [ ] Started dev server with `npm run dev`
- [ ] Tested location search
- [ ] Generated a kundli
- [ ] Verified coordinates are accurate

## 🚨 Important Notes

⚠️ **Never commit `.env.local`** - It's in `.gitignore` for security

⚠️ **Keep API key private** - Don't share it publicly

⚠️ **Monitor usage** - Check Google Cloud Console for quota

## 🎉 You're Done!

Your astrology app now has professional-grade location search. Users can search for exact locations and get high-precision coordinates automatically.

---

**Need help?** See `GOOGLE_MAPS_SETUP.md` for detailed troubleshooting.
