# Complete Flow Test - Step by Step

## Test Environment
- Backend: http://localhost:8000 ✅ Running
- Frontend: http://localhost:3001 ✅ Running
- Browser: Open http://localhost:3001

## Step-by-Step Instructions

### STEP 1: Open Frontend
1. Go to http://localhost:3001 in your browser
2. You should see the AstroAI login page with "Sign in with Google" button

### STEP 2: Login with Google
1. Click "Sign in with Google" button
2. Sign in with your Google account
3. Grant permissions if prompted
4. Wait for redirect to Dashboard
5. **Verify:** You should see your email/name in top right corner

### STEP 3: Check Token is Stored
1. Press F12 to open Developer Tools
2. Go to **Application** tab
3. Click **Local Storage** → http://localhost:3001
4. Look for `firebaseToken` key
5. **Verify:** You should see a long JWT token (starts with "eyJ...")

### STEP 4: Navigate to Generator
1. Click "Generate Kundli" in the navigation menu
2. You should see the birth details form with fields:
   - Name
   - Place of Birth
   - Latitude
   - Longitude
   - Timezone Offset
   - Year, Month, Day
   - Hour, Minute

### STEP 5: Fill Birth Details
Use this test data:
```
Name: John Doe
Place of Birth: New Delhi, India
Latitude: 28.6139
Longitude: 77.2090
Timezone Offset: 5.5
Year: 1990
Month: 1
Day: 15
Hour: 12
Minute: 30
```

### STEP 6: Submit Form
1. Click "Generate Kundli" button
2. Button should show "Generating..." with spinner
3. Wait 5-10 seconds for processing

### STEP 7: Monitor Console
1. Press F12 → **Console** tab
2. Look for messages like:
   - `[API] Request to: /kundli/generate Token exists: true`
   - `[API] Response: 200 {...}`
3. **Verify:** No error messages should appear

### STEP 8: Check Results
1. If successful, you should see the Results page
2. Should display kundli data and information
3. **Verify:** No "Failed to generate kundli" error

## Expected Success Flow

```
1. Login with Google
   ↓
2. Token stored in localStorage
   ↓
3. Navigate to Generator
   ↓
4. Fill form with valid data
   ↓
5. Submit form
   ↓
6. Frontend sends POST /api/kundli/generate with:
   - Authorization: Bearer <firebase_token>
   - Body: birth_data, chart_types
   ↓
7. Backend receives request
   ↓
8. Backend verifies token
   ↓
9. Backend generates kundli using PyJHora
   ↓
10. Backend returns kundli_id and data
    ↓
11. Frontend navigates to results page
    ↓
✅ SUCCESS: Kundli Generated!
```

## Troubleshooting

### If you see "Failed to generate kundli"
1. Check browser console (F12 → Console)
2. Look for error message
3. Check if `firebaseToken` exists in localStorage
4. Check backend logs for `[KUNDLI]` messages

### If you see CORS error
- Already fixed - port 3001 is now in CORS allowed origins

### If you see 401 Unauthorized
- Token is missing or invalid
- Try logging out and logging back in

### If you see 422 Validation Error
- Check all form fields are filled correctly
- Verify latitude is -90 to 90
- Verify longitude is -180 to 180
- Verify timezone is -12 to 14

## Backend Logs to Watch

When you submit the form, watch the backend terminal for:
```
[KUNDLI] Starting generation for user: xxxxx
[KUNDLI] Birth data: {...}
[KUNDLI] Generation result: success=True
[KUNDLI] Generated kundli_id: xxxxx
[KUNDLI] Saving calculation to Firebase...
[KUNDLI] Calculation saved: xxxxx
[KUNDLI] Updating user profile...
[KUNDLI] User profile updated
[KUNDLI] Returning response: {...}
INFO:     127.0.0.1:xxxxx - "POST /api/kundli/generate HTTP/1.1" 200 OK
```

## Quick Checklist

- [ ] Frontend loads at http://localhost:3001
- [ ] Login button visible
- [ ] Can log in with Google
- [ ] Redirected to Dashboard
- [ ] Email/name visible in top right
- [ ] `firebaseToken` in localStorage
- [ ] Can navigate to Generator page
- [ ] Form displays all fields
- [ ] Can fill all fields with valid data
- [ ] Can click "Generate Kundli" button
- [ ] Button shows "Generating..." state
- [ ] Results page displays after 5-10 seconds
- [ ] No "Failed to generate kundli" error
- [ ] Backend logs show successful generation

## Success Criteria

✅ All steps complete without errors
✅ Kundli generated and displayed
✅ No error messages in console
✅ Backend logs show successful flow
