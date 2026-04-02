# AstroAI Testing Guide

Comprehensive testing framework for validating the multi-user web application.

## Testing Levels

### 1. Unit Tests
Test individual functions and components in isolation.

### 2. Integration Tests
Test how components work together (API + Database).

### 3. End-to-End (E2E) Tests
Test complete user workflows from login to results.

### 4. Performance Tests
Test response times, throughput, and resource usage.

### 5. Security Tests
Test authentication, authorization, and data protection.

---

## Backend Testing

### Setup

```bash
cd backend
pip install pytest pytest-asyncio pytest-cov httpx
```

### Unit Tests

Create `backend/test_models.py`:

```python
import pytest
from models import BirthData, GenerateKundliRequest

def test_birth_data_validation():
    """Test BirthData model validation"""
    data = BirthData(
        name="Test User",
        place_name="Chennai,IN",
        latitude=13.0827,
        longitude=80.2707,
        timezone_offset=5.5,
        year=1990,
        month=6,
        day=15,
        hour=10,
        minute=30
    )
    assert data.name == "Test User"
    assert data.latitude == 13.0827

def test_birth_data_invalid():
    """Test invalid birth data"""
    with pytest.raises(ValueError):
        BirthData(
            name="",  # Empty name
            place_name="Chennai,IN",
            latitude=13.0827,
            longitude=80.2707,
            timezone_offset=5.5,
            year=1990,
            month=13,  # Invalid month
            day=15,
            hour=10,
            minute=30
        )
```

Create `backend/test_astrology_service.py`:

```python
import pytest
from astrology_service import AstrologyService

@pytest.fixture
def astrology_service():
    return AstrologyService()

def test_generate_kundli(astrology_service):
    """Test kundli generation"""
    birth_data = {
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
    
    kundli = astrology_service.generate_kundli(birth_data)
    
    assert kundli is not None
    assert "planets" in kundli
    assert len(kundli["planets"]) > 0

def test_generate_charts(astrology_service):
    """Test chart generation"""
    birth_data = {
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
    
    charts = astrology_service.generate_charts(birth_data, ["D1", "D9"])
    
    assert charts is not None
    assert "D1" in charts
    assert "D9" in charts
```

### API Tests

Create `backend/test_api.py`:

```python
import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_available_charts(client):
    """Test available charts endpoint"""
    response = client.get("/api/charts/available")
    assert response.status_code == 200
    data = response.json()
    assert "charts" in data
    assert len(data["charts"]) > 0

@pytest.mark.asyncio
async def test_kundli_generation_requires_auth(client):
    """Test that kundli generation requires authentication"""
    response = client.post("/api/kundli/generate", json={
        "birth_data": {
            "name": "Test",
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
    })
    assert response.status_code == 403  # Forbidden without auth
```

### Run Tests

```bash
# Run all tests
pytest backend/

# Run with coverage
pytest backend/ --cov=backend --cov-report=html

# Run specific test file
pytest backend/test_api.py

# Run specific test
pytest backend/test_api.py::test_health_check

# Run with verbose output
pytest backend/ -v

# Run with detailed output
pytest backend/ -vv
```

---

## Frontend Testing

### Setup

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Component Tests

Create `frontend/src/components/__tests__/Navbar.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'
import { useAuthStore } from '../../store/authStore'

// Mock the auth store
jest.mock('../../store/authStore')

describe('Navbar Component', () => {
  it('renders navigation links', () => {
    const mockUser = { email: 'test@example.com', displayName: 'Test User' }
    ;(useAuthStore as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    })

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Generate')).toBeInTheDocument()
    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('displays user email', () => {
    const mockUser = { email: 'test@example.com', displayName: 'Test User' }
    ;(useAuthStore as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    })

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })
})
```

Create `frontend/src/pages/__tests__/LoginPage.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'

describe('LoginPage', () => {
  it('renders login button', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument()
  })

  it('displays AstroAI branding', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByText('AstroAI')).toBeInTheDocument()
    expect(screen.getByText(/Vedic Astrology Meets AI/i)).toBeInTheDocument()
  })
})
```

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test Navbar.test.tsx

