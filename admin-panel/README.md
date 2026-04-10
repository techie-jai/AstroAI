# AstroAI Admin Panel

Professional admin dashboard for managing AstroAI users, kundlis, and system analytics.

## Features

- **User Management**: View, block, delete users, reset passwords
- **Kundli Management**: View and manage all generated kundlis
- **Analytics Dashboard**: Real-time metrics and trends
- **System Monitoring**: Health checks and logs
- **Firebase Authentication**: Admin role-based access control
- **Responsive Design**: Works on desktop and tablet

## Setup

### Prerequisites

- Node.js 16+ and npm
- Firebase project with admin credentials
- Backend API running on `http://localhost:8000`

### Installation

```bash
cd admin-panel
npm install
```

### Environment Configuration

Create `.env.local` file:

```env
VITE_ADMIN_API_URL=http://localhost:8000
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_ADMIN_INACTIVITY_TIMEOUT=1800000
```

### Running Development Server

```bash
npm run dev
```

Admin panel will be available at `http://localhost:3001`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   ├── KundlisPage.tsx
│   ├── AnalyticsPage.tsx
│   └── SystemPage.tsx
├── services/           # API services
│   └── adminApi.ts
├── store/             # State management
│   └── adminAuthStore.ts
├── types/             # TypeScript types
│   └── admin.ts
├── App.tsx
└── main.tsx
```

## Pages to Implement

### 1. DashboardPage
- Overview stats (total users, kundlis, tokens)
- User growth chart
- Feature usage breakdown
- Recent activities

### 2. UsersPage
- User table with search and filters
- User detail modal
- Block/unblock functionality
- Delete user with confirmation
- Password reset

### 3. KundlisPage
- Kundli table with pagination
- View kundli details
- Delete kundli
- Filter by user and status

### 4. AnalyticsPage
- User growth trends
- Daily active users
- Feature adoption
- Token usage analytics
- Geographic distribution

### 5. SystemPage
- System health metrics
- Application logs
- Log search and filtering
- Maintenance tasks

## Authentication

Admin users must have Firebase custom claims with `admin: true` to access the panel.

To set admin role for a user:

```python
# In Firebase Admin SDK
from firebase_admin import auth

auth.set_custom_claims(uid, {'admin': True})
```

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

### Users
- `GET /api/admin/users` - List users
- `GET /api/admin/users/{userId}` - Get user details
- `PUT /api/admin/users/{userId}` - Update user
- `POST /api/admin/users/{userId}/block` - Block user
- `DELETE /api/admin/users/{userId}` - Delete user
- `POST /api/admin/users/{userId}/reset-password` - Reset password

### Kundlis
- `GET /api/admin/kundlis` - List kundlis
- `GET /api/admin/kundlis/{userId}/{kundliId}` - Get kundli details
- `DELETE /api/admin/kundlis/{userId}/{kundliId}` - Delete kundli

### Analytics
- `GET /api/admin/analytics/overview` - Dashboard metrics
- `GET /api/admin/analytics/user-growth` - User growth data
- `GET /api/admin/analytics/usage` - Feature usage
- `GET /api/admin/analytics/tokens` - Token usage

### System
- `GET /api/admin/system/health` - System health
- `GET /api/admin/logs` - Admin logs

## Security

- Admin access only - requires Firebase admin role
- Session timeout after 30 minutes of inactivity
- All actions logged for audit trail
- CORS restricted to localhost
- JWT token validation on all requests

## Technologies

- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Firebase Authentication
- Recharts for analytics
- Zustand for state management
- Axios for API calls

## Development Notes

- All API calls use axios with automatic token injection
- Auth store handles session management and inactivity timeout
- Protected routes require admin role
- Error handling with user-friendly messages
- Responsive design using Tailwind CSS

## Deployment

For production deployment:

1. Build the app: `npm run build`
2. Deploy `dist/` folder to your hosting
3. Configure environment variables
4. Ensure backend API is accessible
5. Set up CORS for your domain

## Support

For issues or questions, refer to the main AstroAI documentation.
