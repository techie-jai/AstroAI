# Quick Test Checklist

## ✅ Backend Tests (Already Verified)

- [x] CSV file exists: 162,449 cities
- [x] CSV endpoint responds: Status 200
- [x] Data format correct: name, city, country, latitude, longitude
- [x] Multiple queries work: Mumbai, Delhi, Hospital, Airport, New York
- [x] Data conversion correct: main_text populated

## 🧪 Frontend Tests (To Do)

### Step 1: Restart Frontend
```bash
npm run dev
```
Wait for: `Local: http://localhost:3000`

### Step 2: Open Browser
1. Go to: http://localhost:3000/generator
2. Press F12 to open DevTools
3. Go to Console tab

### Step 3: Type in Location Field
1. Click "Place of Birth" field
2. Type: "Mumbai"
3. **Check Console** - Should see:
   ```
   [GooglePlaces] Using CSV search for: Mumbai
   [GooglePlaces] CSV search returned: 2 results
   [GooglePlaces] Showing 2 CSV predictions
   [GooglePlaces] First prediction: {main_text: "Mumbai, India", ...}
   [GooglePlaces] Rendering prediction 0: Mumbai, India India
   [GooglePlaces] Rendering prediction 1: Navi Mumbai, India India
   ```

### Step 4: Check Dropdown
- **Expected**: Dropdown appears with city names visible
  - Mumbai, India
  - Navi Mumbai, India

- **If text not visible**:
  - Check Network tab for `/api/cities/search?query=Mumbai`
  - Should return 200 with data
  - Check React DevTools for `predictions` state
  - Verify `main_text` is populated

### Step 5: Click on City
1. Click "Mumbai, India"
2. **Expected**:
   - Field shows "Mumbai, India"
   - Latitude: 19.07283
   - Longitude: 72.88261

### Step 6: Generate Kundli
1. Fill in other required fields
2. Click "Generate Kundli"
3. **Expected**: Kundli generated successfully with correct coordinates

## 🎯 Success Criteria

All of the following must be true:

- [ ] Console shows CSV search logs
- [ ] Dropdown appears when typing
- [ ] City names visible in dropdown
- [ ] Can click on city
- [ ] Coordinates populate correctly
- [ ] Can generate kundli with CSV data

## 🔧 Troubleshooting

### If console logs don't appear:
1. Hard refresh browser: Ctrl+Shift+R
2. Clear browser cache
3. Restart dev server: npm run dev
4. Check backend is still running on port 8000

### If dropdown doesn't appear:
1. Check Network tab for `/api/cities/search` request
2. Verify response status is 200
3. Check React DevTools for `showPredictions` state
4. Verify `predictions` array has items

### If text not visible:
1. Inspect dropdown element (F12)
2. Check if `text-gray-900` class is applied
3. Check computed styles for color
4. Verify no CSS is overriding text color

## 📝 Notes

- CSV fallback is fully functional
- Google Maps API is optional
- All data from CSV includes coordinates and timezone
- Can generate kundli without Google Maps API

## ✨ Expected Behavior

When everything works:
1. Type city name → CSV search triggers
2. Dropdown shows matching cities
3. Click city → Coordinates populate
4. Generate kundli → Works perfectly

---

**Status**: All backend verified ✅, ready for frontend testing
