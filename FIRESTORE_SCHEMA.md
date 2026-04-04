# Firestore Database Schema

This document describes the Firestore database structure for AstroAI.

## Collections

### 1. `users`
Stores user profile information.

**Document ID**: Firebase UID

**Fields**:
- `email` (string): User's email address
- `display_name` (string): User's display name
- `created_at` (timestamp): Account creation timestamp
- `last_login` (timestamp): Last login timestamp
- `subscription_tier` (string): Subscription level (default: "free")
- `total_calculations` (number): Total kundli calculations performed

**Example**:
```json
{
  "email": "user@example.com",
  "display_name": "John Doe",
  "created_at": "2024-04-04T10:00:00Z",
  "last_login": "2024-04-04T15:30:00Z",
  "subscription_tier": "free",
  "total_calculations": 3
}
```

---

### 2. `calculations`
Stores metadata about kundli calculations.

**Document ID**: Auto-generated

**Fields**:
- `user_id` (string): Reference to user UID
- `birth_data` (object): Birth information
  - `name` (string): Person's name
  - `year` (number): Birth year
  - `month` (number): Birth month
  - `day` (number): Birth day
  - `hour` (number): Birth hour
  - `minute` (number): Birth minute
  - `place_name` (string): Birth place
  - `latitude` (number): Birth latitude
  - `longitude` (number): Birth longitude
  - `timezone_offset` (number): Timezone offset
- `chart_types` (array): List of generated chart types (e.g., ["D1", "D7", "D9", "D10"])
- `created_at` (timestamp): Calculation creation timestamp
- `status` (string): Status ("completed", "failed", "pending")
- `result_summary` (object): Summary of results
  - `kundli_id` (string): Unique kundli identifier
  - `user_folder` (string): Local file system path to user folder
  - `unique_id` (string): Unique calculation ID
  - `generated_at` (string): Generation timestamp
- `dashboard_insights` (object, optional): Cached dashboard insights
  - `kundli_id` (string): Associated kundli ID
  - `generated_at` (timestamp): Insights generation timestamp
  - `important_aspects` (string): Key planetary positions and significance
  - `good_times` (string): Favorable periods ahead
  - `challenges` (string): Potential challenges and cautions
  - `interesting_facts` (string): Interesting astrological facts

**Example**:
```json
{
  "user_id": "uid123",
  "birth_data": {
    "name": "John Doe",
    "year": 1995,
    "month": 12,
    "day": 28,
    "hour": 18,
    "minute": 50,
    "place_name": "Allahabad",
    "latitude": 25.4683,
    "longitude": 81.8546,
    "timezone_offset": 5.5
  },
  "chart_types": ["D1", "D7", "D9", "D10"],
  "created_at": "2024-04-04T10:00:00Z",
  "status": "completed",
  "result_summary": {
    "kundli_id": "kundli_abc123",
    "user_folder": "/path/to/users/2024-04-04-johndoe",
    "unique_id": "unique_123",
    "generated_at": "2024-04-04T10:05:00Z"
  },
  "dashboard_insights": {
    "kundli_id": "kundli_abc123",
    "generated_at": "2024-04-04T10:10:00Z",
    "important_aspects": "Your Sun is in Sagittarius...",
    "good_times": "Jupiter transits will bring...",
    "challenges": "Saturn aspects suggest...",
    "interesting_facts": "Your chart shows..."
  }
}
```

---

### 3. `kundlis`
Stores complete kundli data for LLM access.

**Document ID**: Auto-generated

**Fields**:
- `user_id` (string): Reference to user UID
- `kundli_id` (string): Unique kundli identifier
- `birth_data` (object): Birth information (same structure as calculations)
- `horoscope_info` (object): Complete astrological data (1000+ fields)
  - Contains all planetary positions, houses, aspects, etc.
- `chart_types` (array): List of chart types generated
- `charts` (object): Divisional chart data
  - Keys are chart types (D1, D7, D9, D10, etc.)
  - Values contain chart-specific planetary positions