# Watch mode
npm test -- --watch

# Update snapshots
npm test -- -u
```

---

## Integration Tests

### Backend + Database

Create `backend/test_integration.py`:

```python
import pytest
from firebase_config import FirebaseService
from astrology_service import AstrologyService

@pytest.fixture
def firebase_service():
    return FirebaseService()

@pytest.fixture
def astrology_service():
    return AstrologyService()

@pytest.mark.asyncio
async def test_full_kundli_workflow(firebase_service, astrology_service):
    """Test complete kundli generation and storage"""
    
    # Generate kundli
    birth_data = {
        "name": "Integration Test User",
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
    
    kundli = astrology_service.generate_kundli(birth_data)
    assert kundli is not None
    
    # Store in database
    user_id = "test-user-123"
    kundli_id = firebase_service.save_calculation(
        user_id=user_id,
        calculation_type="kundli",
        birth_data=birth_data,
        result=kundli
    )
    assert kundli_id is not None
    
    # Retrieve from database
    retrieved = firebase_service.get_calculation(kundli_id)
    assert retrieved is not None
    assert retrieved["birth_data"]["name"] == "Integration Test User"
```

---

## End-to-End Tests

### Using Playwright

Create `frontend/e2e/login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('http://localhost:3000')
    expect(page.url()).toContain('/login')
  })

  test('should display login form', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    const loginButton = page.locator('button:has-text("Sign in with Google")')
    await expect(loginButton).toBeVisible()
  })

  test('should redirect to dashboard after login', async ({ page, context }) => {
    // This test requires actual Firebase credentials
    // Skip in CI/CD without proper setup
    test.skip(process.env.CI === 'true', 'Requires Firebase credentials')
    
    await page.goto('http://localhost:3000/login')
    
    const loginButton = page.locator('button:has-text("Sign in with Google")')
    await loginButton.click()
    
    // Wait for redirect
    await page.waitForURL('**/dashboard')
    expect(page.url()).toContain('/dashboard')
  })
})
```

Create `frontend/e2e/kundli-generation.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Kundli Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to generator page
    await page.goto('http://localhost:3000/generate')
  })

  test('should display kundli form', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).toBeVisible()
  })

  test('should submit form and generate kundli', async ({ page }) => {
    // Fill form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="place_name"]', 'Chennai,IN')
    await page.fill('input[name="latitude"]', '13.0827')
    await page.fill('input[name="longitude"]', '80.2707')
    await page.fill('input[name="year"]', '1990')
    await page.fill('input[name="month"]', '6')
    await page.fill('input[name="day"]', '15')
    await page.fill('input[name="hour"]', '10')
    await page.fill('input[name="minute"]', '30')
    
    // Submit form
    const submitButton = page.locator('button:has-text("Generate Kundli")')
    await submitButton.click()
    
    // Wait for results page
    await page.waitForURL('**/results/**')
    expect(page.url()).toContain('/results/')
  })
})
```

### Run E2E Tests

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific test
npx playwright test e2e/login.spec.ts

# Debug mode
npx playwright test --debug
```

---

## Performance Testing

### Load Testing with Apache JMeter

Create `backend/jmeter/astroai-load-test.jmx`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testname="AstroAI Load Test">
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments"/>
      <stringProp name="TestPlan.comments">Load test for AstroAI API</stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testname="User Defined Variables"/>
      <stringProp name="TestPlan.user_define_variables"></stringProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testname="API Users">
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testname="Loop Controller">
          <boolProp name="LoopController.continue_forever">false</boolProp>
          <stringProp name="LoopController.loops">10</stringProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">10</stringProp>
        <stringProp name="ThreadGroup.ramp_time">60</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
      </ThreadGroup>
      <hashTree>
        <HTTPSampler guiclass="HttpTestSampleGui" testname="Health Check">
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testname="User Defined Variables"/>
          <stringProp name="HTTPSampler.domain">localhost</stringProp>
          <stringProp name="HTTPSampler.port">8000</stringProp>
          <stringProp name="HTTPSampler.protocol">http</stringProp>
          <stringProp name="HTTPSampler.path">/health</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
        </HTTPSampler>
        <hashTree/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

