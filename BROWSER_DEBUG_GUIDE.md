# Browser Debugging Guide

## 🎯 Goal
Understand exactly what's happening when you type in the location field.

## 📋 Step-by-Step Instructions

### Step 1: Open DevTools
1. Go to http://localhost:3000/generator
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Clear any existing logs: Type `clear()` and press Enter

### Step 2: Enable All Logs
In console, paste this to enable detailed logging:
```javascript
// Enable all Google Places logs
window.logGooglePlaces = true
console.log('Google Places logging enabled')
```

### Step 3: Type in Location Field
1. Click on "Place of Birth" field
2. Type: "Mumbai" (slowly, one letter at a time)
3. Watch the console for logs

### Step 4: Expected Console Output

You should see these logs in order:

```
[GooglePlaces] Using CSV search for: M
[GooglePlaces] CSV search returned: 0 results
[GooglePlaces] No results found

[GooglePlaces] Using CSV search for: Mu
[GooglePlaces] CSV search returned: 0 results
[GooglePlaces] No results found

[GooglePlaces] Using CSV search for: Mum
[GooglePlaces] CSV search returned: 0 results
[GooglePlaces] No results found

[GooglePlaces] Using CSV search for: Mumb
[GooglePlaces] CSV search returned: 0 results
[GooglePlaces] No results found

[GooglePlaces] Using CSV search for: Mumba
[GooglePlaces] CSV search returned: 0 results
[GooglePlaces] No results found

[GooglePlaces] Using CSV search for: Mumbai
[GooglePlaces] CSV search returned: 2 results
[GooglePlaces] Showing 2 CSV predictions
[GooglePlaces] First prediction: {place_id: "csv_0_Mumbai, India", main_text: "Mumbai, India", secondary_text: "India", ...}
[GooglePlaces] Rendering prediction 0: Mumbai, India India
[GooglePlaces] Rendering prediction 1: Navi Mumbai, India India
```

### Step 5: Check Dropdown
After typing "Mumbai", you should see:
- A white dropdown box appears below the input field
- Two city options visible:
  - Mumbai, India
  - Navi Mumbai, India

### Step 6: If Dropdown Doesn't Appear

**Check these in order:**

#### Check 6A: Are logs appearing?
- If NO logs appear → Component not being called
- If logs appear but say "0 results" → CSV search not finding data
- If logs appear with results → Rendering issue

#### Check 6B: Network Request
1. Go to **Network** tab
2. Type "Mumbai" in location field
3. Look for request to: `/api/cities/search?query=Mumbai`
4. Click on it
5. Check **Response** tab
6. Should show array of cities with data

#### Check 6C: React State
1. Install **React DevTools** browser extension
2. Go to **Components** tab
3. Find `GooglePlacesAutocomplete` component
4. Check these state values:
   - `predictions`: Should be array of objects
   - `showPredictions`: Should be `true`
   - `loading`: Should be `false`
   - `error`: Should be `null` or "Using CSV database"

### Step 7: If Text Still Not Visible

**Inspect the dropdown element:**
1. Right-click on the dropdown area
2. Select "Inspect" (or press F12 if not open)
3. Look for the `<button>` elements
4. Check if they have content
5. Check computed styles for text color

## 🔍 Troubleshooting Checklist

- [ ] Console logs appear when typing
- [ ] CSV search returns results (not 0)
- [ ] Network request to `/api/cities/search` returns 200
- [ ] Response has city data
- [ ] React state shows predictions array
- [ ] showPredictions is true
- [ ] Dropdown element has text content
- [ ] Text color is not white (should be gray-900)

## 🐛 Common Issues & Solutions

### Issue 1: No console logs appear
**Cause**: Component not being called
**Solution**:
1. Check if you're typing in the correct field
2. Check if component is mounted
3. Restart dev server: `npm run dev`

### Issue 2: Logs say "0 results"
**Cause**: CSV search not finding matches
**Solution**:
1. Check Network tab for `/api/cities/search` request
2. Verify response has data
3. Try searching for exact city name: "Mumbai"

### Issue 3: Logs show results but no dropdown
**Cause**: showPredictions not being set to true
**Solution**:
1. Check React DevTools for state
2. Verify `setShowPredictions(true)` is being called
3. Check for JavaScript errors in console

### Issue 4: Dropdown appears but text invisible
**Cause**: Text color issue or empty content
**Solution**:
1. Inspect element to check for content
2. Check computed styles for color
3. Verify main_text is populated in state

## 📝 What to Report

If you still have issues, provide:
1. Screenshot of console logs
2. Screenshot of Network request/response
3. Screenshot of React DevTools state
4. Screenshot of inspected HTML element

This will help identify exactly where the issue is.

---

**Remember**: The backend is working (verified with Python tests). The issue is in the frontend React component or browser rendering.
