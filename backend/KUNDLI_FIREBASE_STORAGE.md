# Kundli Firebase Storage Setup

## Overview
Complete kundli data (including 1000+ horoscope data points and all divisional charts) is now automatically stored in Firebase Firestore when a user generates a kundli. This enables the LLM to access and analyze kundli data to answer user questions.

## Database Structure

### Collection: `kundlis`
Stores complete kundli data for LLM access.

**Document Fields:**
- `user_id` (string): User's Firebase UID
- `kundli_id` (string): Unique kundli identifier
- `birth_data` (object): User's birth information
  - `name`, `day`, `month`, `year`
  - `hour`, `minute`, `second`
  - `place_name`, `latitude`, `longitude`
  - `timezone_offset`
- `horoscope_info` (object): 1000+ astrological data points
  - Planet positions, house placements, aspects, yogas, etc.
- `chart_types` (array): List of generated chart types (D1, D7, D9, D10, etc.)
- `charts` (object): All generated divisional chart data
  - Each chart type contains complete planetary positions and house data
- `generated_at` (timestamp): When kundli was generated
- `created_at` (timestamp): Firebase server timestamp
- `user_folder` (string): Local file system path for reference
- `unique_id` (string): Unique identifier for the generation session

## Workflow

### 1. Kundli Generation (`POST /api/kundli/generate`)
When a user generates a kundli:

1. **Generate Data**
   - Kundli data with horoscope_info (1000+ fields)
   - Divisional charts (D1, D7, D9, D10)

2. **Save Locally**
   - Kundli JSON/text to user folder
   - Chart JSON/text to user folder

3. **Save to Firebase** (NEW)
   - Complete kundli data → `kundlis` collection
   - Calculation metadata → `calculations` collection
   - User profile updated with calculation count

4. **Response**
   - Returns `firebase_kundli_id` for reference
   - Also returns local file paths

### 2. Retrieve Kundli Data

#### For LLM Access
```
GET /api/kundli/{kundli_id}
```
- Fetches from Firebase first (complete data)
- Falls back to local files if needed
- Returns all horoscope_info and chart data

#### List All User Kundlis
```
GET /api/kundlis/list?limit=50
```
- Returns all kundlis for current user
- Ordered by creation date (newest first)
- Includes all data for LLM analysis

## Code Changes

### firebase_config.py
Added three new methods to `FirebaseService`:

1. **`save_kundli(uid, kundli_data)`**
   - Saves complete kundli to `kundlis` collection
   - Returns Firebase document ID

2. **`get_kundli(uid, kundli_id)`**
   - Retrieves specific kundli by ID
   - Returns complete kundli data with horoscope_info

3. **`get_user_kundlis(uid, limit=50)`**
   - Retrieves all kundlis for a user
   - Ordered by creation date (descending)
   - Returns list of kundli documents

### main.py
Updated kundli generation endpoint:

1. **Generate and save charts** (lines 285-304)
   - Stores chart data in `charts_dict`

2. **Save to Firebase** (lines 306-319)
   - Calls `FirebaseService.save_kundli()`
   - Includes complete horoscope_info and charts
   - Returns `firebase_kundli_id` in response

3. **New endpoint** (lines 539-568)
   - `GET /api/kundlis/list` - List user's kundlis

4. **Updated endpoint** (lines 419-507)
   - `GET /api/kundli/{kundli_id}` - Fetch from Firebase first

## Data Flow for LLM

```
User generates kundli
    ↓
Backend calculates horoscope_info (1000+ fields)
    ↓
Saves to Firebase kundlis collection
    ↓
LLM queries /api/kundli/{kundli_id}
    ↓
Gets complete horoscope_info + charts
    ↓
LLM analyzes and answers user questions
```

## Benefits

1. **LLM Access**: Complete kundli data available for analysis
2. **Persistence**: Data survives server restarts
3. **Scalability**: Firebase handles large horoscope_info objects
4. **Backup**: Cloud storage of all kundli data
5. **History**: Users can access all past kundlis
6. **Multi-device**: Access from any device

## Firebase Indexes

For optimal query performance, ensure these indexes exist:

```
Collection: kundlis
- user_id (Ascending)
- created_at (Descending)

Collection: kundlis
- user_id (Ascending)
- kundli_id (Ascending)
```

These are automatically created by Firebase when queries are first executed.

## Testing

To verify kundli storage:

1. Generate a kundli via `/api/kundli/generate`
2. Check Firebase console → Firestore → kundlis collection
3. Verify document contains:
   - `horoscope_info` with 1000+ fields
   - `charts` with all chart data
   - `birth_data` with user information
4. Retrieve via `/api/kundli/{kundli_id}`
5. Verify all data is returned

## Limitations & Considerations

1. **Document Size**: Firestore has 1MB document size limit
   - Current kundli data (~500KB) is well within limit
   - Monitor if horoscope_info grows significantly

2. **Query Costs**: Each query counts toward Firestore billing
   - Consider caching frequently accessed kundlis

3. **Real-time Updates**: Kundli data is immutable after generation
   - No need for real-time listeners

4. **Backup**: Local files still maintained for redundancy
   - Firebase is primary, local files are backup
