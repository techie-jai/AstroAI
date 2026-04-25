# Google Maps API Testing Guide

## Quick Test (2 minutes)

### Step 1: Start Services
```bash
# Terminal 1: Start Backend
cd backend
python main.py

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### Step 2: Open Browser
- Navigate to: http://localhost:3000/generator
- Press F12 to open DevTools
- Go to Console tab

### Step 3: Run Test
Copy and paste this into console:
```javascript
testGoogleMapsAPI()
```

### Expected Output
```
✅ PASSED: API key is available
✅ PASSED: Google Maps SDK is loaded
✅ PASSED: AutocompleteService is available
✅ PASSED: Got predictions for "Mumbai"
✅ PASSED: Got predictions for "Hospital"
✅ PASSED: Got place details
✅ PASSED: CSV endpoint working

🎉 ALL TESTS PASSED!
```

---

## Detailed Testing

### Test 1: Check API Key
```javascript
testAPIKey()
```
**What it checks:**
- API key exists in environment variables
- API key has proper length

**Expected output:**
```
API Key present: true
API Key (first 15 chars): AIzaSyDM1590tA...
API Key length: 39
✅ PASSED: API key is available
```

**If it fails:**
- Check `.env.local` exists in `frontend/` directory
- Verify `VITE_GOOGLE_MAPS_API_KEY=...` is set
- Restart dev server: `npm run dev`

---

### Test 2: Check Google Maps SDK Loaded
```javascript
testGoogleMapsLoaded()
```
**What it checks:**
- Google Maps JavaScript SDK loaded
- window.google object available
- Places API available

**Expected output:**
```
window.google available: true
window.google.maps available: true
window.google.maps.places available: true
✅ PASSED: Google Maps SDK is loaded
```

**If it fails:**
- Check browser Network tab (F12 → Network)
- Look for request to: `maps.googleapis.com/maps/api/js`
- Should return 200 status
- If 403/401: API key invalid or domain not authorized

---

### Test 3: Check AutocompleteService
```javascript
testAutocompleteService()
```
**What it checks:**
- Can create AutocompleteService instance
- Service is properly initialized

**Expected output:**
```
AutocompleteService created: true
✅ PASSED: AutocompleteService is available
```

**If it fails:**
- Google Maps SDK not loaded (run Test 2 first)
- Check browser console for errors

---

### Test 4: Test Predictions for "Mumbai"
```javascript
await testMumbaiPredictions()
```
**What it checks:**
- AutocompleteService returns predictions
- Predictions have correct format
- Can get multiple results

**Expected output:**
```
Predictions returned: 5
First 3 predictions:
  1. Mumbai, India
  2. Mumbai, Maharashtra, India
  3. Mumbai International Airport, Mumbai, India
✅ PASSED: Got predictions for "Mumbai"
```

**If it fails:**
- API key might be invalid
- Domain not in API key restrictions
- API quota exceeded

---

### Test 5: Test Predictions for "Hospital"
```javascript
await testHospitalPredictions()
```
**What it checks:**
- Can search for establishment types
- Works with generic search terms

**Expected output:**
```
Predictions returned: 5
First 3 predictions:
  1. Hospital Road, Bangalore, India
  2. Hospital Road, Hyderabad, India
  3. Hospital Road, Mumbai, India
✅ PASSED: Got predictions for "Hospital"
```

**If it fails:**
- Same as Test 4

---

### Test 6: Test Place Details
```javascript
await testPlaceDetails()
```
**What it checks:**
- Can get detailed information about a place
- Coordinates are returned correctly
- Address formatting works

**Expected output:**
```
Place details:
  Name: Mumbai
  Address: Mumbai, Maharashtra, India
  Latitude: 19.0760
  Longitude: 72.8777
✅ PASSED: Got place details
```

**If it fails:**
- PlacesService might not be initialized
- Place ID might be invalid

---

### Test 7: Test CSV Endpoint
```javascript
await testCSVEndpoint()
```
**What it checks:**
- Backend CSV search endpoint working
- CSV data is accessible
- Fallback mechanism available

**Expected output:**
```
Response status: 200
Results returned: 10
First 3 results:
  1. Mumbai,IN (Mumbai, India)
     Lat: 19.0760, Lng: 72.8777
  2. Mumbai Nagar,IN (Mumbai Nagar, India)
     Lat: 20.5937, Lng: 78.9629
  3. Mumbai Suburban,IN (Mumbai Suburban, India)
     Lat: 19.1136, Lng: 72.8697
