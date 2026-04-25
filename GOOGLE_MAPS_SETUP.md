# Google Maps Places API Integration - Setup Guide

This document explains how to set up and use the new Google Maps Places Autocomplete feature for location selection in the Kundli Generator.

## Overview

The application now uses **Google Maps Places Autocomplete** for high-precision location selection instead of the static CSV file. Users can search for:
- Cities
- Hospitals
- Landmarks
- Specific addresses
- Any geographic location

The CSV fallback is retained for reliability if the Google API becomes unavailable.

## Architecture

### Components Created

#### 1. `frontend/src/utils/googleMapsLoader.ts`
- Loads Google Maps JavaScript SDK dynamically
- Manages API initialization and error handling
- Provides utility functions for place detail extraction
- Handles TypeScript types for Google Maps API

#### 2. `frontend/src/components/GooglePlacesAutocomplete.tsx`
- React component wrapping Google Places Autocomplete
- Handles user input and suggestion display
- Extracts precise coordinates from selected places
- Falls back gracefully if Google API unavailable
- Includes loading states and error messages

#### 3. `frontend/src/data/cities.ts` (Updated)
- Added `normalizeGooglePlaceToCity()` function
- Converts Google Places data to application format
- Maintains CSV fallback search function

### Modified Files

- `frontend/src/pages/GeneratorPage.tsx` - Replaced CSV search with Google Places component
- `frontend/vite.config.ts` - Added environment variable configuration
- `frontend/package.json` - Added `@react-google-maps/api` dependency
- `frontend/.env.example` - Added API key placeholder

## Setup Instructions

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Places API** (for autocomplete)
   - **Maps JavaScript API** (for map functionality)
4. Create an API key:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the generated API key

### Step 2: Configure API Key Restrictions (Recommended)

For security, restrict your API key to:

**Application restrictions:**
- Select "HTTP referrers (web sites)"
- Add your domain(s):
  - `localhost:3000` (development)
  - `localhost:8000` (if testing from backend)
  - `kendraa.ai` (production)
  - `*.kendraa.ai` (production subdomains)

**API restrictions:**
- Select "Restrict key"
- Choose:
  - Places API
  - Maps JavaScript API

### Step 3: Add API Key to Environment

1. Create `.env.local` in the `frontend/` directory:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

2. Replace `your_actual_api_key_here` with your actual API key from Step 1

3. **Never commit `.env.local` to version control** - it's already in `.gitignore`

### Step 4: Install Dependencies

```bash
cd frontend
npm install
```

This installs the `@react-google-maps/api` package.

### Step 5: Restart Development Server

```bash
npm run dev
```

The application will now use Google Maps Places Autocomplete for location selection.

## How It Works

### User Flow

1. **User opens Kundli Generator** → `/generator` page
2. **Clicks "Place of Birth" field** → Google Places Autocomplete loads
3. **Types location** (e.g., "Apollo Hospital Delhi") → Suggestions appear
4. **Selects location** → Coordinates extracted automatically
5. **Coordinates populate** → `latitude`, `longitude`, `timezone_offset` fields update
6. **User can override** → Manual coordinate entry still possible
7. **Submits form** → Kundli generated with precise coordinates

### Data Extraction

When a user selects a location:

```typescript
// Google Places returns:
{
  place_id: "ChIJ...",
  formatted_address: "Apollo Hospital, Sarita Vihar, Delhi, India",
  geometry: {
    location: {
      lat(): 28.5244,
      lng(): 77.1855
    }
  },
  name: "Apollo Hospital"
}

// Converted to application format:
{
  name: "Apollo Hospital, Sarita Vihar, Delhi, India",
  city: "Apollo Hospital",
  country: "India",
  latitude: 28.5244,
  longitude: 77.1855,
  timezone: 5.5,
  timezone_name: "UTC+05:30"
}
```

### Timezone Handling

- **Google Places API** does not provide timezone information
- **Solution**: Use CSV fallback for timezone lookup based on coordinates
- **User override**: Users can manually edit the `timezone_offset` field
- **Default**: Falls back to UTC+05:30 (India Standard Time) for Indian locations

## Features

✅ **High-Precision Coordinates** - 6+ decimal places (accurate to ~0.1 meters)
✅ **Flexible Search** - Cities, hospitals, landmarks, addresses
✅ **Real-time Suggestions** - As-you-type autocomplete
✅ **Error Handling** - Graceful fallback if API unavailable
✅ **Manual Override** - Users can edit coordinates and timezone
✅ **CSV Fallback** - Works without Google API (uses CSV search)
✅ **Session Tokens** - Reduces API costs with session-based billing
✅ **Loading States** - Visual feedback during API calls
✅ **Mobile Friendly** - Responsive design for all devices

