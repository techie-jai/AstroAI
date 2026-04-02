# AstroAI Multi-User Deployment Guide

Complete guide for deploying AstroAI as a multi-user web application with Firebase, Docker, and Cloudflare Tunnel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Docker Deployment](#docker-deployment)
6. [Cloudflare Tunnel Setup](#cloudflare-tunnel-setup)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- Cloudflare account (free tier works)
- Firebase account (free tier works)
- Git

### System Requirements

- 4GB RAM minimum
- 2GB disk space for dependencies
- Internet connection for Firebase and Cloudflare

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: `astroai`
4. Accept terms and create project
5. Wait for project to initialize

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Google** provider:
   - Click Google
   - Enable the toggle
   - Set project support email
   - Save
4. Enable **Email/Password** provider:
   - Click Email/Password
   - Enable both toggles
   - Save

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode**
4. Choose region closest to you
5. Create database

### 4. Set Firestore Security Rules

Replace default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /calculations/{document=**} {
      allow read, write: if request.auth.uid == resource.data.user_id;
      allow create: if request.auth.uid == request.resource.data.user_id;
    }
    match /analyses/{document=**} {
      allow read, write: if request.auth.uid == resource.data.user_id;
      allow create: if request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

### 5. Create Service Account

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file as `firebase-credentials.json`
4. **Keep this file secure!**

### 6. Get Firebase Config

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps"
3. Click the web app (or create one)
4. Copy the config object
5. Save for frontend configuration

---

## Backend Configuration

### 1. Create Backend Environment File

```bash
cd backend
cp .env.example .env
```

### 2. Edit `.env` File

```bash
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
GEMINI_API_KEY=your-gemini-api-key  # Optional
ENVIRONMENT=development
DEBUG=True
```

### 3. Install Dependencies (Local Development)

```bash
pip install -r requirements.txt
```

### 4. Run Backend Locally

```bash
python main.py
```

Backend will start at `http://localhost:8000`

---

## Frontend Configuration

### 1. Create Frontend Environment File

```bash
cd frontend
cp .env.example .env.local
```

### 2. Edit `.env.local` File

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Install Dependencies (Local Development)

```bash
npm install
```

### 4. Run Frontend Locally

```bash
npm run dev
```

Frontend will start at `http://localhost:3000`

---

## Docker Deployment

### 1. Prepare Docker Environment

```bash
# Copy firebase credentials to project root
cp /path/to/firebase-credentials.json ./firebase-credentials.json

# Create .env file for docker-compose
cat > .env << EOF
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
GEMINI_API_KEY=your-gemini-api-key
EOF
```

### 2. Build and Run with Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Verify Services

- Backend: `http://localhost:8000/health`
- Frontend: `http://localhost:3000`

### 4. Docker Compose Services

| Service | Port | Purpose |
|---------|------|---------|
| backend | 8000 | FastAPI server |
| frontend | 3000 | React web UI |

---

## Cloudflare Tunnel Setup

### 1. Install Cloudflare CLI

**Windows (PowerShell):**
```powershell
# Download from https://github.com/cloudflare/cloudflared/releases
# Or use Chocolatey:
choco install cloudflare-warp
```

**Linux/macOS:**
```bash
curl -L --output cloudflared.tgz https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.tgz
tar -xzf cloudflared.tgz
sudo mv cloudflared /usr/local/bin/
```

### 2. Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This opens a browser to authenticate and save credentials.

### 3. Create Tunnel

```bash
cloudflared tunnel create astroai
```

Note the Tunnel ID displayed.

### 4. Create Tunnel Configuration

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: astroai
credentials-file: /path/to/.cloudflared/astroai.json

ingress:
  - hostname: astroai.yourdomain.com
    service: http://localhost:3000
  - hostname: api.astroai.yourdomain.com
    service: http://localhost:8000
  - service: http_status:404
```

### 5. Route Traffic to Tunnel

```bash
# Add DNS records (replace with your domain)
cloudflared tunnel route dns astroai astroai.yourdomain.com
cloudflared tunnel route dns astroai api.astroai.yourdomain.com
```

### 6. Run Tunnel

```bash
cloudflared tunnel run astroai
```

Or run as service:

```bash
# Windows
cloudflared service install

# Linux/macOS
sudo cloudflared service install
sudo systemctl start cloudflared
```

### 7. Verify Access

- Frontend: `https://astroai.yourdomain.com`
- Backend: `https://api.astroai.yourdomain.com/health`

---

## Testing

### 1. Health Check

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AstroAI API",
  "version": "1.0.0"
}
```

### 2. Available Charts Endpoint

```bash
curl http://localhost:8000/api/charts/available
```

### 3. Frontend Login

1. Navigate to `http://localhost:3000`
2. Click "Sign in with Google"
3. Complete Google authentication
4. Should redirect to dashboard

### 4. Generate Kundli (Authenticated)

1. Get Firebase ID token from browser console:
   ```javascript
   const user = firebase.auth().currentUser;
   user.getIdToken().then(token => console.log(token));
   ```

2. Make API request:
   ```bash
   curl -X POST http://localhost:8000/api/kundli/generate \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "birth_data": {
         "name": "Test User",
         "place_name": "Chennai,IN",
         "latitude": 13.0827,
         "longitude": 80.2707,
         "timezone_offset": 5.5,
         "year": 1990,
         "month": 6,
         "day": 15,
         "hour": 10,
         "minute": 30
       }
     }'
   ```

---

## Troubleshooting

### Firebase Connection Issues

**Error:** `FIREBASE_CREDENTIALS_PATH environment variable not set`

**Solution:**
```bash
export FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
```

### Docker Port Conflicts

**Error:** `Port 8000 is already allocated`

**Solution:**
```bash
# Find process using port
lsof -i :8000

# Kill process or use different port
docker-compose down
```

### Cloudflare Tunnel Not Connecting

**Error:** `Failed to establish connection`

**Solution:**
1. Verify tunnel is running: `cloudflared tunnel list`
2. Check DNS records are configured
3. Verify local services are running on correct ports
4. Check firewall settings

### Frontend Can't Connect to Backend

**Error:** `CORS error` or `API connection failed`

**Solution:**
1. Verify `VITE_API_BASE_URL` in `.env.local`
2. Check backend is running: `curl http://localhost:8000/health`
3. Verify CORS is enabled in backend
4. Check network connectivity

### Firebase Authentication Fails

**Error:** `Authentication error` or `Invalid credentials`

**Solution:**
1. Verify Firebase config in `.env.local`
2. Check Google OAuth is enabled in Firebase Console
3. Verify authorized domains in Firebase Console
4. Clear browser cache and cookies

---

## Production Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Service account credentials secured
- [ ] Environment variables set correctly
- [ ] Docker images built successfully
- [ ] All services running and healthy
- [ ] Cloudflare tunnel configured
- [ ] DNS records pointing to tunnel
- [ ] HTTPS working (Cloudflare provides)
- [ ] Authentication tested
- [ ] Kundli generation tested
- [ ] Database rules configured
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Error logging configured

---

## Next Steps

1. **Monitor**: Set up monitoring and alerting
2. **Backup**: Configure database backups
3. **Scale**: Consider cloud deployment for production
4. **Security**: Review and harden security rules
5. **Performance**: Optimize database queries and caching
6. **Analytics**: Add user analytics and tracking

---

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review error messages carefully
3. Consult Firebase documentation
4. Check Cloudflare tunnel status
5. Review backend/frontend logs

---

**Last Updated:** April 2026  
**Version:** 1.0.0
