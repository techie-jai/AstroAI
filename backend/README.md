# AstroAI Backend API

FastAPI backend for AstroAI multi-user platform with Firebase authentication and Firestore database.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Download service account JSON from Project Settings → Service Accounts
3. Create `.env` file:

```bash
cp .env.example .env
```

4. Update `.env` with your Firebase credentials:

```
FIREBASE_CREDENTIALS_PATH=/path/to/service-account.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
GEMINI_API_KEY=your-api-key
```

### 3. Run the Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/auth/verify-token` - Verify Firebase token
- `POST /api/auth/create-profile` - Create user profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Kundli & Charts

- `POST /api/kundli/generate` - Generate kundli
- `POST /api/charts/generate` - Generate divisional charts
- `GET /api/kundli/{kundli_id}` - Get stored kundli
- `GET /api/charts/available` - List available charts

### Calculations

- `GET /api/calculations/history` - Get user's calculation history
- `GET /api/planet/{chart_type}/{planet_name}` - Get planet position
- `GET /api/house/{chart_type}/{house_number}` - Get planets in house

### Analysis

- `POST /api/analysis/generate` - Generate AI analysis

## Database Schema (Firestore)

### Collections

**users/**
- uid (document ID)
- email
- display_name
- created_at
- last_login
- subscription_tier
- total_calculations

**calculations/**
- user_id
- birth_data
- chart_types
- created_at
- status
- result_summary

**analyses/**
- user_id
- kundli_id
- analysis_text
- analysis_type
- created_at
- pdf_path

## Environment Variables

| Variable | Description |
|----------|-------------|
| FIREBASE_CREDENTIALS_PATH | Path to Firebase service account JSON |
| FIREBASE_STORAGE_BUCKET | Firebase Storage bucket name |
| GEMINI_API_KEY | Google Gemini API key |
| ENVIRONMENT | development or production |
| DEBUG | Enable debug mode |

## Testing

```bash
# Health check
curl http://localhost:8000/health

# List available charts
curl http://localhost:8000/api/charts/available
```

## Docker

```bash
docker build -t astroai-backend .
docker run -p 8000:8000 --env-file .env astroai-backend
```