## API Costs

### Pricing

- **Places Autocomplete**: $0.00 (free tier included)
- **Place Details**: $0.017 per request (after free tier)
- **Free tier**: 200 requests/month

### Cost Optimization

The implementation uses **Session Tokens** to reduce costs:
- Autocomplete suggestions: Free (with session token)
- Place details: Counted as single request (with session token)
- Without session tokens: Each autocomplete request costs $0.017

**Estimated monthly cost** (assuming 1000 kundli generations):
- With session tokens: ~$17 (1000 place detail requests)
- Without session tokens: ~$17,000+ (each autocomplete request costs money)

## Troubleshooting

### "Google Maps not available" Message

**Cause**: API key not configured or invalid

**Solution**:
1. Check `.env.local` exists in `frontend/` directory
2. Verify API key is correct
3. Ensure APIs are enabled in Google Cloud Console
4. Check domain restrictions if configured
5. Restart dev server: `npm run dev`

### Autocomplete Not Showing Suggestions

**Cause**: API key restrictions or network issue

**Solution**:
1. Open browser DevTools (F12) → Console
2. Look for error messages
3. Check if domain is in API key restrictions
4. Verify network request to Google API succeeds
5. Try a different search term

### Wrong Timezone Offset

**Cause**: CSV fallback doesn't have timezone for location

**Solution**:
1. Manually edit the `timezone_offset` field
2. Use online timezone finder for your location
3. Or use the CSV search as fallback (still available)

### API Quota Exceeded

**Cause**: Monthly free tier (200 requests) exceeded

**Solution**:
1. Check Google Cloud Console billing
2. Upgrade to paid plan if needed
3. Implement caching to reduce requests
4. Use session tokens (already implemented)

## Fallback Behavior

If Google Maps API is unavailable:

1. **Autocomplete disabled** → Shows warning message
2. **Manual entry required** → Users can type coordinates directly
3. **CSV search available** → Users can still search CSV database
4. **App still works** → No breaking changes, graceful degradation

## Reverting to CSV-Only (If Needed)

If you need to disable Google Maps and use CSV only:

1. Remove `VITE_GOOGLE_MAPS_API_KEY` from `.env.local`
2. In `GeneratorPage.tsx`, replace:
   ```tsx
   <GooglePlacesAutocomplete ... />
   ```
   with the original CSV search input
3. Restart dev server

The CSV endpoint (`/api/cities/search`) remains functional as a fallback.

## Security Considerations

### API Key Protection

✅ **Stored in `.env.local`** - Not committed to version control
✅ **Domain restricted** - Only works from authorized domains
✅ **API restricted** - Only Places API and Maps JavaScript API enabled
✅ **Rotation ready** - Can be rotated anytime in Google Cloud Console

### Data Privacy

- **No data storage** - Coordinates not stored in database
- **No tracking** - User searches not logged
- **Google's privacy policy** - Applies to API usage
- **User control** - Users can manually override coordinates

## Development Notes

### File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── GooglePlacesAutocomplete.tsx    (NEW)
│   ├── utils/
│   │   └── googleMapsLoader.ts             (NEW)
│   ├── data/
│   │   └── cities.ts                       (UPDATED)
│   ├── pages/
│   │   └── GeneratorPage.tsx               (UPDATED)
│   └── services/
│       └── api.ts                          (unchanged)
├── .env.local                              (CREATE with API key)
├── .env.example                            (NEW)
├── package.json                            (UPDATED)
└── vite.config.ts                          (UPDATED)
```

### TypeScript Support

All components are fully typed with TypeScript:
- `CityData` interface for location data
- `PlacePrediction` interface for autocomplete suggestions
- `PlaceDetails` interface for selected place details
- Full type safety in component props

### Testing

To test the integration:

1. **Start dev server**: `npm run dev`
2. **Navigate to**: `http://localhost:3000/generator`
3. **Click "Place of Birth"** field
4. **Type a location** (e.g., "Mumbai", "Apollo Hospital")
5. **Select from suggestions** → Coordinates should populate
6. **Verify coordinates** → Check latitude/longitude fields
7. **Generate kundli** → Should work with new coordinates

## Support

For issues or questions:

1. Check browser console (F12) for error messages
2. Verify API key and configuration
3. Check Google Cloud Console for quota/billing issues
4. Review this guide for troubleshooting steps
5. Check application logs for backend errors

## References

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)
