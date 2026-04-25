# Testing CSV Search Endpoint

## Quick Test

Open your browser console and run:

```javascript
// Test the CSV search endpoint
fetch('/api/cities/search?query=Mumbai')
  .then(r => r.json())
  .then(data => console.log('CSV Search Results:', data))
  .catch(err => console.error('CSV Search Error:', err))
```

## Expected Output

Should return an array of cities like:
```json
[
  {
    "name": "Mumbai,IN",
    "city": "Mumbai",
    "country": "India",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "timezone": 5.5,
    "timezone_name": "IST"
  },
  ...
]
```

## If It Fails

**Error: "404 Not Found"**
- Backend is not running
- Start backend: `python backend/main.py` or `.\start_all.ps1`

**Error: "CORS error"**
- Backend CORS not configured
- Check backend/main.py has CORS middleware

**Error: "No results"**
- CSV file not found at expected path
- Check backend logs for file path

## Debugging Steps

1. **Check backend is running**
   ```bash
   # Should see "Uvicorn running on http://0.0.0.0:8000"
   ```

2. **Check CSV file exists**
   - Backend logs should show: "[CITIES] Found cities file at: ..."
   - File should be at: `world_cities_with_tz.csv`

3. **Test with curl**
   ```bash
   curl "http://localhost:8000/api/cities/search?query=Mumbai"
   ```

4. **Check browser console**
   - Open DevTools (F12)
   - Go to Console tab
   - Run the test code above
   - Look for error messages

## Common Issues

### Issue: Empty dropdown, no suggestions
**Cause**: CSV endpoint returning empty array
**Fix**: 
1. Verify backend is running
2. Check CSV file path in backend logs
3. Try searching for "Mumbai" (common city in CSV)

### Issue: Dropdown shows "No locations found"
**Cause**: Search query doesn't match any cities
**Fix**:
1. Try a different city name
2. Check CSV file has data
3. Verify backend CSV search logic

### Issue: Dropdown doesn't appear at all
**Cause**: showPredictions state not being set
**Fix**:
1. Check browser console for errors
2. Verify handleInputChange is being called
3. Check that input has at least 2 characters

## Next Steps

1. Run the test code in browser console
2. Check if CSV endpoint returns data
3. If yes, component should show suggestions
4. If no, check backend logs for errors
