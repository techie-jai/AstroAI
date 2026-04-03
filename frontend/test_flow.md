# Complete Flow Test - AstroAI Kundli Generation

## Current Status
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:3001
- ✅ Firebase configured with Google OAuth

## Test Steps

### Step 1: Login with Google
1. Open http://localhost:3001 in browser
2. Click "Login with Google" button
3. Sign in with your Google account
4. Verify you're redirected to Dashboard

**What happens:**
- Frontend calls Firebase SDK to authenticate
- Gets Firebase ID token
- Stores token in localStorage as `firebaseToken`
- Token is valid for ~1 hour

### Step 2: Navigate to Generator
1. Click "Generate Kundli" in navigation
2. You should see the birth details form

**Form fields to fill:**
- Name: Your name
- Place of Birth: City, Country (e.g., "New Delhi, India")
- Latitude: Decimal degrees (e.g., 28.6139)
- Longitude: Decimal degrees (e.g., 77.2090)
- Timezone Offset: UTC offset (e.g., 5.5 for IST)
- Year: Birth year (e.g., 1990)
- Month: Birth month (1-12)
- Day: Birth day (1-31)
- Hour: Birth hour in 24h format (0-23)
- Minute: Birth minute (0-59)

### Step 3: Submit Form
1. Fill all fields with valid data
2. Click "Generate Kundli" button
3. Wait for processing (should take 5-10 seconds)

**Expected behavior:**
- Button shows "Generating..." with spinner
- Backend receives request with Authorization header
- Backend verifies Firebase token
- Backend generates kundli using PyJHora
- Frontend receives kundli_id and navigates to results page

### Step 4: Verify Results
1. You should see the results page with kundli data
2. Check browser console (F12) for any errors
3. Check backend terminal for logs

## Debugging Checklist

### If login fails:
- Check Firebase credentials in .env.local
- Check browser console for Firebase errors
- Verify Google OAuth is configured in Firebase Console

### If form submission fails:
- Check browser console (F12 → Console tab)
- Look for network errors in Network tab
- Check backend logs for auth errors

### If kundli generation fails:
- Check backend logs for "[AUTH]" messages
- Look for "[TOKEN VERIFICATION FAILED]" messages
- Verify token is being sent in Authorization header

## Test Data (Example)
```
Name: John Doe
Place: New Delhi, India
Latitude: 28.6139
Longitude: 77.2090
Timezone: 5.5
Year: 1990
Month: 1
Day: 15
Hour: 12
Minute: 30
```

## Expected Success Output
```
✅ Login successful
✅ Form submitted
✅ Backend received request with valid token
✅ Kundli generated (33+ data points)
✅ Results page displayed
```
