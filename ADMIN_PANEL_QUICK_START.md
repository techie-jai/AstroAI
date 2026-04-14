# Admin Panel - Quick Start Guide

## Overview
The admin panel now displays **real data** from the local `users/` directory with 70+ users and 100+ kundlis.

## Data Source
- **Location:** `users/` directory
- **Global Index:** `users/kundli_index.json` (contains all kundlis)
- **User Data:** Individual user directories with metadata and analysis files

## Starting the Admin Panel

### 1. Start Backend
```bash
cd backend
python main.py
```
Backend will run on `http://localhost:8000`

### 2. Start Admin Panel
```bash
cd admin-panel
npm install  # if needed
npm run dev
```
Admin panel will run on `http://localhost:3001`

### 3. Login
- Navigate to `http://localhost:3001/login`
- Use admin credentials (configured in your environment)

## Dashboard Metrics

The dashboard now shows real data:

### KPI Cards
- **Total Users:** Count of unique users from kundli index
- **Active Users (30d):** Users with kundlis generated in last 30 days
- **Total Kundlis:** Count from global `kundli_index.json`
- **Tokens Used:** Sum of token usage from user metadata

### Charts
- **User Growth:** Real user creation dates over time
- **Kundli Distribution:** Distribution of kundli types
- **System Health:** Storage status and metrics

### Recent Activity
- Latest kundli generations from the index

## Data Flow

```
users/ directory
    ├── kundli_index.json (global index)
    └── [70+ user directories]
            ↓
AdminAnalyticsService
    ├── get_all_users_from_filesystem()
    ├── get_all_kundlis_from_filesystem()
    ├── compute_analytics_overview()
    ├── compute_user_growth_analytics()
    └── compute_usage_analytics()
            ↓
AdminService (backend/admin_service.py)
            ↓
AdminRoutes (/api/admin/*)
            ↓
Frontend (admin-panel)
            ↓
Dashboard Display
```

## API Endpoints

All endpoints return real data from the filesystem:

### Analytics Endpoints
- `GET /api/admin/analytics/overview` - Dashboard metrics
- `GET /api/admin/analytics/user-growth?days=30` - User growth data
- `GET /api/admin/analytics/usage` - Feature usage statistics
- `GET /api/admin/analytics/tokens` - Token usage analytics
- `GET /api/admin/system/health` - System health metrics

### User Management
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/{user_id}` - User details
- `PUT /api/admin/users/{user_id}` - Update user
- `POST /api/admin/users/{user_id}/block` - Block/unblock user
- `DELETE /api/admin/users/{user_id}` - Delete user

### Kundli Management
- `GET /api/admin/kundlis` - List all kundlis
- `GET /api/admin/kundlis/{user_id}/{kundli_id}` - Kundli details
- `DELETE /api/admin/kundlis/{user_id}/{kundli_id}` - Delete kundli

## Verification

### Test the Analytics Service
```bash
python backend/test_admin_analytics.py
```

Expected output:
```
============================================================
ADMIN ANALYTICS TEST
============================================================

1. USERS FROM FILESYSTEM:
   Total users found: 70+
   First 3 users:
     - Shreya Rao: X kundlis, Y analysis
     - Pooja Bhat: X kundlis, Y analysis
     ...

2. KUNDLIS FROM FILESYSTEM:
   Total kundlis found: 100+
   First 3 kundlis:
     - Divya Gupta: kundli-id-1
     - Divya Verma: kundli-id-2
     ...

3. ANALYTICS OVERVIEW:
   Total Users: 70+
   Active Users (30d): X
   Total Kundlis: 100+
   Tokens Used: X
   With Analysis: X
   Without Analysis: X
   Avg Kundlis/User: X.XX

4. USER GROWTH (Last 30 days):
   Data points: X
   Latest 3 days:
     - 2026-04-12: 5 new, 75 total
     - 2026-04-11: 3 new, 70 total
     ...

5. USAGE ANALYTICS:
   Kundli Generation: 100+
   Analysis: X
   Chat: X
   PDF Download: X

6. SYSTEM HEALTH:
   Status: healthy
   Storage Status: connected
   Total Users: 70+
   Total Kundlis: 100+

============================================================
✅ TEST COMPLETE
============================================================
```

## Troubleshooting

### Dashboard Shows Zeros
**Problem:** Metrics still showing 0
**Solution:** 
1. Verify `users/` directory exists and has data
2. Check `users/kundli_index.json` exists
3. Run test script: `python backend/test_admin_analytics.py`
4. Check backend logs for errors

### Missing Data
**Problem:** Some users or kundlis not showing
**Solution:**
1. Verify `kundli_index.json` is valid JSON
2. Check user directories have `user_info.json`
3. Verify analysis files are in `analysis/` subdirectory

### API Errors
**Problem:** 401 Unauthorized
**Solution:**
1. Verify admin token is valid
2. Check authentication headers
3. Verify admin credentials in environment

## Configuration

### Change Data Source Path
Edit `backend/admin_analytics_service.py`:
```python
# To use a different path:
analytics = AdminAnalyticsService('/custom/path/users')
```

### Environment Variables
Set in `.env`:
```
ADMIN_API_URL=http://localhost:8000
VITE_ADMIN_API_URL=http://localhost:8000
```

## Performance Notes

- Analytics are computed on-demand from filesystem
- Global index is read into memory for counting
- User directories are scanned for analysis files
- Suitable for 100+ users and 1000+ kundlis

## Next Steps

1. ✅ Verify admin panel shows real data
2. ✅ Test all dashboard metrics
3. ✅ Verify user management features
4. ✅ Check kundli listing and filtering
5. ✅ Review analytics and growth charts

## Support

For issues or questions:
1. Check logs: `backend/main.py` output
2. Run test script: `python backend/test_admin_analytics.py`
3. Review: `ADMIN_DASHBOARD_FIX.md`
4. Review: `ADMIN_CHANGES_SUMMARY.md`
