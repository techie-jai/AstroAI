# AstroAI Backend API

FastAPI backend for AstroAI multi-user platform with Firebase authentication, Firestore database, and Gemini AI integration.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Gemini API Key

**Option A: Environment Variable (Recommended)**
```powershell
# Windows PowerShell
$env:GEMINI_API_KEY = "YOUR_NEW_API_KEY_HERE"
```

**Option B: .env File**
Create `backend/.env`:
```
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

The backend automatically loads from environment variables or `.env` file using `load_dotenv()`.

### 3. Configure Firebase

1. Create a Firebase project at https://firebase.google.com
2. Download service account JSON from Project Settings → Service Accounts
3. Place the JSON file in the project root as `firebase-credentials.json`

### 4. Run the Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

## API Endpoints

### Authentication (5 endpoints)

- `POST /api/auth/verify-token` - Verify Firebase ID token
- `POST /api/auth/create-profile` - Create user profile after authentication
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/load-session` - Load user session data on login

### Kundli & Charts (4 endpoints)

- `POST /api/kundli/generate` - Generate kundli with divisional charts
- `POST /api/charts/generate` - Generate divisional charts
- `GET /api/kundli/{kundli_id}` - Get stored kundli data
- `GET /api/kundlis/list` - List all user kundlis

### Calculations & Analysis (6 endpoints)

- `GET /api/calculations/history` - Get user's calculation history
- `GET /api/user/calculations` - Get user's calculations with metadata
- `GET /api/planet/{chart_type}/{planet_name}` - Get planet position
- `GET /api/house/{chart_type}/{house_number}` - Get planets in house
- `POST /api/analysis/generate` - Generate AI analysis with insights
- `GET /api/analysis/download/{kundli_id}` - Download PDF report

### Insights (2 endpoints)

- `GET /api/dashboard/insights/{kundli_id}` - Get dashboard insights
- `GET /api/insights/{kundli_id}` - Get full insights for kundli

### Health Check

- `GET /health` - API health check

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
- result_summary
- dashboard_insights (optional)

**kundlis/** (Firebase storage of complete kundli data)
- kundli_id (document ID)
- user_id
- birth_data
- horoscope_info (1000+ data points)
- charts
- generated_at

**user_insights/**
- kundli_id (document ID)
- user_id
- health_insights
- career_insights
- relationship_insights
- money_insights
- all_insights
- total_insights
- created_at

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| GEMINI_API_KEY | Google Gemini API key | Yes |
| FIREBASE_CREDENTIALS_PATH | Path to Firebase service account JSON | Yes |
| FIREBASE_STORAGE_BUCKET | Firebase Storage bucket name | Yes |
| ENVIRONMENT | development or production | No |
| DEBUG | Enable debug mode | No |

## New Modules (April 5, 2026)

### insights_extractor.py
Extracts and categorizes insights from Gemini analysis:
- `extract_insights()` - Parse KEY INSIGHTS section
- `format_insights_for_firebase()` - Format for storage
- `get_summary_insights()` - Create dashboard summary

### analysis_formatter.py
Formats analysis text for display and storage

### pdf_generator.py
Generates professional PDF reports with:
- Birth information table
- Planetary positions summary
- Detailed analysis text
- Professional styling and formatting

## Testing

```bash
# Health check
curl http://localhost:8000/health

# Verify token
curl -X POST http://localhost:8000/api/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_FIREBASE_TOKEN"}'
```

## Docker Deployment

### Build Image
```bash
docker-compose build
```

### Run Services
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f astroai
```

### Stop Services
```bash
docker-compose down
```

### Environment Variables for Docker
Create `.env` file in project root:
```
GEMINI_API_KEY=YOUR_API_KEY
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## File Structure

```
backend/
├── main.py                    # FastAPI application
├── models.py                  # Pydantic request/response models
├── firebase_config.py         # Firebase configuration
├── firebase_service.py        # Firebase operations
├── astrology_service.py       # Astrology calculations
├── gemini_service.py          # Gemini AI integration
├── auth.py                    # Authentication middleware
├── file_manager.py            # File operations
├── pdf_generator.py           # PDF generation (NEW)
├── insights_extractor.py      # Insights extraction (NEW)
├── analysis_formatter.py      # Analysis formatting (NEW)
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## Key Features

**Multi-user support** with Firebase authentication
**Complete kundli generation** with 1000+ data points
**20 divisional charts** (D1-D60)
**AI-powered analysis** using Gemini API
**Automatic insights extraction** from analysis
**Professional PDF export** with reportlab
**Dashboard insights** with 4 categories
**Secure API key handling** via environment variables
**Docker containerization** for easy deployment
**CORS support** for frontend integration

## Security Notes

- **API keys loaded from environment variables only**
- **`.env` files excluded from git (see `.gitignore`)**
- **Firebase credentials not committed to repository**
- **Token verification on all protected endpoints**
- **CORS configured for allowed domains**

## Troubleshooting

### Gemini API Key Error
```
403 Your API key was reported as leaked
```
**Solution**: Create a new API key at Google Cloud Console and update `GEMINI_API_KEY`

### Firebase Connection Error
```
Failed to initialize Firebase
```
**Solution**: Verify `firebase-credentials.json` path and `FIREBASE_STORAGE_BUCKET` in `.env`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Update CORS origins in `main.py` lines 35-52 to include your frontend domain

## Support

For issues or questions:
- Check logs: `docker-compose logs astroai`
- Verify environment variables: `echo $GEMINI_API_KEY`
- Test endpoints: Use curl or Postman
- GitHub: https://github.com/techie-jai/AstroAI
