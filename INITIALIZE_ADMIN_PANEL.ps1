# Initialize Admin Panel with Real Data
# This script:
# 1. Validates/generates data in users/ directory
# 2. Shows logs on screen
# 3. Starts backend to serve the data
# 4. Starts admin panel to display it

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "AstroAI Admin Panel - Data Initialization & Startup" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Get project root
$ProjectRoot = Get-Location
$UsersDir = Join-Path $ProjectRoot "users"
$KundliIndex = Join-Path $UsersDir "kundli_index.json"
$BackendDir = Join-Path $ProjectRoot "backend"
$AdminPanelDir = Join-Path $ProjectRoot "admin-panel"

# ============================================================================
# STEP 1: Validate Data with Python Script
# ============================================================================
Write-Host "STEP 1: Validating Admin Panel Data" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host ""

# Run validation script
Write-Host "Running data validation..." -ForegroundColor Cyan
Write-Host ""

python "$BackendDir\validate_admin_data.py"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠ Data validation had warnings, but continuing..." -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# STEP 2: Start Backend
# ============================================================================
Write-Host "STEP 2: Starting Backend (Python FastAPI)" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Starting backend on port 8000..." -ForegroundColor Cyan
Write-Host "Command: python backend/main.py" -ForegroundColor Gray
Write-Host ""

# Start backend in a new window
$BackendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendDir'; python main.py" -PassThru
Write-Host "✓ Backend started (PID: $($BackendProcess.Id))" -ForegroundColor Green

# Wait for backend to initialize
Write-Host "Waiting 5 seconds for backend to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host ""

# ============================================================================
# STEP 3: Start Admin Panel
# ============================================================================
Write-Host "STEP 3: Starting Admin Panel (React/Vite)" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host ""

# Check if node_modules exists
$AdminViteBin = Join-Path $AdminPanelDir "node_modules\.bin\vite.cmd"
if (!(Test-Path $AdminViteBin)) {
    Write-Host "Installing admin panel dependencies..." -ForegroundColor Yellow
    cmd /c "cd $AdminPanelDir && npm install"
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting admin panel on port 3001..." -ForegroundColor Cyan
Write-Host "Command: npm run dev" -ForegroundColor Gray
Write-Host ""

# Start admin panel in a new window
$AdminProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$AdminPanelDir'; npm run dev" -PassThru
Write-Host "✓ Admin panel started (PID: $($AdminProcess.Id))" -ForegroundColor Green

# Wait for admin panel to initialize
Write-Host "Waiting 3 seconds for admin panel to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host ""

# ============================================================================
# STEP 4: Summary & Instructions
# ============================================================================
Write-Host "================================================================================" -ForegroundColor Green
Write-Host "✓ INITIALIZATION COMPLETE" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Services Running:" -ForegroundColor Cyan
Write-Host "  • Backend:     http://localhost:8000" -ForegroundColor Green
Write-Host "  • Admin Panel: http://localhost:3001" -ForegroundColor Green
Write-Host ""

Write-Host "Data Sources:" -ForegroundColor Cyan
Write-Host "  • Location:    $UsersDir" -ForegroundColor Green
Write-Host "  • Index File:  $KundliIndex" -ForegroundColor Green
Write-Host "  • Kundlis:     $KundliCount" -ForegroundColor Green
Write-Host "  • Users:       $($Users.Count)" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open browser: http://localhost:3001" -ForegroundColor Yellow
Write-Host "  2. Login with admin credentials" -ForegroundColor Yellow
Write-Host "  3. Check DevTools (F12) Console for logs" -ForegroundColor Yellow
Write-Host "  4. Dashboard should show real data from users/ directory" -ForegroundColor Yellow
Write-Host ""

Write-Host "Monitoring:" -ForegroundColor Cyan
Write-Host "  • Backend logs: Check backend terminal window" -ForegroundColor Yellow
Write-Host "  • Frontend logs: Check browser DevTools Console (F12)" -ForegroundColor Yellow
Write-Host "  • API calls: Network tab in DevTools" -ForegroundColor Yellow
Write-Host ""

Write-Host "To Stop All Services:" -ForegroundColor Cyan
Write-Host "  • Run: .\stop_all.ps1" -ForegroundColor Yellow
Write-Host ""

Write-Host "================================================================================" -ForegroundColor Green
Write-Host ""

# Keep script running
Write-Host "Press Ctrl+C to exit this script (services will continue running)" -ForegroundColor Gray
Write-Host ""

while ($true) {
    Start-Sleep -Seconds 1
}