- `generated_at` (string): Generation timestamp
- `created_at` (timestamp): Document creation timestamp
- `user_folder` (string): Local file system path
- `unique_id` (string): Unique calculation ID

**Example**:
```json
{
  "user_id": "uid123",
  "kundli_id": "kundli_abc123",
  "birth_data": { /* same as calculations */ },
  "horoscope_info": {
    "sun_sign": "Sagittarius",
    "moon_sign": "Libra",
    "ascendant": "Gemini",
    /* ... 1000+ more fields ... */
  },
  "chart_types": ["D1", "D7", "D9", "D10"],
  "charts": {
    "D1": { /* D1 chart data */ },
    "D7": { /* D7 chart data */ },
    "D9": { /* D9 chart data */ },
    "D10": { /* D10 chart data */ }
  },
  "generated_at": "2024-04-04T10:05:00Z",
  "created_at": "2024-04-04T10:05:00Z",
  "user_folder": "/path/to/users/2024-04-04-johndoe",
  "unique_id": "unique_123"
}
```

---

### 4. `chat_history` (Optional)
Stores chat conversation history.

**Document ID**: Auto-generated

**Fields**:
- `user_id` (string): Reference to user UID
- `kundli_id` (string): Associated kundli ID
- `role` (string): Message role ("user" or "assistant")
- `content` (string): Message content
- `timestamp` (timestamp): Message timestamp

**Example**:
```json
{
  "user_id": "uid123",
  "kundli_id": "kundli_abc123",
  "role": "user",
  "content": "What does my chart say about my career?",
  "timestamp": "2024-04-04T10:15:00Z"
}
```

---

### 5. `analyses` (Optional)
Stores AI analysis results.

**Document ID**: Auto-generated

**Fields**:
- `user_id` (string): Reference to user UID
- `kundli_id` (string): Associated kundli ID
- `analysis_text` (string): Generated analysis text
- `analysis_type` (string): Type of analysis ("comprehensive", etc.)
- `created_at` (timestamp): Analysis creation timestamp
- `pdf_path` (string, optional): Path to generated PDF file

**Example**:
```json
{
  "user_id": "uid123",
  "kundli_id": "kundli_abc123",
  "analysis_text": "Based on your birth chart...",
  "analysis_type": "comprehensive",
  "created_at": "2024-04-04T10:20:00Z",
  "pdf_path": "/path/to/users/2024-04-04-johndoe/analysis/John_Doe_AI_Analysis.pdf"
}
```

---

## Indexes

### Recommended Indexes

1. **calculations collection**:
   - `user_id` (Ascending)
   - `created_at` (Descending)
   - Composite: `user_id` + `created_at`

2. **kundlis collection**:
   - `user_id` (Ascending)
   - `created_at` (Descending)

3. **chat_history collection**:
   - `user_id` (Ascending)
   - `kundli_id` (Ascending)
   - `timestamp` (Ascending)
   - Composite: `user_id` + `kundli_id` + `timestamp`

---

## Data Flow

### Kundli Generation Flow
1. User submits birth data via `/api/kundli/generate`
2. Backend generates kundli using PyJHora
3. Data saved locally to user folder
4. Metadata stored in `calculations` collection
5. Complete kundli data stored in `kundlis` collection
6. Dashboard insights generated and cached in `calculations.dashboard_insights`

### Chat Flow
1. User sends message via `/api/chat/message`
2. Backend retrieves kundli from `kundlis` collection
3. Gemini API generates response with kundli context
4. Response returned to frontend
5. (Optional) Chat history stored in `chat_history` collection

### Analysis Flow
1. User requests analysis via `/api/analysis/generate`
2. Backend retrieves kundli from local files
3. Gemini API generates analysis
4. PDF generated and saved locally
5. Analysis metadata stored in `analyses` collection

---

## Security Notes

- All user data is protected by Firebase Authentication
- Firestore rules should restrict access to user's own data
- Sensitive data (kundli details) only accessible to authenticated users
- Local file storage for generated files (not in Firestore)

---

## Backup Strategy

- Regular backups of Firestore collections
- Local file backups for user folders
- Consider implementing automated daily exports
