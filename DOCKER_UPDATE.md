# Docker Update Summary

## Changes Made

### 1. **Dockerfile** (Updated)
The Dockerfile has been completely restructured to match the `start_all.ps1` startup process:

**Key Changes:**
- **Added Node.js**: Installed Node.js 18 alongside Python 3.11 in the same image
- **Multi-stage build**: Builds frontend first, then includes it in the final Python image
- **Complete frontend setup**: Copies all frontend source files and configuration (vite.config.ts, tsconfig.json, tailwind.config.js, postcss.config.js)
- **Frontend dependencies**: Installs npm dependencies in the container
- **Entrypoint script**: Uses a new `entrypoint.sh` script to start both services
- **Environment variables**: Sets `VITE_API_BASE_URL` for frontend API communication

**Dependencies installed:**
- Python: FastAPI, Uvicorn, Firebase Admin SDK, Gemini API, PySwissEph, etc.
- Node.js: React, Vite, Tailwind CSS, Firebase SDK, and all frontend dependencies

### 2. **entrypoint.sh** (New)
Created a bash entrypoint script that:
- Starts the backend (Python FastAPI) on port 8000
- Waits 5 seconds for backend to initialize
- Starts the frontend (Vite dev server) on port 3000
- Allows connections from localhost, 127.0.0.1, and kendraa.ai
- Handles graceful shutdown of both services
- Displays startup information similar to `start_all.ps1`

### 3. **docker-compose.yml** (Updated)
Simplified to use a single unified service:

**Changes:**
- Merged `backend` and `frontend` services into one `astroai` service
- Single container runs both backend and frontend
- Exposes both ports 8000 and 3000
- Sets all necessary environment variables
- Includes `stdin_open: true` and `tty: true` for interactive terminal access
- Maintains volume mounts for Firebase credentials and user data

## How to Build and Run

### Build the Docker image:
```bash
docker-compose build
```

### Run the container:
```bash
docker-compose up
```

### Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Domain**: http://kendraa.ai (if configured in your hosts file)

## What Happens on Startup

1. Docker container starts with both Python and Node.js environments
2. Backend (FastAPI) initializes on port 8000
3. Frontend (Vite dev server) initializes on port 3000
4. Both services run in the same container with proper process management
5. Logs from both services are visible in the container output

## Environment Variables Required

Make sure your `.env` file or docker-compose environment includes:
- `FIREBASE_CREDENTIALS_PATH`: Path to Firebase credentials JSON
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `GEMINI_API_KEY`: Your Gemini API key
- `ENVIRONMENT`: Set to 'production'
- `DEBUG`: Set to 'False'

## Notes

- The Dockerfile uses a multi-stage build to optimize image size
- Frontend is built during the Docker build process for production readiness
- The dev server still runs in the container for development purposes
- Both services are managed by the entrypoint script with proper signal handling
- The setup mirrors the exact behavior of `start_all.ps1` but in a containerized environment
