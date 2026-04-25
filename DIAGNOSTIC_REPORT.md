# Google Maps Integration - Diagnostic Report

## Issue Analysis

### Problem
- Location field shows no suggestions when typing
- CSV fallback not working
- Google Maps API may or may not be loading

### Root Causes to Check

1. **CSV File Path Issue**
   - CSV file exists at: `e:\25. Codes\17. AstroAI V3\AstroAi\world_cities_with_tz.csv` ✅
   - Backend looks for it in multiple paths
   - Working directory might be different when backend runs

2. **Google Maps API Not Loading**
   - API key might not be in `.env.local`
   - API key might be invalid
   - Domain restrictions might block localhost
   - Script might fail to load

3. **Component State Issues**
   - Predictions state not updating
   - showPredictions not being set
   - Error state preventing display

---

## Quick Diagnostic Steps

### Step 1: Check Backend CSV Path
Run this in backend logs to see where it's looking:
```
[CITIES] Found cities file at: ...
```

If you see:
- ✅ Found at correct path → CSV file is accessible
- ❌ ERROR: Cities database not found → Path issue

### Step 2: Test CSV Endpoint Directly
In browser console:
```javascript
fetch('/api/cities/search?query=Mumbai')
  .then(r => r.json())
  .then(data => console.log('CSV Results:', data))
  .catch(err => console.error('CSV Error:', err))
```

Expected: Array of cities with Mumbai
Actual: Check error message

### Step 3: Check Google Maps API
In browser console:
```javascript
console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 15))
console.log('Google Maps:', !!window.google?.maps?.places)
```

Expected:
- API Key: AIzaSyDM... (first 15 chars)
- Google Maps: true

### Step 4: Check Component Logs
Open DevTools (F12) → Console
Type in location field and look for:
```
[GooglePlaces] Using CSV search for: ...
[GooglePlaces] CSV search returned: X results
```

---

## Solution Steps

### If CSV Endpoint Returns 404
**Problem**: CSV file not found
**Solution**:
1. Check backend working directory
2. Verify CSV file exists in that directory
3. Update backend to use absolute path

### If CSV Endpoint Returns Empty Array
**Problem**: Query not matching any cities
**Solution**:
1. Try searching for "Mumbai" (common city)
2. Check CSV file has data
3. Verify CSV format is correct

### If Google Maps Not Loading
**Problem**: API key issue or script failed
**Solution**:
1. Verify `.env.local` has `VITE_GOOGLE_MAPS_API_KEY`
2. Restart dev server: `npm run dev`
3. Check Google Cloud Console for API status
4. Add domain to API key restrictions

### If Dropdown Doesn't Show
**Problem**: State not updating
**Solution**:
1. Check browser console for errors
2. Verify `showPredictions` state is true
3. Check CSS is not hiding dropdown
4. Verify predictions array has items

---

## Files to Check

1. **Backend CSV Path**
   - File: `backend/main.py` line 2897-2986
   - Check: `possible_paths` list

2. **Frontend Environment**
   - File: `frontend/.env.local`
   - Check: `VITE_GOOGLE_MAPS_API_KEY` is set

3. **Frontend Component**
   - File: `frontend/src/components/GooglePlacesAutocomplete.tsx`
   - Check: `handleInputChange` function

4. **Vite Config**
   - File: `frontend/vite.config.ts`
   - Check: Environment variables exposed

---

## Next Actions

1. Run the test file: `frontend/src/__tests__/runTests.html`
2. Check browser console for error messages
3. Check backend logs for CSV file path
4. Follow diagnostic steps above
5. Report findings

---

## Expected Test Results

**All 7 tests should pass:**
- ✅ API Key Configuration
- ✅ Google Maps SDK Loading
- ✅ AutocompleteService Creation
- ✅ Predictions for "Mumbai"
- ✅ Predictions for "Hospital"
- ✅ Place Details Retrieval
- ✅ CSV Endpoint Fallback

**If any test fails:**
- Check the error message
- Follow the solution steps above
- Report the specific test failure

---

## How to Run Tests

### Option 1: HTML Test Page (Easiest)
1. Open: `frontend/src/__tests__/runTests.html` in browser
2. Tests auto-run on page load
3. View results in output panel

### Option 2: Console Test
1. Open: http://localhost:3000/generator
2. Press F12 → Console
3. Paste: `testGoogleMapsAPI()`
4. View results

### Option 3: Check Manually
1. Type in location field
2. Should see dropdown with suggestions
3. Click suggestion
4. Coordinates should populate

---

## Status

- Backend: Running ✅
- Frontend: Running ✅
- CSV File: Exists ✅
- Tests: Ready to run ⏳

**Next: Run tests and report results**