✅ PASSED: CSV endpoint working
```

**If it fails:**
- Backend not running
- CSV file not found
- Check backend logs for errors

---

## Quick Predictions Test

Test multiple search terms at once:
```javascript
await quickTestPredictions()
```

**What it tests:**
- Mumbai
- Delhi
- Hospital
- Airport
- New York

**Expected output:**
```
"Mumbai": 5 results
"Delhi": 5 results
"Hospital": 5 results
"Airport": 5 results
"New York": 5 results
```

---

## Testing in the UI

### Manual Test in Location Field

1. Navigate to: http://localhost:3000/generator
2. Click "Place of Birth" field
3. Type "Mumbai"
4. Should see dropdown with suggestions
5. Click on a suggestion
6. Coordinates should populate automatically

### What to Look For

**Success Indicators:**
- ✅ Dropdown appears while typing
- ✅ Suggestions match search term
- ✅ Clicking suggestion populates coordinates
- ✅ Latitude and Longitude fields update
- ✅ Form can be submitted

**Failure Indicators:**
- ❌ No dropdown appears
- ❌ Dropdown is empty
- ❌ Error message displayed
- ❌ Coordinates not populated

---

## Browser Console Logs

### What to Look For

**Success Logs:**
```
[GoogleMaps] API Key present: true
[GoogleMaps] Loading Google Maps API with key: AIzaSyDM...
[GoogleMaps] Google Maps API loaded successfully
[GoogleMaps] window.google available: true
[GooglePlaces] Trying Google Maps API for: Mumbai
[GooglePlaces] Got Google Maps predictions: 5
```

**Fallback Logs:**
```
[GooglePlaces] Google Maps API error, falling back to CSV
[GooglePlaces] Using CSV search for: Mumbai
[GooglePlaces] CSV search returned: 10 results
[GooglePlaces] Showing 10 CSV predictions
```

**Error Logs:**
```
[GoogleMaps] API key not found in environment variables
[GoogleMaps] Failed to load Google Maps API
[GooglePlaces] Error fetching suggestions
```

---

## Troubleshooting

### Issue: "API Key present: false"
**Cause:** `.env.local` not found or empty
**Solution:**
1. Create `frontend/.env.local`
2. Add: `VITE_GOOGLE_MAPS_API_KEY=your_key_here`
3. Restart dev server: `npm run dev`

### Issue: "Google Maps SDK not loaded"
**Cause:** API key invalid or domain not authorized
**Solution:**
1. Verify API key is correct
2. Check Google Cloud Console:
   - APIs enabled: Places API, Maps JavaScript API
   - Domain restrictions: Add `localhost:3000`
3. Wait 5 minutes for changes to propagate
4. Restart dev server

### Issue: "No predictions returned"
**Cause:** API quota exceeded or API key restricted
**Solution:**
1. Check Google Cloud Console for quota usage
2. Verify API restrictions allow Places API
3. Try different search term
4. Check if CSV fallback works

### Issue: "CSV endpoint not working"
**Cause:** Backend not running or CSV file missing
**Solution:**
1. Start backend: `python backend/main.py`
2. Check backend logs for CSV file path
3. Verify `world_cities_with_tz.csv` exists
4. Check file has data: `head world_cities_with_tz.csv`

---

## Network Debugging

### Check API Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Type in location field
4. Look for requests to:
   - `maps.googleapis.com/maps/api/js` (SDK load)
   - `maps.googleapis.com/maps/api/place/autocomplete/json` (predictions)
   - `localhost:8000/api/cities/search` (CSV fallback)

### Check Response Status

- **200**: Success
- **400**: Bad request (invalid parameters)
- **401/403**: Unauthorized (API key issue)
- **429**: Rate limited (quota exceeded)
- **500**: Server error

---

## Performance Testing

### Measure Response Time

```javascript
console.time('Predictions')
await testMumbaiPredictions()
console.timeEnd('Predictions')
```

**Expected times:**
- Google Maps: 200-500ms
- CSV search: 50-200ms
- Place details: 100-300ms

---

## Automated Testing

### Run All Tests
```javascript
const results = await testGoogleMapsAPI()
console.table(results)
```

### Run Specific Tests
```javascript
await testMumbaiPredictions()
await testHospitalPredictions()
await testPlaceDetails()
await testCSVEndpoint()
```

---

## Test Files Location

- **Console Test**: `frontend/src/__tests__/googleMapsConsoleTest.js`
- **Unit Tests**: `frontend/src/__tests__/googleMapsAPI.test.ts`
- **Testing Guide**: This file

---

## Next Steps

1. ✅ Run `testGoogleMapsAPI()` in console
2. ✅ Check all tests pass
3. ✅ Test in location field UI
4. ✅ Verify coordinates populate
5. ✅ Generate a kundli
6. ✅ Verify kundli is correct

---

## Support

If tests fail:
1. Check browser console for error messages
2. Check backend logs for errors
3. Verify `.env.local` has API key
4. Verify backend is running
5. Check Google Cloud Console for API status
6. Try CSV fallback test

**All tests should pass before using in production.**
