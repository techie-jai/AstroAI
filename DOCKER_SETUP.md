# Docker Setup Guide

## Prerequisites

1. **Docker Desktop** installed and running
2. **Firebase credentials file** at the project root: `firebase-credentials.json`
3. **Environment variables** configured in `.env` file

## Environment Setup

### 1. Create `.env` file

Copy from `.env.example` and fill in your actual values:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
FIREBASE_CREDENTIALS_PATH=/app/firebase-credentials.json
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket.appspot.com
GEMINI_API_KEY=your-gemini-api-key-here
ENVIRONMENT=production
DEBUG=False
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Place Firebase Credentials

Ensure `firebase-credentials.json` is in the project root directory.

## Building the Docker Image

```bash
docker-compose build
```

This will:
- Build the frontend with Vite
- Install all Python dependencies
- Install all Node.js dependencies
- Create a single unified image with both services

## Running the Container

```bash
docker-compose up
```

The container will:
1. Start the backend (FastAPI) on port 8000
2. Wait 5 seconds for backend initialization
3. Start the frontend (Vite dev server) on port 3000
4. Display startup information

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Domain**: http://kendraa.ai (if configured in your hosts file)

## Stopping the Container

Press `Ctrl+C` in the terminal running `docker-compose up`

## Troubleshooting

### Issue: Port already in use

If ports 3000 or 8000 are already in use:

```bash
# Find and kill the process using the port
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### Issue: Firebase credentials not found

Ensure `firebase-credentials.json` exists in the project root and the path in `.env` is correct.

### Issue: Gemini API key not set

The application will warn but continue running. Analysis features will fail if the API key is not set.

### Issue: Frontend not loading

Check that:
1. Backend is running on port 8000
2. `VITE_API_BASE_URL` is correctly set in `.env`
3. Frontend dev server is running on port 3000

## Development vs Production

### Development (Current Setup)

- Frontend runs with Vite dev server (hot reload enabled)
- Backend runs with Python directly
- Both services in one container
- Logs visible in console

### Production (Future)

To build for production:

```bash
docker build -t astroai:latest .
docker run -p 8000:8000 -p 3000:3000 --env-file .env astroai:latest
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FIREBASE_CREDENTIALS_PATH` | Yes | - | Path to Firebase service account JSON |
| `FIREBASE_STORAGE_BUCKET` | No | - | Firebase storage bucket name |
| `GEMINI_API_KEY` | No | - | Google Gemini API key for analysis |
| `ENVIRONMENT` | No | production | Environment mode |
| `DEBUG` | No | False | Debug mode |
| `VITE_API_BASE_URL` | No | http://localhost:8000/api | Frontend API base URL |

## Notes

- The Dockerfile uses a multi-stage build to optimize image size
- Frontend is pre-built during Docker build but dev server runs for development
- Both services are managed by the entrypoint script with proper signal handling
- The setup mirrors the exact behavior of `start_all.ps1` but in a containerized environment
