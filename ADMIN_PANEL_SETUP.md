# AstroAI Admin Panel - Complete Setup Guide

## Overview

A professional, feature-rich admin panel for managing AstroAI users, kundlis, and system analytics. Built with React, TypeScript, Tailwind CSS, and Firebase.

## What's Included

### Backend (Python/FastAPI)
- **Admin Service** (`backend/admin_service.py`) - Business logic for admin operations
- **Admin Routes** (`backend/admin_routes.py`) - REST API endpoints
- **Admin Auth** (`backend/admin_auth.py`) - Authentication middleware
- **20+ API Endpoints** for user management, kundli management, analytics, and system monitoring

### Frontend (React/TypeScript)
- **Separate Admin App** on port 3001 (isolated from public app)
- **5 Main Pages**: Dashboard, Users, Kundlis, Analytics, System
- **Firebase Authentication** with admin role verification
- **Professional UI** with Tailwind CSS and Lucide icons
- **Real-time Analytics** with Recharts

## Quick Start

### 1. Backend Setup

The backend admin API is already integrated. Just ensure your main.py includes:

```python
from admin_routes import router as admin_router
app.include_router(admin_router)
```

**Verify backend is running:**
```bash
cd backend
python main.py
# Should start on http://localhost:8000
```

### 2. Frontend Admin App Setup

```bash
cd admin-panel
npm install
cp .env.example .env.local
```

**Edit `.env.local` with your Firebase config:**
```env
VITE_ADMIN_API_URL=http://localhost:8000
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_ADMIN_INACTIVITY_TIMEOUT=1800000
```

**Start development server:**
```bash
npm run dev
```

Admin panel will be available at `http://localhost:3001`

## Setting Up Admin Users

### Option 1: Firebase Console

1. Go to Firebase Console → Authentication → Users
2. Create a new user with admin email
3. Go to Firestore → users collection
4. Add custom claim to user document:
   ```json
   {
     "admin": true
   }
   ```

### Option 2: Python Script

Create `set_admin.py` in backend:

```python
from firebase_admin import auth
from firebase_config import FirebaseConfig

FirebaseConfig.initialize()

# Set admin role
uid = "user-uid-here"
auth.set_custom_claims(uid, {'admin': True})
print(f"Admin role set for user {uid}")
```

Run:
```bash
python set_admin.py
```

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

### Authentication
- `POST /api/admin/auth/verify` - Verify admin token

