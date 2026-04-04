# AstroAI Complete Startup Script (PowerShell)
# Directly starts backend and React frontend without options

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "AstroAI Complete Startup" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$ProjectRoot = Get-Location
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"

Write-Host "Starting Backend..." -ForegroundColor Green
Write-Host "Command: cd backend && python main.py" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendDir'; python main.py"

Write-Host "Waiting 8 seconds for backend to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "Starting Web Dashboard (React)..." -ForegroundColor Green
Write-Host "Command: cd frontend && npm run dev" -ForegroundColor Yellow
Write-Host ""

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendDir'; npm run dev"

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "Services Starting" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000 (or 3001 if 3000 is in use)" -ForegroundColor Green
Write-Host ""
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "Done! Services are starting in separate windows." -ForegroundColor Green
Write-Host "Check the terminal windows for logs." -ForegroundColor Cyan
Write-Host ""
