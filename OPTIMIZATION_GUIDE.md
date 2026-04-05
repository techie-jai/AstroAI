# AstroAI Optimization Guide

Performance and efficiency optimization strategies for the multi-user web application.

## Backend Optimization

### 1. Database Query Optimization

#### Index Creation

```python
# firebase_config.py - Add indexes for common queries
def create_indexes(self):
    """Create Firestore indexes for optimal query performance"""
    
    # Index for user calculations
    # Collection: calculations
    # Fields: user_id (Ascending), created_at (Descending)
    
    # Index for analysis results
    # Collection: analyses
    # Fields: user_id (Ascending), created_at (Descending)
    
    # Index for calculation history
    # Collection: calculations
    # Fields: user_id (Ascending), calculation_type (Ascending), created_at (Descending)
```

#### Query Optimization

```python
# Before: Inefficient query
def get_user_calculations_bad(user_id: str):
    docs = db.collection('calculations').where('user_id', '==', user_id).stream()
    return [doc.to_dict() for doc in docs]  # Loads all fields

# After: Optimized query
def get_user_calculations_good(user_id: str, limit: int = 10):
    docs = db.collection('calculations')\
        .where('user_id', '==', user_id)\
        .order_by('created_at', direction=firestore.Query.DESCENDING)\
        .limit(limit)\
        .select(['id', 'name', 'created_at', 'calculation_type'])\
        .stream()
    return [doc.to_dict() for doc in docs]
```

#### Pagination

```python
# Implement cursor-based pagination
def get_calculations_paginated(user_id: str, page_size: int = 20, cursor: str = None):
    query = db.collection('calculations')\
        .where('user_id', '==', user_id)\
        .order_by('created_at', direction=firestore.Query.DESCENDING)
    
    if cursor:
        # Get the document at cursor position
        cursor_doc = db.collection('calculations').document(cursor).get()
        query = query.start_after(cursor_doc)
    
    docs = query.limit(page_size + 1).stream()
    results = [doc.to_dict() for doc in docs]
    
    next_cursor = None
    if len(results) > page_size:
        next_cursor = results[page_size]['id']
        results = results[:page_size]
    
    return results, next_cursor
```

### 2. Caching Strategy

#### Redis Caching

```python
# backend/cache.py
import redis
from functools import wraps
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(ttl: int = 3600):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Check cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Execute function
            result = func(*args, **kwargs)
            
            # Cache result
            redis_client.setex(cache_key, ttl, json.dumps(result))
            
            return result
        return wrapper
    return decorator

# Usage
@cache_result(ttl=3600)
def get_available_charts():
    """Get list of available charts (cached for 1 hour)"""
    return ["D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60"]
```

#### Application-Level Caching

```python
# backend/main.py
from functools import lru_cache

@lru_cache(maxsize=128)
def get_chart_details(chart_type: str):
    """Cache chart details in memory"""
    return {
        "D1": {"name": "Rasi Chart", "description": "Main birth chart"},
        "D9": {"name": "Navamsa Chart", "description": "Marriage and partnerships"},
        # ... more charts
    }
```

### 3. API Response Optimization

#### Compression

```python
# backend/main.py
from fastapi.middleware.gzip import GZIPMiddleware

app.add_middleware(GZIPMiddleware, minimum_size=1000)
```

#### Pagination in Responses

```python
# Before: Return all results
@app.get("/api/calculations/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    calculations = firebase_service.get_user_calculations(current_user['uid'])
    return {"calculations": calculations}

# After: Paginated response
@app.get("/api/calculations/history")
async def get_history(
    limit: int = 20,
    cursor: str = None,
    current_user: dict = Depends(get_current_user)
):
    calculations, next_cursor = firebase_service.get_calculations_paginated(
        current_user['uid'],
        limit,
        cursor
    )
    return {
        "calculations": calculations,
        "next_cursor": next_cursor,
        "has_more": next_cursor is not None
    }
```

#### Field Selection

```python
# Before: Return all fields
def get_user_profile(user_id: str):
    return db.collection('users').document(user_id).get().to_dict()

# After: Return only needed fields
def get_user_profile(user_id: str):
    return db.collection('users').document(user_id).get(['email', 'display_name', 'subscription_tier']).to_dict()
```

### 4. Async Operations

```python
# backend/main.py
import asyncio

# Use async for I/O operations
@app.post("/api/kundli/generate")
async def generate_kundli(
    request: GenerateKundliRequest,
    current_user: dict = Depends(get_current_user)
):
    # Run CPU-intensive task in thread pool
    loop = asyncio.get_event_loop()
    kundli = await loop.run_in_executor(
        None,
        astrology_service.generate_kundli,
        request.birth_data
    )
    
    # Save to database asynchronously
    await firebase_service.save_calculation_async(
        user_id=current_user['uid'],
        calculation_type='kundli',
        birth_data=request.birth_data,
        result=kundli
    )
    
    return {"kundli_id": kundli_id, "kundli": kundli}
```

### 5. Connection Pooling

```python
# backend/firebase_config.py
from google.cloud import firestore

# Use connection pooling
db = firestore.Client()
# Firestore automatically handles connection pooling
```