### Load Testing with Apache Bench

```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:8000/health

# Test with POST data
ab -n 100 -c 5 -p data.json -T application/json http://localhost:8000/api/charts/available
```

### Load Testing with wrk

```bash
# Install wrk
# macOS: brew install wrk
# Linux: apt-get install wrk

# Basic load test
wrk -t4 -c100 -d30s http://localhost:8000/health

# With custom script
wrk -t4 -c100 -d30s -s script.lua http://localhost:8000/api/kundli/generate
```

---

## Security Testing

### Authentication Tests

```python
# backend/test_security.py
import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_protected_endpoint_requires_auth(client):
    """Test that protected endpoints require authentication"""
    response = client.get("/api/user/profile")
    assert response.status_code == 403

def test_invalid_token_rejected(client):
    """Test that invalid tokens are rejected"""
    response = client.get(
        "/api/user/profile",
        headers={"Authorization": "Bearer invalid-token"}
    )
    assert response.status_code == 403

def test_expired_token_rejected(client):
    """Test that expired tokens are rejected"""
    # This requires generating an expired token
    expired_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
    response = client.get(
        "/api/user/profile",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 403
```

### CORS Tests

```python
def test_cors_headers(client):
    """Test CORS headers are set correctly"""
    response = client.options("/api/kundli/generate")
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] == "*"
```

### SQL Injection Tests

```python
def test_sql_injection_protection(client):
    """Test that SQL injection attempts are blocked"""
    malicious_input = "'; DROP TABLE users; --"
    response = client.post(
        "/api/kundli/generate",
        json={
            "birth_data": {
                "name": malicious_input,
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
        },
        headers={"Authorization": "Bearer valid-token"}
    )
    # Should handle gracefully, not execute SQL
    assert response.status_code in [200, 400, 422]
```

---

## Test Coverage

### Generate Coverage Report

```bash
# Backend coverage
pytest backend/ --cov=backend --cov-report=html --cov-report=term

# Frontend coverage
npm test -- --coverage

# View reports
# Backend: htmlcov/index.html
# Frontend: coverage/index.html
```

### Coverage Goals

- **Backend**: > 80% coverage
- **Frontend**: > 70% coverage
- **Critical paths**: 100% coverage

---

## Continuous Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt pytest pytest-cov
      - run: pytest backend/ --cov=backend

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm test -- --coverage
      - run: cd frontend && npm run build
```

---

## Testing Checklist

### Before Deployment

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Code coverage > 80%
- [ ] No security vulnerabilities
- [ ] Performance tests pass
- [ ] Load tests pass
- [ ] Database migrations tested
- [ ] Error handling tested
- [ ] Edge cases tested

### Manual Testing

- [ ] Login with Google works
- [ ] Login with email works
- [ ] Kundli generation works
- [ ] Charts display correctly
- [ ] History saves and loads
- [ ] Settings update correctly
- [ ] Logout works
- [ ] Protected routes redirect
- [ ] Error messages display
- [ ] Loading states show

### Deployment Testing

- [ ] Docker build succeeds
- [ ] Services start correctly
- [ ] Health check passes
- [ ] API endpoints respond
- [ ] Frontend loads
- [ ] Cloudflare Tunnel connects
- [ ] Remote access works
- [ ] HTTPS works
- [ ] Database persists
- [ ] No errors in logs

---

## Test Execution Schedule

| Test Type | Frequency | Time |
|-----------|-----------|------|
| Unit Tests | Every commit | < 5 min |
| Integration Tests | Every push | < 10 min |
| E2E Tests | Daily | < 30 min |
| Performance Tests | Weekly | < 1 hour |
| Security Tests | Weekly | < 30 min |
| Load Tests | Monthly | < 2 hours |

---

**Last Updated**: April 2026  
**Status**: Complete Testing Framework
