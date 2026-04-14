# AstroAI Complete Startup Script (PowerShell)
# Simplified Kundli Architecture - Complete startup script with data validation

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "AstroAI Complete Startup - Simplified Kundli Architecture" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$ProjectRoot = Get-Location
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"
$AdminPanelDir = Join-Path $ProjectRoot "admin-panel"

# Create users directory for local Kundli storage with hash-based naming
$UsersDir = Join-Path $ProjectRoot "users"
if (!(Test-Path $UsersDir)) {
    New-Item -ItemType Directory -Path $UsersDir -Force
    Write-Host "Created users directory for local Kundli storage: $UsersDir" -ForegroundColor Green
}

# ============================================================================
# VALIDATE ADMIN PANEL DATA
# ============================================================================
Write-Host ""
Write-Host "Validating admin panel data..." -ForegroundColor Yellow
Write-Host ""

python "$BackendDir\validate_admin_data.py"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "OK: Data validation successful" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "WARNING: Data validation had warnings, continuing..." -ForegroundColor Yellow
}

Write-Host ""

Write-Host "Starting Backend..." -ForegroundColor Green
Write-Host "Command: cd backend; python main.py" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendDir'; python main.py"

Write-Host "Waiting 5 seconds for backend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Starting Frontend..." -ForegroundColor Green

# Check if node_modules exists and vite is installed
$ViteBin = Join-Path $FrontendDir "node_modules\.bin\vite.cmd"
if (!(Test-Path $ViteBin)) {
    Write-Host "Frontend dependencies missing or incomplete, running npm install..." -ForegroundColor Yellow
    Push-Location $FrontendDir
    npm install
    Pop-Location
    Write-Host "npm install completed for frontend" -ForegroundColor Green
}

Write-Host "Command: cd frontend; npm run dev" -ForegroundColor Yellow
Write-Host ""

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendDir'; npm run dev"

Write-Host "Waiting 3 seconds for frontend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Admin Panel..." -ForegroundColor Green

# Check if node_modules exists and vite is installed
$AdminViteBin = Join-Path $AdminPanelDir "node_modules\.bin\vite.cmd"
if (!(Test-Path $AdminViteBin)) {
    Write-Host "Admin panel dependencies missing or incomplete, running npm install..." -ForegroundColor Yellow
    Push-Location $AdminPanelDir
    npm install
    Pop-Location
    Write-Host "npm install completed for admin panel" -ForegroundColor Green
}

Write-Host "Command: cd admin-panel; npm run dev" -ForegroundColor Yellow
Write-Host ""

# Start admin panel in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$AdminPanelDir'; npm run dev"

Write-Host ""
Write-Host "Services are starting up..." -ForegroundColor Cyan
Write-Host "Backend:     http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend:    http://localhost:3000" -ForegroundColor Yellow
Write-Host "Admin Panel: http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Features:" -ForegroundColor Green
Write-Host "  Local Kundli Storage: Enabled" -ForegroundColor Cyan
Write-Host "  Firebase Integration: Enabled" -ForegroundColor Cyan
Write-Host "  Admin Dashboard: Real data from local storage" -ForegroundColor Cyan
Write-Host "  Divisional Charts: All D1-D60" -ForegroundColor Cyan
Write-Host "  AI Analysis: Enhanced with complete data" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Panel Data Sources:" -ForegroundColor Green
Write-Host "  Users: Firebase + Local filesystem" -ForegroundColor Cyan
Write-Host "  Kundlis: Local filesystem (users/kundli_index.json)" -ForegroundColor Cyan
Write-Host "  Analytics: Computed from local storage" -ForegroundColor Cyan
Write-Host "  User Growth: Real data from filesystem timestamps" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to open the frontend in your browser..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Startup complete! Check the separate windows for each service." -ForegroundColor Green
Write-Host "Press Ctrl+C in each window to stop the services." -ForegroundColor Yellow
Write-Host ""
Write-Host "Check the terminal windows for logs." -ForegroundColor Cyan
Write-Host ""