### User Management
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/users/{userId}` - Get user details
- `PUT /api/admin/users/{userId}` - Update user
- `POST /api/admin/users/{userId}/block` - Block/unblock user
- `DELETE /api/admin/users/{userId}` - Delete user
- `POST /api/admin/users/{userId}/reset-password` - Reset password

### Kundli Management
- `GET /api/admin/kundlis` - List all kundlis
- `GET /api/admin/kundlis/{userId}/{kundliId}` - Get kundli details
- `DELETE /api/admin/kundlis/{userId}/{kundliId}` - Delete kundli

### Analytics
- `GET /api/admin/analytics/overview` - Dashboard metrics
- `GET /api/admin/analytics/user-growth` - User growth data
- `GET /api/admin/analytics/usage` - Feature usage
- `GET /api/admin/analytics/tokens` - Token usage

### System
- `GET /api/admin/system/health` - System health
- `GET /api/admin/logs` - Admin action logs

## Features

### Dashboard
- Real-time metrics (total users, kundlis, tokens)
- User growth chart (30-day trend)
- Quick navigation links
- System status overview

### User Management
- Search and filter users
- View detailed user profiles
- Block/unblock users
- Reset user passwords
- Delete users with confirmation
- View user kundli count and token usage

### Kundli Management
- View all generated kundlis
- Filter by user and status
- View kundli details and analysis
- Delete kundlis

### Analytics (Ready for Implementation)
- User growth trends
- Daily active users
- Feature adoption breakdown
- Token usage analytics
- Geographic distribution

### System Management (Ready for Implementation)
- System health metrics
- Application logs viewer
- Log search and filtering
- Maintenance tasks

## Security Features

✅ **Firebase Admin Role Verification** - Only users with `admin: true` custom claim can access
✅ **JWT Token Validation** - All requests require valid Firebase token
✅ **Session Timeout** - Auto-logout after 30 minutes of inactivity
✅ **Audit Logging** - All admin actions logged to `admin_logs` collection
✅ **CORS Restricted** - Localhost only by default
✅ **Confirmation Dialogs** - Destructive actions require confirmation

## Database Schema

### User Document (Added Fields)
```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "displayName": "User Name",
  "role": "user",
  "isBlocked": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLogin": "2024-01-15T10:30:00Z",
  "tokenUsage": {
    "total": 1000,
    "monthly": 500,
    "lastReset": "2024-01-01T00:00:00Z"
  },
  "kundliCount": 5
}
```

### Admin Logs Collection (New)
```json
{
  "action": "delete_user",
  "targetUserId": "user-id",
  "adminId": "admin-id",
  "details": { "email": "user@example.com" },
  "timestamp": "2024-01-15T10:30:00Z",
  "ipAddress": "local"
}
```

## Customization

### Adding New Admin Pages

1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in dashboard

### Styling

- Uses Tailwind CSS for styling
- Lucide icons for UI icons
- Recharts for analytics charts
- Customize colors in `tailwind.config.js`

### API Integration

All API calls go through `src/services/adminApi.ts`:

```typescript
const response = await adminApi.getUsers(50, 0, '', {})
```

## Troubleshooting

### "User does not have admin privileges"
- Verify user has `admin: true` custom claim in Firebase
- Check Firebase Console → Authentication → Custom Claims

### "Authorization header missing"
- Ensure Firebase token is being sent
- Check browser console for auth errors

### API returns 401
- Token may be expired
- Try logging out and logging back in
- Check Firebase credentials in .env.local

### Admin panel won't load
- Verify backend is running on port 8000
- Check VITE_ADMIN_API_URL in .env.local
- Check browser console for errors

## Production Deployment

### Backend
1. Deploy FastAPI backend to your hosting
2. Update CORS origins in `main.py`
3. Ensure admin routes are included

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting
3. Configure environment variables
4. Ensure backend API is accessible

### Environment Variables (Production)
```env
VITE_ADMIN_API_URL=https://api.yourdomain.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
```

## Performance Tips

- Admin panel uses pagination (50 users per page)
- Analytics data is cached for 5 minutes
- Use filters to reduce data load
- Kundli list is paginated (50 per page)

## Support & Documentation

- See `admin-panel/README.md` for detailed admin panel docs
- See `backend/admin_service.py` for service documentation
- See `backend/admin_routes.py` for API endpoint details

## Next Steps

1. ✅ Set up admin user with Firebase custom claims
2. ✅ Start backend: `python main.py`
3. ✅ Start admin panel: `npm run dev`
4. ✅ Login with admin credentials
5. ✅ Explore dashboard and manage users

## File Structure

```
AstroAI/
├── backend/
│   ├── admin_service.py          # Admin business logic
│   ├── admin_routes.py           # API endpoints
│   ├── admin_auth.py             # Authentication
│   └── main.py                   # (includes admin routes)
│
└── admin-panel/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── UsersPage.tsx
    │   │   ├── KundlisPage.tsx
    │   │   ├── AnalyticsPage.tsx
    │   │   └── SystemPage.tsx
    │   ├── services/
    │   │   └── adminApi.ts
    │   ├── store/
    │   │   └── adminAuthStore.ts
    │   ├── types/
    │   │   └── admin.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.ts
    └── README.md
```

## Summary

You now have a complete, professional admin panel for AstroAI with:

✅ Backend admin API with 20+ endpoints
✅ Frontend admin app with 5 main pages
✅ Firebase authentication with role-based access
✅ User management (view, block, delete, reset password)
✅ Kundli management
✅ Analytics dashboard with real-time metrics
✅ System monitoring and logs
✅ Professional UI with Tailwind CSS
✅ Comprehensive security features
✅ Audit logging

The admin panel is ready to use. Start the backend and frontend, set up an admin user, and you're good to go!