---

## Frontend Optimization

### 1. Code Splitting

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const GeneratorPage = lazy(() => import('./pages/GeneratorPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/generate" element={<GeneratorPage />} />
          <Route path="/results/:kundliId" element={<ResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
```

### 2. Image Optimization

```typescript
// Use optimized images
import { lazy } from 'react'

// Lazy load images
const HeroImage = lazy(() => import('./images/hero.webp'))

// Use WebP format with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>
```

### 3. Bundle Size Analysis

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ]
}

# Build and analyze
npm run build
```

### 4. Memoization

```typescript
// src/components/CalculationCard.tsx
import { memo } from 'react'

interface Props {
  calculation: Calculation
  onSelect: (id: string) => void
}

const CalculationCard = memo(({ calculation, onSelect }: Props) => {
  return (
    <div onClick={() => onSelect(calculation.id)}>
      <h3>{calculation.name}</h3>
      <p>{calculation.created_at}</p>
    </div>
  )
}, (prevProps, nextProps) => {
  return prevProps.calculation.id === nextProps.calculation.id
})

export default CalculationCard
```

### 5. Virtual Scrolling

```typescript
// For long lists, use virtual scrolling
import { FixedSizeList as List } from 'react-window'

function HistoryList({ items }: { items: Calculation[] }) {
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </List>
  )
}
```

### 6. Service Worker Caching

```typescript
// src/serviceWorker.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(registration => {
    console.log('Service Worker registered')
  })
}
```

Create `public/sw.js`:

```javascript
const CACHE_NAME = 'astroai-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/main.js'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})
```

---

## Docker Optimization

### 1. Multi-Stage Build

```dockerfile
# Already implemented in Dockerfile
# Frontend build stage
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Backend stage
FROM python:3.11-slim
# ... rest of Dockerfile
```

### 2. Layer Caching

```dockerfile
# Order matters - put frequently changing files last
FROM python:3.11-slim

# Install system dependencies (rarely changes)
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements (changes less frequently)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (changes frequently)
COPY backend/ ./backend/
COPY jyotishganit_chart_api.py .
COPY test_jyotishganit*.py .
```

### 3. Image Size Reduction

```dockerfile
# Use slim images
FROM python:3.11-slim  # ~150MB instead of ~900MB

# Remove unnecessary files
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Use .dockerignore to exclude unnecessary files
```

### 4. Resource Limits

```yaml
# docker-compose.yml
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
  
  frontend:
    image: node:18-alpine
    ports:
      - "3000:3000"
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
```

---

## Database Optimization

### 1. Firestore Optimization

```python
# Batch writes for better performance
def batch_save_calculations(user_id: str, calculations: list):
    batch = db.batch()
    
    for calc in calculations:
        doc_ref = db.collection('calculations').document()
        batch.set(doc_ref, {
            'user_id': user_id,
            'data': calc,
            'created_at': firestore.SERVER_TIMESTAMP
        })
    
    batch.commit()
```

### 2. Data Retention Policy

```python
# Delete old calculations after 1 year
def cleanup_old_calculations():
    one_year_ago = datetime.now() - timedelta(days=365)
    
    old_docs = db.collection('calculations')\
        .where('created_at', '<', one_year_ago)\
        .stream()
    
    for doc in old_docs:
        doc.reference.delete()
```

---

## Monitoring & Profiling

### 1. Backend Profiling

```python
# backend/main.py
from pyinstrument import Profiler

@app.middleware("http")
async def profile_request(request, call_next):
    profiler = Profiler()
    profiler.start()
    
    response = await call_next(request)
    
    profiler.stop()
    print(profiler.output_text(unicode=True, color=True))
    
    return response
```

### 2. Frontend Performance Monitoring

```typescript
// src/utils/performance.ts
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      const start = performance.now()
      const result = await originalMethod.apply(this, args)
      const end = performance.now()
      
      console.log(`${name} took ${end - start}ms`)
      return result
    }
    
    return descriptor
  }
}

// Usage
class APIService {
  @measurePerformance('Generate Kundli')
  async generateKundli(birthData: BirthData) {
    // ... implementation
  }
}
```

### 3. Logging & Monitoring

```python
# backend/logging_config.py
import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Log important events
logger.info("Kundli generated", extra={
    "user_id": user_id,
    "duration_ms": duration,
    "chart_count": len(charts)
})
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | < 500ms | TBD |
| Frontend Load Time | < 2s | TBD |
| Database Query Time | < 100ms | TBD |
| Bundle Size | < 200KB | TBD |
| Lighthouse Score | > 90 | TBD |
| Time to Interactive | < 3s | TBD |

---

## Optimization Checklist

- [ ] Database indexes created
- [ ] Query optimization implemented
- [ ] Caching strategy deployed
- [ ] API responses paginated
- [ ] Frontend code splitting enabled
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Service Worker implemented
- [ ] Docker image optimized
- [ ] Resource limits set
- [ ] Monitoring configured
- [ ] Performance targets met

---

**Last Updated**: April 2026  
**Status**: Complete Optimization Guide
