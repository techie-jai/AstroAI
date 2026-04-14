# Start Admin Panel with Backend

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "Starting AstroAI Admin Panel with Real Data" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "`n1. Starting Backend (Python)..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "python" -ArgumentList "backend/main.py" -WorkingDirectory $scriptDir -PassThru -NoNewWindow
Write-Host "   Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

# Wait for backend to start
Write-Host "   Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Admin Panel
Write-Host "`n2. Starting Admin Panel (Node)..." -ForegroundColor Yellow
$adminProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "$scriptDir/admin-panel" -PassThru -NoNewWindow
Write-Host "   Admin panel started (PID: $($adminProcess.Id))" -ForegroundColor Green

Write-Host "`n================================================================================" -ForegroundColor Cyan
Write-Host "✅ Services Started Successfully!" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:     http://localhost:8000" -ForegroundColor Cyan
Write-Host "Admin Panel: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Keep the script running
while ($true) {
    Start-Sleep -Seconds 1
}
