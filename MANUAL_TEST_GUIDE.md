# Manual Testing Guide: Complete Kundli Generation Flow

## Current Status
✅ Backend running on http://localhost:8000  
✅ Frontend running on http://localhost:3001  
✅ Enhanced logging enabled on backend  
✅ Firebase configured with Google OAuth  

## Step-by-Step Testing Instructions

### Phase 1: Login to Frontend

1. **Open the frontend in your browser**
   - Go to: http://localhost:3001
   - You should see the AstroAI login page

2. **Click "Login with Google" button**
   - This will open Google's OAuth login
   - Sign in with your Google account
   - Grant permissions if asked

3. **Verify successful login**
   - You should be redirected to the Dashboard
   - You should see your email/name displayed
   - Check browser console (F12 → Console) for any errors

4. **Verify Firebase token is stored**
   - Press F12 to open Developer Tools
   - Go to Application tab → Local Storage
   - Look for `firebaseToken` key
   - You should see a long JWT token (starts with "eyJ...")

### Phase 2: Navigate to Kundli Generator

1. **Click "Generate Kundli" in the navigation menu**
   - You should see the birth details form
   - Form has fields for: Name, Place, Latitude, Longitude, Timezone, Date, Time

### Phase 3: Fill in Birth Details

Use this sample data (or your own):

```
Name: John Doe
Place of Birth: New Delhi, India
Latitude: 28.6139
Longitude: 77.2090
Timezone Offset (UTC): 5.5
Year: 1990
Month: 1
Day: 15
Hour: 12
Minute: 30
```

**How to fill:**
1. Click each field and enter the value
2. For coordinates, use decimal format (e.g., 28.6139)
3. For timezone, use decimal (5.5 for IST, -5 for EST, etc.)
4. For time, use 24-hour format (0-23 for hours)

### Phase 4: Submit and Generate

1. **Click "Generate Kundli" button**
   - Button should show "Generating..." with a spinner
   - This should take 5-10 seconds

2. **Monitor the backend logs**
   - Open a terminal and watch the backend output
   - You should see logs like:
     ```
     [AUTH] Verifying token: eyJ...
     [TOKEN VERIFIED] UID: xxxxx, Email: your@email.com
     [DEBUG] Starting kundli generation for John Doe
     [DEBUG] Birth data set successfully
     [DEBUG] Kundli generated successfully with 33 data points
     ```

### Phase 5: Verify Results

1. **Check if you see the results page**
   - Should show kundli data and charts
   - Should display birth information

2. **If successful:**
   - ✅ Kundli generated successfully
   - ✅ Complete flow is working
   - ✅ Backend and frontend are communicating

3. **If failed:**
   - Check browser console (F12) for error messages
   - Check backend logs for [ERROR] or [TOKEN VERIFICATION FAILED]
   - See troubleshooting section below

## Troubleshooting

### Issue: Login page doesn't show Google button
**Solution:**
- Check Firebase config in `.env.local`
- Verify Firebase project is set up with Google OAuth
- Check browser console for Firebase errors

### Issue: "Failed to generate kundli" error
**Check backend logs for:**

1. **[AUTH] Missing authorization header**
   - Frontend didn't send the token
   - Check if `firebaseToken` exists in localStorage

2. **[TOKEN VERIFICATION FAILED]**
   - Token is invalid or expired
   - Try logging out and logging back in
   - Check if Firebase credentials are correct

3. **[ERROR] Kundli generation failed**
   - PyJHora error
   - Check backend terminal for detailed error message
   - Verify ephemeris files exist

### Issue: Form validation errors
**Check:**
- All fields are filled
- Latitude is between -90 and 90
- Longitude is between -180 and 180
- Timezone is between -12 and 14
- Year is between 1900 and 2100
- Month is 1-12, Day is 1-31, Hour is 0-23, Minute is 0-59

## Monitoring Backend Logs

**Open a new terminal and run:**
```powershell
cd "e:\25. Codes\15. AstroAI\backend"
python -c "import subprocess; subprocess.run(['powershell', '-Command', \"& { . '../astroai-env/Scripts/Activate.ps1'; python -m uvicorn main:app --host 0.0.0.0 --port 8000 }\"])"
```

Or simply watch the existing backend terminal for logs like:
```
[AUTH] Verifying token: eyJ...
[TOKEN VERIFIED] UID: user123, Email: user@gmail.com
[DEBUG] Starting kundli generation for John Doe
[DEBUG] Birth data set successfully
[DEBUG] Kundli generated successfully with 33 data points
INFO:     127.0.0.1:xxxxx - "POST /api/kundli/generate HTTP/1.1" 200 OK
```

## Expected Success Flow

```
1. User logs in with Google
   ↓
2. Frontend gets Firebase token
   ↓
3. User fills birth details form
   ↓
4. User clicks "Generate Kundli"
   ↓
5. Frontend sends POST to /api/kundli/generate with:
   - Authorization: Bearer <firebase_token>
   - Body: birth_data, chart_types
   ↓
6. Backend receives request
   ↓
7. Backend verifies Firebase token
   ↓
8. Backend generates kundli using PyJHora
   ↓
9. Backend returns kundli_id and data
   ↓
10. Frontend displays results page
    ↓
✅ SUCCESS: Kundli generated!
```

## Quick Reference

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:3001 | ✅ Running |
| Backend | http://localhost:8000 | ✅ Running |
| Backend Health | http://localhost:8000/health | ✅ 200 OK |
| Kundli Endpoint | POST /api/kundli/generate | ✅ Ready |

## Next Steps After Success

Once kundli generation is working:
1. Test with different birth data
2. Check if charts are generated (D1, D7, D9, D10)
3. Test the analysis generation
4. Test the history page
5. Test the settings page
